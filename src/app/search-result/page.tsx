import React from 'react'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getSourceProducts } from '@/lib/theOnlineStore'

interface Props {
    searchParams: {
        query?: string
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SearchResult({ searchParams }: Props) {
    const query = (searchParams.query || '').trim()
    let products = [] as Awaited<ReturnType<typeof getSourceProducts>>

    try {
        products = await getSourceProducts()
    } catch (error) {
        console.error('Live catalog unavailable for search', error)
    }

    const normalized = query.toLowerCase()
    const filtered = normalized
        ? products.filter(product => [
            product.name,
            product.category,
            product.description,
            ...product.categories,
            ...product.tags,
        ].some(value => String(value || '').toLowerCase().includes(normalized)))
        : products

    return (
        <>
            <div id="header" className="relative w-full">
                <Breadcrumb heading="Search Result" subHeading="Search Result" />
            </div>
            <div className="pt-4">
                <SourceCatalog
                    products={filtered}
                    title={query ? `Search results for “${query}”` : 'All Products'}
                />
            </div>
            <Footer />
        </>
    )
}
