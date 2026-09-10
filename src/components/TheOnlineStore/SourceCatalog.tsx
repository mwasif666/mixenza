'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

interface Props {
    products: SourceProduct[]
}

const PAGE_SIZE = 24

const SourceCatalog: React.FC<Props> = ({ products }) => {
    const [category, setCategory] = useState('All')
    const [page, setPage] = useState(1)
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()

    const categories = useMemo(() => {
        const names = new Set<string>()
        products.forEach(product => product.categories.forEach(item => names.add(item)))
        return ['All', ...Array.from(names).sort()]
    }, [products])

    const filtered = useMemo(() => {
        if (category === 'All') return products
        return products.filter(product => product.categories.includes(category))
    }, [category, products])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const changeCategory = (value: string) => {
        setCategory(value)
        setPage(1)
    }

    const handleAddToCart = (product: SourceProduct) => {
        addToCart({ ...product })
        updateCart(product.id, 1, '', '')
        openModalCart()
    }

    return (
        <section className="container py-12 md:py-20">
            <div className="flex flex-col gap-6">
                <div className="flex items-end justify-between gap-5 flex-wrap">
                    <div>
                        <p className="caption2 text-secondary uppercase">TheOnlineStore</p>
                        <h2 className="heading3 mt-2">Shop All Products</h2>
                        <p className="text-secondary mt-2">{filtered.length} products available</p>
                    </div>
                    <div className="text-secondary caption1">Live catalog · prices in PKR</div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(item => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => changeCategory(item)}
                            className={`shrink-0 rounded-full border px-5 py-2.5 text-button-uppercase duration-300 ${category === item ? 'bg-black text-white border-black' : 'border-line hover:border-black'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
                    {visible.map(product => {
                        const salePercent = product.originPrice > product.price
                            ? Math.round((1 - product.price / product.originPrice) * 100)
                            : 0
                        const image = product.thumbImage[0]

                        return (
                            <article key={product.id} className="group min-w-0">
                                <Link href={`/product/default?id=source-${product.id}`} className="block">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt={product.name}
                                                fill
                                                unoptimized
                                                className="object-cover duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-secondary">No image</div>
                                        )}
                                        {salePercent > 0 && (
                                            <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs text-white">-{salePercent}%</span>
                                        )}
                                    </div>
                                </Link>
                                <div className="mt-4">
                                    <p className="caption2 text-secondary truncate">{product.categories[0] || 'General'}</p>
                                    <Link href={`/product/default?id=source-${product.id}`} className="text-title block mt-1 line-clamp-2 hover:underline">
                                        {product.name}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-2">
                                        <strong className="text-title">Rs. {product.price.toLocaleString('en-PK')}</strong>
                                        {product.originPrice > product.price && (
                                            <del className="caption1 text-secondary2">Rs. {product.originPrice.toLocaleString('en-PK')}</del>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.quantity === 0}
                                        className="button-main w-full text-center mt-3 disabled:opacity-50"
                                    >
                                        {product.quantity === 0 ? 'Out of Stock' : 'Add To Cart'}
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {pageCount > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-5">
                        <button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)} className="rounded-full border border-line px-4 py-2 disabled:opacity-40">Previous</button>
                        <span className="px-3 caption1">Page {page} of {pageCount}</span>
                        <button type="button" disabled={page === pageCount} onClick={() => setPage(value => value + 1)} className="rounded-full border border-line px-4 py-2 disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default SourceCatalog
