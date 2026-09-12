'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import Logo from '@/components/Brand/Logo'
import useLoginPopup from '@/store/useLoginPopup'
import useMenuMobile from '@/store/useMenuMobile'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCart } from '@/context/CartContext'
import { loadCatalog } from '@/lib/catalogClient'

type Product = {
    id: string
    name: string
    price: number
    originPrice: number
    thumbImage?: string[]
    images?: string[]
    categories?: string[]
    tags?: string[]
    quantity?: number
}

type Category = { name: string; slug: string; count: number }
type Catalog = { products?: Product[]; categories?: Category[] }

export default function DynamicMarketplaceHeader() {
    const [catalog, setCatalog] = useState<Catalog>({ products: [], categories: [] })
    const [openDepartment, setOpenDepartment] = useState(false)
    const [openShop, setOpenShop] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [catalogLoading, setCatalogLoading] = useState(true)
    const [catalogError, setCatalogError] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { handleMenuMobile } = useMenuMobile()
    const { openModalCart } = useModalCartContext()
    const { openModalWishlist } = useModalWishlistContext()
    const { cartState } = useCart()

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const data: Catalog = await loadCatalog()
                if (!cancelled) {
                    setCatalog({
                        products: Array.isArray(data.products) ? data.products : [],
                        categories: Array.isArray(data.categories) ? data.categories : [],
                    })
                }
            } catch {
                if (!cancelled) setCatalogError(true)
            } finally {
                if (!cancelled) setCatalogLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        const close = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    const products = catalog.products || []
    const categories = catalog.categories || []

    const suggestions = useMemo(() => {
        const value = keyword.trim().toLowerCase()
        if (!value) return []
        return products
            .filter(product => [product.name, ...(product.categories || []), ...(product.tags || [])].some(item => String(item).toLowerCase().includes(value)))
            .slice(0, 6)
    }, [keyword, products])

    const search = (value = keyword) => {
        const query = value.trim()
        if (!query) return
        setSearchOpen(false)
        router.push(`/search-result?query=${encodeURIComponent(query)}`)
    }

    return (
        <header className="site-global-marketplace-header relative z-[100] w-full bg-white">
            <div className="md:h-[44px] h-[34px] bg-brand-dark border-b border-surface1">
                <div className="container mx-auto h-full flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-5 text-white text-xs">
                        <span>English</span>
                        <span>PKR</span>
                    </div>
                    <div className="text-center text-button-uppercase text-white flex-1">
                        New customers save 10% with the code GET10
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-white text-xs">
                        <span>f</span><span>◎</span><span>▶</span><span>𝕏</span><span>p</span>
                    </div>
                </div>
            </div>

            <div className="header-menu-main style-marketplace relative bg-brand w-full md:h-[74px] h-[56px]">
                <div className="container mx-auto h-full">
                    <div className="header-main flex items-center justify-between h-full gap-4">
                        <button className="lg:hidden text-white" onClick={handleMenuMobile} aria-label="Open menu"><Icon.List size={24} /></button>
                        <Logo variant="light" height={26} priority />
                        <div ref={searchRef} className="form-search relative flex-1 max-w-[760px] pl-4 max-lg:hidden">
                            <div className="w-full flex items-center h-[44px]">
                                <input
                                    className="search-input h-full px-4 w-full border border-line rounded-l"
                                    placeholder="Search products, categories..."
                                    value={keyword}
                                    onFocus={() => setSearchOpen(true)}
                                    onChange={event => { setKeyword(event.target.value); setSearchOpen(true) }}
                                    onKeyDown={event => event.key === 'Enter' && search()}
                                />
                                <button onClick={() => search()} className="button-main bg-red text-white h-full px-7 rounded-l-none rounded-r">Search</button>
                            </div>
                            {searchOpen && keyword.trim() && (
                                <div className="absolute left-4 right-0 top-[48px] z-[120] rounded-xl border border-line bg-white p-2 shadow-xl">
                                    {suggestions.length ? suggestions.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/product/default?id=${encodeURIComponent(product.id)}`}
                                            onClick={() => setSearchOpen(false)}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface"
                                        >
                                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-surface">
                                                {product.thumbImage?.[0] && <img src={product.thumbImage[0]} alt="" className="h-full w-full object-cover" loading="lazy" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm">{product.name}</div>
                                                <div className="text-xs text-secondary">Rs. {Number(product.price || 0).toLocaleString('en-PK')}</div>
                                            </div>
                                        </Link>
                                    )) : <button type="button" onClick={() => search()} className="w-full px-3 py-3 text-left text-sm text-secondary hover:bg-surface">Search for “{keyword.trim()}”</button>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <button onClick={handleLoginPopup} aria-label="Account"><Icon.User weight="bold" size={23} /></button>
                            <button onClick={openModalWishlist} aria-label="Wishlist" className="max-md:hidden"><Icon.Heart weight="bold" size={23} /></button>
                            <button onClick={openModalCart} aria-label="Cart" className="relative"><Icon.Handbag weight="bold" size={23} /><span className="absolute -right-2 -top-2 text-[10px] text-white bg-red w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-line h-[52px] max-lg:hidden bg-white">
                <div className="container mx-auto h-full flex items-center">
                    <div className="relative h-full flex items-center pr-8 border-r border-line">
                        <button onClick={() => setOpenDepartment(value => !value)} className="h-full flex items-center gap-3 text-button-uppercase" aria-expanded={openDepartment}>
                            <Icon.List size={19} /> Department <Icon.CaretDown size={17} />
                        </button>
                        {openDepartment && (
                            <div className="absolute top-full left-0 w-[320px] max-h-[70vh] overflow-y-auto bg-white border border-line rounded-b-xl shadow-lg p-2">
                                {categories.length ? categories.map(category => (
                                    <Link key={category.slug} href={`/shop/breadcrumb1?category=${encodeURIComponent(category.name)}`} onClick={() => setOpenDepartment(false)} className="flex items-center justify-between px-4 py-3 border-b border-line last:border-b-0 hover:bg-surface">
                                        <span>{category.name}</span><span className="text-xs text-secondary">{category.count}</span>
                                    </Link>
                                )) : <div className="px-4 py-3 text-secondary">{catalogLoading ? 'Loading categories...' : catalogError ? 'Categories unavailable. Please reload.' : 'No categories yet.'}</div>}
                            </div>
                        )}
                    </div>

                    <nav className="flex items-center gap-8 pl-8 h-full">
                        <Link href="/homepages/marketplace" className="text-button-uppercase">Demo</Link>
                        <div className="relative h-full flex items-center">
                            <button onClick={() => setOpenShop(value => !value)} className="text-button-uppercase flex items-center gap-1" aria-expanded={openShop}>Shop <Icon.CaretDown size={14} /></button>
                            {openShop && (
                                <div className="absolute top-full left-0 w-[760px] max-h-[70vh] overflow-y-auto bg-white border border-line rounded-b-xl shadow-lg p-7 grid grid-cols-4 gap-6">
                                    {categories.map(category => (
                                        <Link key={category.slug} href={`/shop/breadcrumb1?category=${encodeURIComponent(category.name)}`} onClick={() => setOpenShop(false)} className="text-secondary hover:text-black">
                                            <span className="block">{category.name}</span><span className="text-xs text-secondary2">{category.count} products</span>
                                        </Link>
                                    ))}
                                    {!categories.length && <span className="text-secondary col-span-4">{catalogLoading ? 'Loading categories...' : catalogError ? 'Categories unavailable. Please reload.' : 'No categories yet.'}</span>}
                                    {categories.length > 0 && <Link href="/shop/breadcrumb1" onClick={() => setOpenShop(false)} className="font-medium">View All Products</Link>}
                                </div>
                            )}
                        </div>
                        <Link href="/shop/breadcrumb1" className="text-button-uppercase">Product</Link>
                        <Link href="/blog" className="text-button-uppercase">Blog</Link>
                        <Link href="/pages/contact" className="text-button-uppercase">Pages</Link>
                    </nav>
                </div>
            </div>

            <div className={`login-popup absolute top-[118px] right-8 w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? 'open' : ''}`}>
                <Link href="/login" className="button-main w-full text-center">Login</Link>
                <div className="text-secondary text-center mt-3 pb-4">Don’t have an account? <Link href="/register" className="text-black pl-1 hover:underline">Register</Link></div>
                <Link href="/my-account" className="button-main bg-white text-black border border-black w-full text-center">Dashboard</Link>
            </div>
        </header>
    )
}
