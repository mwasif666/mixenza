import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { ProductType } from '@/type/ProductType'

type BannerAboveProps = { products?: ProductType[] }

const BannerAbove = ({ products = [] }: BannerAboveProps) => {
    const banners = products.slice(0, 3)
    if (!banners.length) return null

    return (
        <section id="deals" className="container pt-5 md:pt-8">
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                {banners.map((product, index) => {
                    const image = product.thumbImage?.[0] || product.images?.[0]
                    const discount = product.originPrice > product.price
                        ? `Save ${Math.round(((product.originPrice - product.price) / product.originPrice) * 100)}%`
                        : 'Shop now'
                    const background = index === 1 ? 'bg-[#292929]' : index === 2 ? 'bg-[#444]' : 'bg-[#151515]'
                    return (
                        <Link key={product.id} href={`/product/default?id=${product.id}`} className={`group relative min-h-[190px] overflow-hidden rounded-2xl ${background} p-7 sm:min-h-[210px]`}>
                            {image && <Image width={900} height={650} src={image} className="absolute right-0 top-1/2 h-full w-3/5 -translate-y-1/2 object-contain transition duration-700 group-hover:scale-110" alt={product.name} />}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                            <div className="relative z-10 max-w-[58%] text-white">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Mixenza pick</p>
                                <h2 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight">{product.name}</h2>
                                <p className="mt-2 text-sm text-white/70">{discount}</p>
                                <span className="mt-5 inline-block border-b border-white pb-1 text-xs font-medium uppercase tracking-wider">Shop now</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default BannerAbove
