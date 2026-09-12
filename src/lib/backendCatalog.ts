import { apiPath } from '@/config/site'
import type { SourceProduct } from '@/lib/theOnlineStore'

type BackendProduct = {
    _id?: string
    id?: string
    title: string
    slug: string
    sku?: string
    price: number
    discountPrice?: number
    stock: number
    description?: string
    shortDescription?: string
    images?: Array<{ url?: string; src?: string; alt?: string } | string>
    category?: { _id?: string; id?: string; name?: string; slug?: string }
    tags?: string[]
    sizes?: string[]
    isFeatured?: boolean
    isNewArrival?: boolean
    isBestSeller?: boolean
    isRecommended?: boolean
    createdAt?: string
}

type BackendProductsResponse = {
    success: boolean
    total: number
    pages: number
    data: BackendProduct[]
}

const imageUrls = (images: BackendProduct['images'] = []) =>
    images.map(image => typeof image === 'string' ? image : image.url || image.src || '').filter(Boolean) as string[]

const mapProduct = (product: BackendProduct): SourceProduct => {
    const images = imageUrls(product.images)
    const price = Number(product.discountPrice || product.price || 0)
    const originPrice = Number(product.price || price)
    const categoryName = product.category?.name || 'General'
    return {
        id: String(product._id || product.id),
        category: categoryName,
        type: categoryName,
        name: product.title,
        gender: 'unisex',
        new: Boolean(product.isNewArrival),
        sale: Boolean(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price),
        rate: 0,
        price,
        originPrice,
        brand: 'Mixenza',
        sold: 0,
        quantity: Math.max(0, Number(product.stock || 0)),
        quantityPurchase: 1,
        sizes: product.sizes || [],
        variation: [],
        thumbImage: images.slice(0, 2),
        images,
        description: product.description || product.shortDescription || '',
        action: 'add to cart',
        slug: product.slug,
        sourceId: product.sku?.match(/^TOS-(\d+)/)?.[1] || String(product._id || product.id),
        sourceUrl: `/product/default?id=${product._id || product.id}`,
        sourceHandle: product.slug,
        categories: [categoryName],
        tags: product.tags || [],
        sku: product.sku,
        stockStatus: Number(product.stock || 0) > 0 ? 'instock' : 'outofstock',
    }
}

export async function getBackendCatalogProducts(): Promise<SourceProduct[]> {
    const first = await fetch(apiPath('/products?page=1&limit=100&sort=newest'), {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: { Accept: 'application/json' },
    })
    if (!first.ok) throw new Error(`Mixenza backend products request failed: ${first.status}`)
    const firstPage = await first.json() as BackendProductsResponse
    if (!firstPage.success || !Array.isArray(firstPage.data)) throw new Error('Invalid backend catalog response')
    const products = [...(firstPage.data || [])]

    const remaining = await Promise.all(Array.from({ length: Math.max(0, (firstPage.pages || 1) - 1) }, async (_, index) => {
        const page = index + 2
        const response = await fetch(apiPath(`/products?page=${page}&limit=100&sort=newest`), {
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
            headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error(`Mixenza backend products request failed: ${response.status}`)
        const payload = await response.json() as BackendProductsResponse
        if (!payload.success || !Array.isArray(payload.data)) throw new Error('Invalid backend catalog page')
        return payload.data
    }))
    products.push(...remaining.flat())

    return products.map(mapProduct)
}
