'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { shopPath } from '@/lib/storePaths'
import { formatMoney } from '@/utils/currency'
import { StarRow } from '@/components/Shop/StoreProductCard'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

export default function SourceProductDetail({ product }: { product: SourceProduct }) {
    const [activeImage, setActiveImage] = useState(product.images[0] || product.thumbImage[0] || '')
    const [quantity, setQuantity] = useState(1)
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const salePercent = product.originPrice > product.price ? Math.round((1 - product.price / product.originPrice) * 100) : 0
    const category = product.categories[0] || 'Shop'

    const add = () => {
        addToCart({ ...product, quantityPurchase: quantity })
        updateCart(product.id, quantity, '', '')
        openModalCart()
    }

    return (
        <main className="container py-10 md:py-16">
            <p className="caption1 text-secondary">
                <Link href="/" className="hover:text-black">Home</Link>
                <span className="mx-2">/</span>
                <Link href={shopPath(category)} className="hover:text-black">{category}</Link>
                <span className="mx-2">/</span>
                <span>{product.name}</span>
            </p>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-8">
                <div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#f4f4f5]">
                        {activeImage && <Image src={activeImage} alt={product.name} fill unoptimized priority className="object-contain p-8" />}
                    </div>
                    <div className="grid grid-cols-4 gap-3 mt-4">
                        {(product.images.length ? product.images : product.thumbImage).slice(0, 4).map(image => (
                            <button key={image} type="button" onClick={() => setActiveImage(image)} className={`relative aspect-square overflow-hidden rounded-2xl bg-[#f4f4f5] border ${activeImage === image ? 'border-black' : 'border-transparent'}`}>
                                <Image src={image} alt="" fill unoptimized className="object-contain p-2" />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h1 className="heading3">{product.name}</h1>
                    <p className="text-secondary mt-3">{product.description?.slice(0, 140) || 'A Mixenza everyday essential, priced in PKR.'}</p>
                    <StarRow rate={product.rate} count={product.sold || 121} />
                    <div className="flex items-end gap-3 mt-6">
                        <span className="heading4">{formatMoney(product.price)}</span>
                        {product.originPrice > product.price && <del className="text-secondary">{formatMoney(product.originPrice)}</del>}
                        {salePercent > 0 && <span className="text-sm text-[#16a34a]">-{salePercent}%</span>}
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex items-center rounded-full border border-line h-12">
                            <button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} className="w-12 h-12">−</button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(value => Math.min(product.quantity || 99, value + 1))} className="w-12 h-12">+</button>
                        </div>
                        {product.quantity > 0 && <span className="text-sm text-secondary">Only {product.quantity} items left</span>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-6">
                        <button type="button" onClick={add} disabled={product.quantity === 0} className="h-12 rounded-full bg-black text-white disabled:opacity-40">Buy Now</button>
                        <button type="button" onClick={add} disabled={product.quantity === 0} className="h-12 rounded-full border border-black disabled:opacity-40">Add to Cart</button>
                    </div>

                    <div className="mt-8 space-y-4 text-sm">
                        <div className="flex gap-3"><span>🚚</span><div><strong>Free delivery</strong><p className="text-secondary">Enter your city for delivery availability</p></div></div>
                        <div className="flex gap-3"><span>↩</span><div><strong>Return delivery</strong><p className="text-secondary">Free 14-day returns. Details on FAQs.</p></div></div>
                    </div>
                </div>
            </div>

            <section className="mt-16">
                <h2 className="heading5">{product.name} specifications</h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <dl className="rounded-3xl bg-[#f7f7f8] divide-y divide-white">
                        {[['Brand', product.brand || 'Mixenza'], ['Category', category], ['SKU', product.sku || product.id], ['Availability', product.quantity === 0 ? 'Out of stock' : 'In stock']].map(([label, value]) => (
                            <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm"><dt className="text-secondary">{label}</dt><dd>{value}</dd></div>
                        ))}
                    </dl>
                    <dl className="rounded-3xl bg-[#f7f7f8] divide-y divide-white">
                        {[['Type', product.type || 'General'], ['Tags', product.tags.slice(0, 4).join(', ') || 'Everyday'], ['Price', formatMoney(product.price)], ['Stock', String(product.quantity)]].map(([label, value]) => (
                            <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm"><dt className="text-secondary">{label}</dt><dd>{value}</dd></div>
                        ))}
                    </dl>
                </div>
            </section>
        </main>
    )
}
