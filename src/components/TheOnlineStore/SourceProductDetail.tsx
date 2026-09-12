'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

interface Props {
    product: SourceProduct
}

const SourceProductDetail: React.FC<Props> = ({ product }) => {
    const [activeImage, setActiveImage] = useState(product.images[0] || '')
    const [quantity, setQuantity] = useState(1)
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const salePercent = product.originPrice > product.price
        ? Math.round((1 - product.price / product.originPrice) * 100)
        : 0

    const handleAddToCart = () => {
        addToCart({ ...product, quantityPurchase: quantity })
        updateCart(product.id, quantity, '', '')
        openModalCart()
    }

    return (
        <main className="container py-10 md:py-16">
            <div className="mb-8 text-secondary caption1">
                <Link href="/homepages/marketplace" className="hover:text-black">Home</Link>
                <span className="mx-2">/</span>
                <span>{product.categories[0] || 'Product'}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
                <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface">
                        {activeImage && (
                            <Image src={activeImage} alt={product.name} fill unoptimized className="object-contain" priority />
                        )}
                        {salePercent > 0 && <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-white text-xs">-{salePercent}%</span>}
                    </div>
                    <div className="grid grid-cols-5 gap-3 mt-3">
                        {product.images.slice(0, 5).map(image => (
                            <button key={image} type="button" onClick={() => setActiveImage(image)} className={`relative aspect-square overflow-hidden rounded-xl border ${activeImage === image ? 'border-black' : 'border-line'}`}>
                                <Image src={image} alt={product.name} fill unoptimized className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <p className="caption2 text-secondary uppercase">{product.categories.join(' · ') || 'Mixenza'}</p>
                    <h1 className="heading3 mt-2">{product.name}</h1>
                    <div className="flex items-center gap-3 mt-5">
                        <span className="heading5">Rs. {product.price.toLocaleString('en-PK')}</span>
                        {product.originPrice > product.price && <del className="text-secondary2">Rs. {product.originPrice.toLocaleString('en-PK')}</del>}
                    </div>
                    <div className="mt-6 pt-6 border-t border-line text-secondary leading-7 whitespace-pre-line">
                        {product.description || 'No additional description is available for this product.'}
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex items-center rounded-lg border border-line">
                            <button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} className="w-11 h-11">−</button>
                            <span className="w-11 text-center">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(value => Math.min(product.quantity || 999, value + 1))} className="w-11 h-11">+</button>
                        </div>
                        <button type="button" onClick={handleAddToCart} disabled={product.quantity === 0} className="button-main flex-1 text-center disabled:opacity-50">
                            {product.quantity === 0 ? 'Out of Stock' : 'Add To Cart'}
                        </button>
                    </div>

                    <div className="mt-8 space-y-3 caption1 text-secondary">
                        {product.sku && <div><strong className="text-black">SKU:</strong> {product.sku}</div>}
                        <div><strong className="text-black">Category:</strong> {product.categories.join(', ') || 'General'}</div>
                        {product.tags.length > 0 && <div><strong className="text-black">Tags:</strong> {product.tags.join(', ')}</div>}
                        <div><strong className="text-black">Availability:</strong> {product.quantity === 0 ? 'Out of stock' : 'In stock'}</div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SourceProductDetail
