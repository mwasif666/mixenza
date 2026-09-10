import { getSourceProducts, SourceProduct } from '@/lib/theOnlineStore'

/**
 * Single source-of-truth catalog loader for Mixenza.
 * The upstream catalog is paginated by getSourceProducts(), so callers do not
 * need to manually maintain a product list.
 */
export async function getAllMixenzaProducts(): Promise<SourceProduct[]> {
    const products = await getSourceProducts()
    return products.filter(product => product && product.id && product.name)
}
