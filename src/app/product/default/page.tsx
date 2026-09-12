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

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ProductDefault = async ({ searchParams }: Props) => {
    const productId = searchParams.id || ''

    // Source catalog products use the real TheOnlineStore product id. Resolve
    // those first so every product card, shop page and homepage opens a live
    // product detail instead of falling back to the template JSON catalog.
    if (productId) {
        try {
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
        } catch (error) {
            console.error('Live product lookup failed', error)
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-white" />
                <BreadcrumbProduct data={productData} productPage="default" productId={productId || '1'} />
            </div>
            <Default data={productData} productId={productId || '1'} />
            <Footer />
        </>
    )
}

export default ProductDefault
