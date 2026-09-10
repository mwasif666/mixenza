import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuEleven from '@/components/Header/Menu/MenuEleven'
import Footer from '@/components/Footer/Footer'
import FullCatalog from '@/components/TheOnlineStore/FullCatalog'
import { getAllMixenzaProducts } from '@/lib/catalogSync'

export const revalidate = 300

export default async function Fashion11CatalogPage() {
    const products = await getAllMixenzaProducts()
    return <><TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" /><div id="header" className="relative w-full"><MenuEleven /></div><FullCatalog products={products} /><Footer /></>
}
