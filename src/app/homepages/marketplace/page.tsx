import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuMarketplace from '@/components/Header/Menu/MenuMarketplace'
import SliderMarketplace from '@/components/Slider/SliderMarketplace'
import BannerAbove from '@/components/Marketplace/BannerAbove'
import Benefit from '@/components/Home1/Benefit'
import blogData from '@/data/Blog.json'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import NewsInsight from '@/components/Home3/NewsInsight'
import SourceCatalog from '@/components/TheOnlineStore/SourceCatalog'
import { getSourceProducts } from '@/lib/theOnlineStore'

export const revalidate = 900

export default async function Marketplace() {
    let products = []
    try {
        products = await getSourceProducts()
    } catch (error) {
        console.error('TheOnlineStore catalog unavailable', error)
    }

    return (
        <>
            <TopNavOne
                props="style-marketplace bg-brand-dark border-b border-surface1"
                slogan="New customers save 10% with the code GET10"
            />
            <div id="header" className="relative w-full">
                <MenuMarketplace />
                <SliderMarketplace />
            </div>
            <BannerAbove />
            <SourceCatalog products={products} />
            <NewsInsight data={blogData} start={18} limit={21} />
            <Benefit props="md:py-[60px] py-10 border-b border-line" />
            <Brand />
            <Footer />
            <ModalNewsletter />
        </>
    )
}
