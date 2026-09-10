import { ProductType } from '@/type/ProductType'

export const SOURCE_ORIGIN = 'https://theonlinestore.com.pk'
const API_ORIGIN = `${SOURCE_ORIGIN}/wp-json/wc/store/v1`

type StoreCategory = { id: number; name: string; slug: string; count: number }
type StoreImage = { id: number; src: string; alt?: string }
type StoreProduct = {
    id: number
    name: string
    slug: string
    permalink: string
    description?: string
    short_description?: string
    sku?: string
    prices?: { price?: string; regular_price?: string; currency_minor_unit?: number }
    on_sale?: boolean
    is_in_stock?: boolean
    stock_status?: string
    stock_quantity?: number | null
    images?: StoreImage[]
    categories?: StoreCategory[]
    tags?: Array<{ id: number; name: string; slug: string }>
    attributes?: Array<{ name: string; terms?: Array<{ name: string }> }>
    date_created?: string
}

export type SourceCategory = StoreCategory
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
        next: { revalidate: 900 },
        headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`TheOnlineStore API request failed: ${response.status}`)
    return response.json() as Promise<T>
}

function money(value: string | undefined, minorUnit = 2) {
    return (Number(value || 0) || 0) / Math.pow(10, minorUnit)
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

function mapProduct(product: StoreProduct): SourceProduct {
    const minorUnit = product.prices?.currency_minor_unit ?? 2
    const price = money(product.prices?.price, minorUnit)
    const regularPrice = money(product.prices?.regular_price, minorUnit) || price
    const categories = (product.categories || []).map(category => category.name)
    const tags = (product.tags || []).map(tag => tag.name)
    const images = (product.images || []).map(image => image.src).filter(Boolean)
    const attributes = (product.attributes || []).flatMap(attribute =>
        (attribute.terms || []).map(term => term.name),
    )
    const quantity = product.stock_quantity == null
        ? (product.is_in_stock === false ? 0 : 999)
        : Math.max(0, product.stock_quantity)

    return {
        id: String(product.id),
        category: categories[0] || 'General',
        type: categories[0] || 'Product',
        name: product.name,
        gender: 'unisex',
        new: Boolean(product.date_created && Date.now() - Date.parse(product.date_created) < 30 * 86400000),
        sale: Boolean(product.on_sale),
        rate: 0,
        price,
        originPrice: regularPrice,
        brand: 'TheOnlineStore',
        sold: 0,
        quantity,
        quantityPurchase: 1,
        sizes: attributes,
        variation: [],
        thumbImage: images.slice(0, 2),
        images,
        description: stripHtml(product.description || product.short_description || ''),
        action: 'add to cart',
        slug: product.slug,
        sourceId: product.id,
        sourceUrl: product.permalink,
        sourceHandle: product.slug,
        categories,
        tags,
        sku: product.sku || undefined,
        stockStatus: product.stock_status || (product.is_in_stock ? 'instock' : 'outofstock'),
    }
}

export async function getSourceCategories(): Promise<SourceCategory[]> {
    return fetchStoreApi<SourceCategory[]>('/products/categories?per_page=100&hide_empty=true')
}

export async function getSourceProducts(): Promise<SourceProduct[]> {
    const products: StoreProduct[] = []
    for (let page = 1; page <= 20; page += 1) {
        const batch = await fetchStoreApi<StoreProduct[]>(`/products?per_page=100&page=${page}&orderby=menu_order&order=asc`)
        products.push(...batch)
        if (batch.length < 100) break
    }
    return products.map(mapProduct)
}

export async function getSourceProductById(id: string | number) {
    try {
        return mapProduct(await fetchStoreApi<StoreProduct>(`/products/${encodeURIComponent(String(id))}`))
    } catch {
        return null
    }
}

export async function getCatalog() {
    const [products, categories] = await Promise.all([getSourceProducts(), getSourceCategories()])
    return { products, categories }
}
