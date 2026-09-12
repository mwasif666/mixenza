import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import DynamicMarketplaceHeader from '@/components/Header/Menu/DynamicMarketplaceHeader'
import SliderMarketplace from '@/components/Slider/SliderMarketplace'
import BannerAbove from '@/components/Marketplace/BannerAbove'
import Benefit from '@/components/Home1/Benefit'
import blogData from '@/data/Blog.json'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import NewsInsight from '@/components/Home3/NewsInsight'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getBackendCatalogProducts } from '@/lib/backendCatalog'
import { getSourceProducts, type SourceProduct } from '@/lib/theOnlineStore'

export const revalidate = 300

export default async function Marketplace() {
    let products: SourceProduct[] = []
    try {
        products = await getBackendCatalogProducts()
    } catch (error) {
        console.error('Mixenza backend catalog unavailable; using source fallback', error)
        try {
            products = await getSourceProducts()
        } catch (sourceError) {
            console.error('TheOnlineStore catalog unavailable', sourceError)
        }
    }

    return (
        <>
            <TopNavOne
                props="style-marketplace bg-brand-dark border-b border-surface1"
                slogan="New customers save 10% with the code GET10"
            />
            <div id="header" className="relative w-full">
                <DynamicMarketplaceHeader />
                <SliderMarketplace />
            </div>
            <BannerAbove products={products} />
            <SourceCatalog products={products} />
            <NewsInsight data={blogData} start={18} limit={21} />
            <Benefit props="md:py-[60px] py-10 border-b border-line" />
            <Brand />
            <Footer />
            <ModalNewsletter />
        </>
    )
}
