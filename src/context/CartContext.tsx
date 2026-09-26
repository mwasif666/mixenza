'use client'

import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import type { ProductType } from '@/type/ProductType'

export interface CartItem extends ProductType {
    quantity: number
    selectedSize: string
    selectedColor: string
}

interface CartState {
    cartArray: CartItem[]
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: ProductType }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | {
        type: 'UPDATE_CART'
        payload: { itemId: string; quantity: number; selectedSize: string; selectedColor: string }
    }
    | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextProps {
    cartState: CartState
    isLoading: boolean
    syncError: string
    addToCart: (item: ProductType) => void
    removeFromCart: (itemId: string) => void
    updateCart: (itemId: string, quantity: number, selectedSize: string, selectedColor: string) => void
    clearCart: () => void
}

type CartApiResponse = {
    success: boolean
    data?: {
        items?: Array<{
            product: ProductType
            quantity: number
            selectedSize?: string
            selectedColor?: string
        }>
    }
}

const LOCAL_CART_KEY = 'mixenza-cart-cache-v1'
const CartContext = createContext<CartContextProps | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.cartArray.find(item => item.id === action.payload.id)
            if (existing) {
                return {
                    cartArray: state.cartArray.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: Math.max(1, action.payload.quantityPurchase || item.quantity) }
                            : item,
                    ),
                }
            }
            const newItem: CartItem = {
                ...action.payload,
                quantity: Math.max(1, action.payload.quantityPurchase || 1),
                selectedSize: '',
                selectedColor: '',
            }
            return { cartArray: [...state.cartArray, newItem] }
        }
        case 'REMOVE_FROM_CART':
            return { cartArray: state.cartArray.filter(item => item.id !== action.payload) }
        case 'UPDATE_CART':
            return {
                cartArray: state.cartArray.map(item =>
                    item.id === action.payload.itemId
                        ? {
                            ...item,
                            quantity: Math.max(1, action.payload.quantity),
                            selectedSize: action.payload.selectedSize,
                            selectedColor: action.payload.selectedColor,
                        }
                        : item,
                ),
            }
        case 'LOAD_CART':
            return { cartArray: action.payload }
        default:
            return state
    }
}

const fromApi = (response: CartApiResponse): CartItem[] =>
    (response.data?.items || [])
        .filter(item => item.product?.id)
        .map(item => ({
            ...item.product,
            quantity: Math.max(1, Number(item.quantity) || 1),
            quantityPurchase: Math.max(1, Number(item.quantity) || 1),
            selectedSize: item.selectedSize || '',
            selectedColor: item.selectedColor || '',
        }))

const readLocalCart = (): CartItem[] => {
    try {
        const value = window.localStorage.getItem(LOCAL_CART_KEY)
        if (!value) return []
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed.filter(item => item?.id) : []
    } catch {
        return []
    }
}

const writeLocalCart = (items: CartItem[]) => {
    try {
        const value = JSON.stringify(items)
        if (window.localStorage.getItem(LOCAL_CART_KEY) !== value) {
            window.localStorage.setItem(LOCAL_CART_KEY, value)
        }
    } catch {
        // The HttpOnly API cookie remains the primary persistence layer.
    }
}

const apiPayload = (items: CartItem[]) => ({
    items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        snapshot: {
            id: item.id,
            name: item.name,
            price: item.price,
            originPrice: item.originPrice,
            thumbImage: item.thumbImage?.slice(0, 1) || [],
            slug: item.slug,
            category: item.category,
        },
    })),
})

const requestCart = async (method: 'GET' | 'PUT' | 'DELETE' = 'GET', items?: CartItem[]) => {
    const response = await fetch('/api/cart', {
        method,
        cache: 'no-store',
        credentials: 'same-origin',
        headers: method === 'PUT' ? { 'Content-Type': 'application/json' } : undefined,
        body: method === 'PUT' ? JSON.stringify(apiPayload(items || [])) : undefined,
    })
    const payload = await response.json() as CartApiResponse & { message?: string }
    if (!response.ok || !payload.success) throw new Error(payload.message || 'Cart could not be synced')
    return fromApi(payload)
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, { cartArray: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [syncError, setSyncError] = useState('')
    const hydrated = useRef(false)
    const suppressNextSync = useRef(false)
    const syncTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        let cancelled = false
        const cached = readLocalCart()
        if (cached.length) {
            dispatch({ type: 'LOAD_CART', payload: cached })
            setIsLoading(false)
        }

        const hydrate = async () => {
            try {
                let remote = await requestCart()
                if (!remote.length && cached.length) {
                    remote = await requestCart('PUT', cached)
                }
                if (!cancelled) {
                    dispatch({ type: 'LOAD_CART', payload: remote })
                    writeLocalCart(remote)
                    setSyncError('')
                }
            } catch {
                if (!cancelled) setSyncError('Cart is available offline and will sync automatically.')
            } finally {
                if (!cancelled) {
                    hydrated.current = true
                    setIsLoading(false)
                }
            }
        }
        void hydrate()

        const onStorage = (event: StorageEvent) => {
            if (event.key !== LOCAL_CART_KEY || !hydrated.current) return
            suppressNextSync.current = true
            dispatch({ type: 'LOAD_CART', payload: readLocalCart() })
        }
        window.addEventListener('storage', onStorage)
        return () => {
            cancelled = true
            window.removeEventListener('storage', onStorage)
            if (syncTimer.current) clearTimeout(syncTimer.current)
        }
    }, [])

    useEffect(() => {
        if (!hydrated.current) return
        if (suppressNextSync.current) {
            suppressNextSync.current = false
            return
        }

        writeLocalCart(cartState.cartArray)
        if (syncTimer.current) clearTimeout(syncTimer.current)
        syncTimer.current = setTimeout(() => {
            requestCart('PUT', cartState.cartArray)
                .then(() => setSyncError(''))
                .catch(() => setSyncError('Cart changes are saved locally and will sync automatically.'))
        }, 120)
    }, [cartState.cartArray])

    const addToCart = (item: ProductType) => dispatch({ type: 'ADD_TO_CART', payload: item })

    const removeFromCart = (itemId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: itemId })

    const updateCart = (itemId: string, quantity: number, selectedSize: string, selectedColor: string) =>
        dispatch({ type: 'UPDATE_CART', payload: { itemId, quantity, selectedSize, selectedColor } })

    const clearCart = () => {
        dispatch({ type: 'LOAD_CART', payload: [] })
        writeLocalCart([])
        void requestCart('DELETE').catch(() => setSyncError('Cart changes are saved locally and will sync automatically.'))
    }

    return (
        <CartContext.Provider value={{ cartState, isLoading, syncError, addToCart, removeFromCart, updateCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
