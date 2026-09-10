import { ProductType } from '@/type/ProductType'

export const SOURCE_ORIGIN = 'https://theonlinestore.com.pk'
const API_ORIGIN = SOURCE_ORIGIN

type ShopifyImage = {
    id: number
    src: string
    alt?: string | null
}

type ShopifyVariant = {
    id: number
    title?: string
    price?: string
    compare_at_price?: string | null
    available?: boolean
    inventory_quantity?: number | null
    option1?: string | null
    option2?: string | null
    option3?: string | null
}

type ShopifyProduct = {
    id: number
    title: string
    handle: string
    body_html?: string
    product_type?: string
    vendor?: string
    tags?: string | string[]
    published_at?: string | null
    created_at?: string
    updated_at?: string
    images?: ShopifyImage[]
    variants?: ShopifyVariant[]
}

type ShopifyProductsResponse = { products: ShopifyProduct[] }

export type SourceCategory = {
    id: number
    name: string
    slug: string
    count: number
}

export type SourceProduct = ProductType & {
    sourceId: number
    sourceUrl: string
    sourceHandle: string
    categories: string[]
    tags: string[]
    sku?: string
    stockStatus: string
}

async function fetchStoreApi<T>(path: string): Promise<T> {
    const response = await fetch(`${API_ORIGIN}${path}`, {
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
            'User-Agent': 'Mixenza/1.0 catalog sync',
        },
    })

    if (!response.ok) {
        throw new Error(`TheOnlineStore catalog request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
}

function stripHtml(value = '') {
    return value
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&#x27;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

function money(value: string | undefined | null) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function normalizeTags(tags: string | string[] | undefined) {
    if (Array.isArray(tags)) return tags.map(tag => tag.trim()).filter(Boolean)
    return String(tags || '')
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
}

function mapProduct(product: ShopifyProduct): SourceProduct {
    const variants = product.variants || []
    const firstVariant = variants[0]
    const price = money(firstVariant?.price)
    const originPrice = money(firstVariant?.compare_at_price) || price
    const images = (product.images || []).map(image => image.src).filter(Boolean)
    const tags = normalizeTags(product.tags)
    const category = product.product_type?.trim() || tags[0] || 'General'
    const categories = [category]
    const quantities = variants
        .map(variant => variant.inventory_quantity)
        .filter((quantity): quantity is number => typeof quantity === 'number')
    const anyAvailable = variants.some(variant => variant.available !== false)
    const quantity = quantities.length
        ? Math.max(0, quantities.reduce((total, item) => total + item, 0))
        : (anyAvailable ? 999 : 0)

    const options = variants.flatMap(variant => [variant.option1, variant.option2, variant.option3])
        .filter((value): value is string => Boolean(value && value !== 'Default Title'))
    const sizes = Array.from(new Set(options))

    return {
        id: String(product.id),
        category,
        type: category,
        name: product.title,
        gender: 'unisex',
        new: Boolean(product.created_at && Date.now() - Date.parse(product.created_at) < 30 * 86400000),
        sale: originPrice > price,
        rate: 0,
        price,
        originPrice,
        brand: product.vendor || 'TheOnlineStore',
        sold: 0,
        quantity,
        quantityPurchase: 1,
        sizes,
        variation: [],
        thumbImage: images.slice(0, 2),
        images,
        description: stripHtml(product.body_html || ''),
        action: 'add to cart',
        slug: product.handle,
        sourceId: product.id,
        sourceUrl: `${SOURCE_ORIGIN}/products/${product.handle}`,
        sourceHandle: product.handle,
        categories,
        tags,
        sku: firstVariant?.id ? String(firstVariant.id) : undefined,
        stockStatus: quantity > 0 ? 'instock' : 'outofstock',
    }
}

export async function getSourceProducts(): Promise<SourceProduct[]> {
    const products: ShopifyProduct[] = []

    // TheOnlineStore is a Shopify storefront. Shopify's public products.json
    // endpoint supports up to 250 products per page, which covers the current
    // catalog while retaining pagination for future catalog growth.
    for (let page = 1; page <= 10; page += 1) {
        const payload = await fetchStoreApi<ShopifyProductsResponse>(`/products.json?limit=250&page=${page}`)
        const batch = payload.products || []
        products.push(...batch)
        if (batch.length < 250) break
    }

    return products.map(mapProduct)
}

export async function getSourceCategories(): Promise<SourceCategory[]> {
    const products = await getSourceProducts()
    const counts = new Map<string, number>()

    for (const product of products) {
        for (const category of product.categories) {
            counts.set(category, (counts.get(category) || 0) + 1)
        }
    }

    return Array.from(counts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count], index) => ({
            id: index + 1,
            name,
            slug: slugify(name),
            count,
        }))
}

export async function getSourceProductById(id: string | number) {
    const products = await getSourceProducts()
    return products.find(product => product.sourceId === Number(id) || product.id === String(id)) || null
}

export async function getCatalog() {
    const products = await getSourceProducts()
    const counts = new Map<string, number>()

    for (const product of products) {
        for (const category of product.categories) {
            counts.set(category, (counts.get(category) || 0) + 1)
        }
    }

    const categories = Array.from(counts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count], index) => ({
            id: index + 1,
            name,
            slug: slugify(name),
            count,
        }))

    return { products, categories }
}
