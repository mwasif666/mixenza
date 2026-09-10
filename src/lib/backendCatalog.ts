import { ProductType } from '@/type/ProductType'
import { apiPath } from '@/config/site'

export type BackendProduct = {
    _id?: string
    id?: string
    title: string
    slug: string
    price: number
    discountPrice?: number
    stock: number
    description?: string
    shortDescription?: string
    images?: Array<{ url?: string; src?: string; alt?: string } | string>
    category?: { _id?: string; id?: string; name?: string; slug?: string }
    tags?: string[]
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

const mapProduct = (product: BackendProduct): ProductType => {
    const images = imageUrls(product.images)
    const price = Number(product.discountPrice || product.price || 0)
    const originPrice = Number(product.price || price)
    return {
        id: String(product._id || product.id),
        category: product.category?.name || 'General',
        type: product.category?.name || 'Product',
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
        sizes: [],
        variation: [],
        thumbImage: images.slice(0, 2),
        images,
        description: product.description || product.shortDescription || '',
        action: 'add to cart',
        slug: product.slug,
    }
}

export async function getBackendCatalogProducts(): Promise<ProductType[]> {
    const first = await fetch(apiPath('/products?page=1&limit=100&sort=newest'), {
        next: { revalidate: 300 },
        headers: { Accept: 'application/json' },
    })
    if (!first.ok) throw new Error(`Mixenza backend products request failed: ${first.status}`)
    const firstPage = await first.json() as BackendProductsResponse
    const products = [...(firstPage.data || [])]

    for (let page = 2; page <= Math.min(firstPage.pages || 1, 50); page += 1) {
        const response = await fetch(apiPath(`/products?page=${page}&limit=100&sort=newest`), {
            next: { revalidate: 300 },
            headers: { Accept: 'application/json' },
        })
        if (!response.ok) break
        const payload = await response.json() as BackendProductsResponse
        products.push(...(payload.data || []))
        if (!payload.data?.length) break
    }

    return products.map(mapProduct)
}
