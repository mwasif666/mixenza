import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Footer from '@/components/Footer/Footer'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getSourceProducts } from '@/lib/theOnlineStore'

interface Props {
    searchParams: {
        type?: string
        gender?: string
        category?: string
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BreadCrumb1({ searchParams }: Props) {
    let products = [] as Awaited<ReturnType<typeof getSourceProducts>>

    try {
        products = await getSourceProducts()
    } catch (error) {
        console.error('Live catalog unavailable', error)
    }

    const requestedCategory = searchParams.category || searchParams.type || null
    const requestedGender = searchParams.gender?.toLowerCase()
    const filtered = requestedGender
        ? products.filter(product => product.gender.toLowerCase() === requestedGender || product.tags.some(tag => tag.toLowerCase() === requestedGender))
        : products

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-transparent" />
            </div>
            <SourceCatalog
                products={filtered}
                initialCategory={requestedCategory}
                title={requestedCategory ? `${requestedCategory} Collection` : 'All Products'}
            />
            <Footer />
        </>
    )
}
