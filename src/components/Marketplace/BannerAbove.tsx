import Image from 'next/image'
import React from 'react'
import type { ProductType } from '@/type/ProductType'

type BannerAboveProps = {
    products?: ProductType[]
}

const BannerAbove = ({ products = [] }: BannerAboveProps) => {
    const banners = products.slice(0, 3)
    if (!banners.length) return null

    return (
        <div className="banner-block md:pt-10 pt-8">
            <div className="container">
                <div className="list-banner grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-[30px] gap-[20px]">
                    {banners.map((product, index) => {
                        const image = product.thumbImage?.[0] || product.images?.[0]
                        const discount = product.originPrice > product.price
                            ? `Save ${Math.round(((product.originPrice - product.price) / product.originPrice) * 100)}%`
                            : 'Shop now'
                        const background = index === 1 ? 'bg-brand' : index === 2 ? 'bg-primary-dark' : 'bg-primary'

                        return (
                            <a
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className={`banner-item relative py-[42px] px-8 ${background} block duration-500 rounded-2xl overflow-hidden min-h-[210px]`}
                            >
                                {image && (
                                    <div className="banner-img w-1/2 h-full absolute top-0 right-4 flex items-center justify-center">
                                        <Image width={700} height={520} src={image} className="w-full h-full object-contain duration-500" alt={product.name} />
                                    </div>
                                )}
                                <div className="banner-content relative z-10 max-w-[55%]">
                                    <div className="heading6 text-white line-clamp-2">{product.name}</div>
                                    <div className="text-sm text-white/80 mt-2">{discount}</div>
                                    <div className="text-button text-white relative inline-block pb-1 border-b-2 border-white duration-500 mt-3">Shop now</div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default BannerAbove
