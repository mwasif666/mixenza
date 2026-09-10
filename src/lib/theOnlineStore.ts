import { ProductType } from '@/type/ProductType'

const SOURCE_ORIGIN = 'https://theonlinestore.com.pk'
const COLLECTIONS = [
    { handle: 'kitchenware', name: 'Kitchenware' },
    { handle: 'electronics-gadgets', name: 'Electronics & Gadgets' },
    { handle: 'cleaning-products', name: 'Cleaning Products' },
    { handle: 'organizers', name: 'Organizers' },
    { handle: 'home-lifestyle', name: 'Home & Lifestyle' },
    { handle: 'health-beauty', name: 'Health & Beauty' },
]

type ShopifyImage = { src: string }
type ShopifyVariant = {
    id: number
    price: string
    compare_at_price?: string | null
    available?: boolean
    inventory_quantity?: number
}

export type ShopifyProduct = {
    id: number
    title: string
    handle: string
    body_html?: string
    vendor?: string
    product_type?: string
    tags?: string[]
    published_at?: string | null
    created_at?: string
    updated_at?: string
    images?: ShopifyImage[]
    variants?: ShopifyVariant[]
}

export type SourceProduct = ProductType & {
    sourceId: number
    sourceUrl: string
    sourceHandle: string
    categories: string[]
    tags: string[]
    sku?: string
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
        .replace(/\s+/g, ' ')
        .trim()
}

function imageUrl(src: string) {
    if (!src) return ''
    return src.startsWith('//') ? `https:${src}` : src
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        next: { revalidate: 900 },
        headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
        throw new Error(`TheOnlineStore request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
}

async function fetchCategoryMap() {
    const entries = await Promise.all(
        COLLECTIONS.map(async ({ handle, name }) => {
            try {
                const products = await fetchJson<ShopifyProduct[]>(
                    `${SOURCE_ORIGIN}/collections/${handle}/products.json?limit=250`,
                )
                return products.map(product => [String(product.id), name] as const)
            } catch {
                return [] as Array<readonly [string, string]>
            }
        }),
    )

    const categoryMap = new Map<string, string[]>()
    for (const group of entries) {
        for (const [id, category] of group) {
            const current = categoryMap.get(id) || []
            if (!current.includes(category)) current.push(category)
            categoryMap.set(id, current)
        }
    }
    return categoryMap
}

function mapProduct(product: ShopifyProduct, categoryMap: Map<string, string[]>): SourceProduct {
    const variants = product.variants || []
    const primaryVariant = variants[0]
    const price = Number.parseFloat(primaryVariant?.price || '0') || 0
    const compareAt = Number.parseFloat(primaryVariant?.compare_at_price || '0') || price
    const categories = categoryMap.get(String(product.id)) || []
    const fallbackCategory = product.product_type?.trim() || product.tags?.[0]?.trim() || 'General'
    const allCategories = categories.length ? categories : [fallbackCategory]
    const images = (product.images || []).map(item => imageUrl(item.src)).filter(Boolean)
    const quantity = Math.max(
        1,
        variants.reduce((sum, variant) => sum + Math.max(0, variant.inventory_quantity || 0), 0),
    )

    return {
        id: String(product.id),
        category: allCategories[0],
        type: product.product_type?.trim() || allCategories[0],
        name: product.title,
        gender: 'unisex',
        new: Boolean(product.created_at && Date.now() - Date.parse(product.created_at) < 30 * 86400000),
        sale: compareAt > price,
        rate: 0,
        price,
        originPrice: compareAt,
        brand: product.vendor?.trim() || 'The Online Store',
        sold: 0,
        quantity,
        quantityPurchase: 1,
        sizes: [],
        variation: [],
        thumbImage: images.slice(0, 2),
        images,
        description: stripHtml(product.body_html || ''),
        action: 'add to cart',
        slug: product.handle,
        sourceId: product.id,
        sourceUrl: `${SOURCE_ORIGIN}/products/${product.handle}`,
        sourceHandle: product.handle,
        categories: allCategories,
        tags: product.tags || [],
        sku: primaryVariant?.id ? String(primaryVariant.id) : undefined,
    }
}

export async function getSourceProducts(): Promise<SourceProduct[]> {
    const [products, categoryMap] = await Promise.all([
        fetchJson<ShopifyProduct[]>(`${SOURCE_ORIGIN}/products.json?limit=250`),
        fetchCategoryMap(),
    ])

    return products.map(product => mapProduct(product, categoryMap))
}

export async function getSourceProductById(id: string | number) {
    const products = await getSourceProducts()
    return products.find(product => product.id === String(id)) || null
}

export async function getSourceProductByHandle(handle: string) {
    const products = await getSourceProducts()
    return products.find(product => product.sourceHandle === handle) || null
}

export { SOURCE_ORIGIN }
