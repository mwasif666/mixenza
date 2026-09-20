import Footer from '@/components/Footer/Footer'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getSourceProducts } from '@/lib/theOnlineStore'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: `Shop | ${BRAND.name}`,
    description: `Browse Mixenza products, categories and PKR prices.`,
}

export default async function ShopPage({ searchParams }: { searchParams: { category?: string; type?: string } }) {
    const products = await getSourceProducts().catch(() => [])
    const category = searchParams.category || searchParams.type || null
    return (
        <>
            <SourceCatalog products={products} initialCategory={category} title={category ? category : 'Shop'} />
            <Footer />
        </>
    )
}
