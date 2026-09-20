import { notFound } from 'next/navigation'
import Footer from '@/components/Footer/Footer'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getCatalog } from '@/lib/theOnlineStore'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const reserved = new Set(['breadcrumb1', 'breadcrumb2', 'collection', 'default-grid', 'default', 'filter-canvas', 'filter-dropdown', 'sidebar-list', 'breadcrumb-img', 'filter-options', 'fullwidth', 'square', 'default-list'])

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
    const { categories } = await getCatalog()
    const match = categories.find(item => item.slug === params.category)
    return { title: `${match?.name || 'Shop'} | ${BRAND.name}` }
}

export default async function ShopCategoryPage({ params }: { params: { category: string } }) {
    if (reserved.has(params.category)) notFound()
    const { products, categories } = await getCatalog().catch(() => ({ products: [], categories: [] as Awaited<ReturnType<typeof getCatalog>>['categories'] }))
    const match = categories.find(item => item.slug === params.category)
    if (!match) notFound()
    return (
        <>
            <SourceCatalog products={products} initialCategory={match.name} title={match.name} />
            <Footer />
        </>
    )
}
