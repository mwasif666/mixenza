import type { ProductType } from '@/type/ProductType'
import { getBackendCatalogProducts } from './backendCatalog'

// Compatibility names for existing pages. All product data now comes from
// the admin database; importing the supplier catalog is an explicit backend job.
export type SourceCategory = { id: number; name: string; slug: string; count: number }
export type SourceProduct = ProductType & {
    sourceId: string
    sourceUrl: string
    sourceHandle: string
    categories: string[]
    tags: string[]
    sku?: string
    stockStatus: string
}

export const getSourceProducts = getBackendCatalogProducts

export async function getSourceProductById(id: string | number) {
    const products = await getBackendCatalogProducts()
    const value = String(id)
    return products.find(product => product.id === value || product.sourceId === value || product.slug === value) || null
}

export async function getCatalog() {
    const products = await getBackendCatalogProducts()
    const counts = new Map<string, number>()
    for (const product of products) {
        for (const category of product.categories) counts.set(category, (counts.get(category) || 0) + 1)
    }
    const categories = Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count], index) => ({
            id: index + 1, name, count,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        }))
    return { products, categories }
}

export async function getSourceCategories(): Promise<SourceCategory[]> {
    return (await getCatalog()).categories
}
