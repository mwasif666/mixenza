'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

interface Props {
    products: SourceProduct[]
    initialCategory?: string | null
    title?: string
}
const PAGE_SIZE = 24

const SourceCatalog: React.FC<Props> = ({ products, initialCategory, title = 'Shop the collection' }) => {
    const [category, setCategory] = useState(initialCategory || 'All')
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('featured')
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()

    useEffect(() => {
        setCategory(initialCategory || 'All')
        setPage(1)
    }, [initialCategory])

    const categories = useMemo(() => {
        const names = new Set<string>()
        products.forEach(product => product.categories.forEach(item => names.add(item)))
        return ['All', ...Array.from(names).sort((a, b) => a.localeCompare(b))]
    }, [products])

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        const result = products.filter(product => {
            const categoryMatch = category === 'All' || product.categories.includes(category)
            const queryMatch = !normalized || [product.name, product.category, product.description, ...product.tags].some(value => String(value || '').toLowerCase().includes(normalized))
            return categoryMatch && queryMatch
        })
        return [...result].sort((a, b) => {
            if (sort === 'price-low') return a.price - b.price
            if (sort === 'price-high') return b.price - a.price
            if (sort === 'newest') return Number(b.new) - Number(a.new)
            return Number(b.sale) - Number(a.sale)
        })
    }, [category, products, query, sort])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleAddToCart = (product: SourceProduct) => {
        addToCart({ ...product })
        updateCart(product.id, 1, '', '')
        openModalCart()
    }

    return (
        <section id="products" className="container py-14 md:py-20">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="caption2 uppercase tracking-[0.18em] text-secondary">Mixenza Collection</p>
                    <h2 className="heading3 mt-2">{title}</h2>
                    <p className="mt-2 text-secondary">{filtered.length} products · live catalog synced from TheOnlineStore</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <label className="relative min-w-[240px]">
                        <span className="sr-only">Search products</span>
                        <input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search products..." className="h-12 w-full rounded-full border border-line bg-white px-5 pr-10 outline-none transition focus:border-black" />
                        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-secondary">⌕</span>
                    </label>
                    <select value={sort} onChange={event => { setSort(event.target.value); setPage(1) }} className="h-12 rounded-full border border-line bg-white px-5 outline-none focus:border-black">
                        <option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="-mx-1 mb-9 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none]">
                {categories.map(item => <button key={item} type="button" onClick={() => { setCategory(item); setPage(1) }} className={`shrink-0 rounded-full border px-5 py-2.5 text-button-uppercase transition-all duration-300 ${category === item ? 'border-black bg-black text-white' : 'border-line bg-white hover:border-black'}`}>{item}</button>)}
            </div>

            {visible.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
                {visible.map(product => {
                    const salePercent = product.originPrice > product.price ? Math.round((1 - product.price / product.originPrice) * 100) : 0
                    const image = product.thumbImage[0]
                    return <article key={product.id} className="group min-w-0">
                        <Link href={`/product/default?id=${encodeURIComponent(product.sourceId)}`} className="block">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                                {image ? <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center text-secondary">No image</div>}
                                <div className="absolute left-3 top-3 flex flex-wrap gap-2">{product.new && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wide shadow-sm">New</span>}{salePercent > 0 && <span className="rounded-full bg-black px-3 py-1 text-[11px] font-medium text-white">-{salePercent}%</span>}</div>
                                {product.quantity === 0 && <div className="absolute inset-x-0 bottom-0 bg-black/75 px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-white">Out of stock</div>}
                            </div>
                        </Link>
                        <div className="mt-4"><p className="caption2 truncate uppercase tracking-wide text-secondary">{product.categories[0] || 'General'}</p><Link href={`/product/default?id=${encodeURIComponent(product.sourceId)}`} className="text-title mt-1 block line-clamp-2 min-h-[48px] leading-6 transition hover:opacity-60">{product.name}</Link><div className="mt-2 flex items-baseline gap-2"><strong className="text-title">Rs. {product.price.toLocaleString('en-PK')}</strong>{product.originPrice > product.price && <del className="caption1 text-secondary2">Rs. {product.originPrice.toLocaleString('en-PK')}</del>}</div><button type="button" onClick={() => handleAddToCart(product)} disabled={product.quantity === 0} className="button-main mt-3 w-full text-center transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{product.quantity === 0 ? 'Out of Stock' : 'Add To Cart'}</button></div>
                    </article>
                })}
            </div> : <div className="rounded-2xl border border-line px-6 py-20 text-center"><h3 className="heading6">No products found</h3><p className="mt-2 text-secondary">Try another search or category.</p></div>}

            {pageCount > 1 && <div className="mt-12 flex items-center justify-center gap-3"><button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)} className="rounded-full border border-line px-5 py-2.5 transition hover:border-black disabled:opacity-40">Previous</button><span className="px-2 text-sm text-secondary">Page {page} of {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(value => value + 1)} className="rounded-full border border-line px-5 py-2.5 transition hover:border-black disabled:opacity-40">Next</button></div>}
        </section>
    )
}

export default SourceCatalog
