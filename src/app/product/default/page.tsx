import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default'
import SourceProductDetail from '@/components/TheOnlineStore/SourceProductDetail'
import Footer from '@/components/Footer/Footer'
import productData from '@/data/Product.json'
import { getSourceProductById } from '@/lib/theOnlineStore'

interface Props {
    searchParams: { id?: string }
}

export const revalidate = 900

const ProductDefault = async ({ searchParams }: Props) => {
    const productId = searchParams.id || '1'

    if (productId.startsWith('source-')) {
        const sourceProduct = await getSourceProductById(productId.replace(/^source-/, ''))
        if (sourceProduct) {
            return (
                <>
                    <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
                    <div id="header" className="relative w-full">
                        <MenuOne props="bg-white" />
                    </div>
                    <SourceProductDetail product={sourceProduct} />
                    <Footer />
                </>
            )
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-white" />
                <BreadcrumbProduct data={productData} productPage="default" productId={productId} />
            </div>
            <Default data={productData} productId={productId} />
            <Footer />
        </>
    )
}

export default ProductDefault
