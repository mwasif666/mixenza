import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuEleven from '@/components/Header/Menu/MenuEleven'
import Footer from '@/components/Footer/Footer'
import FullCatalog from '@/components/TheOnlineStore/FullCatalog'
import { getAllMixenzaProducts } from '@/lib/catalogSync'

// Never fetch the external catalog during `next build`.
// The catalog is remote/live and must be resolved when the page is requested.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Fashion11CatalogPage() {
    let products = []

    try {
        products = await getAllMixenzaProducts()
    } catch (error) {
        console.error('Mixenza live catalog unavailable', error)
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuEleven />
            </div>
            <FullCatalog products={products} />
            <Footer />
        </>
    )
}
