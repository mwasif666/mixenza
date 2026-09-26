import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/theOnlineStore'
import type { ProductType } from '@/type/ProductType'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const CART_COOKIE = 'mixenza-guest-cart-v1'
const MAX_ITEMS = 25

type ProductSnapshot = Pick<ProductType, 'id' | 'name' | 'price' | 'originPrice' | 'thumbImage' | 'slug' | 'category'>

type StoredCartItem = {
    productId: string
    quantity: number
    selectedSize: string
    selectedColor: string
    snapshot?: ProductSnapshot
}

const cleanText = (value: unknown, max = 80) => String(value || '').trim().slice(0, max)

const cleanQuantity = (value: unknown) => {
    const quantity = Math.floor(Number(value))
    return Number.isFinite(quantity) ? Math.min(99, Math.max(1, quantity)) : 1
}

const isDatabaseId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

const cleanSnapshot = (value: unknown, productId: string): ProductSnapshot | undefined => {
    if (!value || typeof value !== 'object') return undefined
    const snapshot = value as Partial<ProductSnapshot>
    const name = cleanText(snapshot.name, 120)
    const price = Number(snapshot.price)
    if (!name || !Number.isFinite(price) || price < 0) return undefined
    return {
        id: productId,
        name,
        price,
        originPrice: Math.max(price, Number(snapshot.originPrice) || price),
        thumbImage: cleanText(snapshot.thumbImage?.[0], 500) ? [cleanText(snapshot.thumbImage?.[0], 500)] : [],
        slug: cleanText(snapshot.slug, 160),
        category: cleanText(snapshot.category, 80) || 'General',
    }
}

const normalizeItems = (value: unknown): StoredCartItem[] => {
    if (!Array.isArray(value)) return []
    const unique = new Map<string, StoredCartItem>()
    for (const raw of value.slice(0, MAX_ITEMS)) {
        if (!raw || typeof raw !== 'object') continue
        const item = raw as Record<string, unknown>
        const productId = cleanText(item.productId || item.id, 80)
        if (!productId) continue
        const selectedSize = cleanText(item.selectedSize, 60)
        const selectedColor = cleanText(item.selectedColor, 60)
        const key = `${productId}::${selectedSize}::${selectedColor}`
        unique.set(key, {
            productId,
            quantity: cleanQuantity(item.quantity),
            selectedSize,
            selectedColor,
            // Database products are always refreshed from the live catalog.
            // A small snapshot keeps old template products usable without trusting it for live prices.
            ...(!isDatabaseId(productId) ? { snapshot: cleanSnapshot(item.snapshot, productId) } : {}),
        })
    }
    return Array.from(unique.values())
}

const decodeItems = (value?: string): StoredCartItem[] => {
    if (!value) return []
    try {
        return normalizeItems(JSON.parse(Buffer.from(value, 'base64url').toString('utf8')))
    } catch {
        return []
    }
}

const snapshotToProduct = (snapshot: ProductSnapshot): ProductType => ({
    ...snapshot,
    type: snapshot.category,
    gender: 'unisex',
    new: false,
    sale: snapshot.originPrice > snapshot.price,
    rate: 0,
    brand: 'Mixenza',
    sold: 0,
    quantity: 99,
    quantityPurchase: 1,
    sizes: [],
    variation: [],
    images: snapshot.thumbImage,
    description: '',
    action: 'add to cart',
})

const hydrateItems = async (storedItems: StoredCartItem[]) => {
    if (!storedItems.length) return []
    const { products } = await getCatalog()
    const productsById = new Map(products.map(product => [String(product.id), product]))
    return storedItems.flatMap(item => {
        const product = productsById.get(item.productId) || (item.snapshot ? snapshotToProduct(item.snapshot) : null)
        if (!product || product.quantity === 0) return []
        const quantity = Math.min(item.quantity, Math.max(1, Number(product.quantity) || item.quantity))
        return [{
            product,
            quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            price: product.price,
            lineTotal: product.price * quantity,
        }]
    })
}

const responseFor = async (items: StoredCartItem[]) => {
    const hydratedItems = await hydrateItems(items)
    const subtotal = hydratedItems.reduce((sum, item) => sum + item.lineTotal, 0)
    return NextResponse.json({
        success: true,
        data: {
            items: hydratedItems,
            count: hydratedItems.length,
            totalItems: hydratedItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            grandTotal: subtotal,
        },
    }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function GET() {
    return responseFor(decodeItems(cookies().get(CART_COOKIE)?.value))
}

export async function PUT(request: Request) {
    try {
        const body = await request.json() as { items?: unknown }
        const items = normalizeItems(body.items)
        const encoded = Buffer.from(JSON.stringify(items)).toString('base64url')
        const response = await responseFor(items)
        response.cookies.set(CART_COOKIE, encoded, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        })
        return response
    } catch {
        return NextResponse.json({ success: false, message: 'Invalid cart payload' }, { status: 400 })
    }
}

export async function DELETE() {
    const response = await responseFor([])
    response.cookies.set(CART_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    })
    return response
}
