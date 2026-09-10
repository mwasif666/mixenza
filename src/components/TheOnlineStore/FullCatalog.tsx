'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

export default function FullCatalog({ products }: { products: SourceProduct[] }) {
    const [category, setCategory] = useState('All')
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('featured')
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()

    const categories = useMemo(() => ['All', ...Array.from(new Set(products.flatMap(p => p.categories))).sort((a, b) => a.localeCompare(b))], [products])
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const result = products.filter(p => (category === 'All' || p.categories.includes(category)) && (!q || [p.name, p.category, p.description, ...p.tags].some(v => String(v || '').toLowerCase().includes(q))))
        return [...result].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'newest' ? Number(b.new) - Number(a.new) : Number(b.sale) - Number(a.sale))
    }, [category, products, query, sort])

    const add = (product: SourceProduct) => {
        addToCart({ ...product, quantityPurchase: 1 })
        updateCart(product.id, 1, '', '')
        openModalCart()
    }

    return <section id="products" className="container py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="caption2 uppercase tracking-[0.18em] text-secondary">Mixenza Store</p><h2 className="heading3 mt-2">All Products</h2><p className="mt-2 text-secondary">{filtered.length} products · live catalog</p></div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <input aria-label="Search products" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="h-12 min-w-[240px] rounded-full border border-line bg-white px-5 outline-none focus:border-black" />
                <select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)} className="h-12 rounded-full border border-line bg-white px-5 outline-none focus:border-black"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select>
            </div>
        </div>
        <div className="mb-9 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">{categories.map(item => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-5 py-2.5 text-button-uppercase ${category === item ? 'border-black bg-black text-white' : 'border-line bg-white hover:border-black'}`}>{item}</button>)}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
            {filtered.map(product => { const image = product.thumbImage[0]; const sale = product.originPrice > product.price ? Math.round((1 - product.price / product.originPrice) * 100) : 0; return <article key={product.id} className="group min-w-0">
                <Link href={`/product/default?id=${encodeURIComponent(product.id)}`} className="block"><div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">{image ? <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center text-secondary">No image</div>}<div className="absolute left-3 top-3 flex gap-2">{product.new && <span className="rounded-full bg-white px-3 py-1 text-[11px] shadow-sm">New</span>}{sale > 0 && <span className="rounded-full bg-black px-3 py-1 text-[11px] text-white">-{sale}%</span>}</div>{product.quantity === 0 && <div className="absolute inset-x-0 bottom-0 bg-black/75 px-3 py-2 text-center text-xs text-white">Out of stock</div>}</div></Link>
                <div className="mt-4"><p className="caption2 truncate uppercase tracking-wide text-secondary">{product.categories[0] || 'General'}</p><Link href={`/product/default?id=${encodeURIComponent(product.id)}`} className="text-title mt-1 block line-clamp-2 min-h-[48px] leading-6 hover:opacity-60">{product.name}</Link><div className="mt-2 flex items-baseline gap-2"><strong className="text-title">Rs. {product.price.toLocaleString('en-PK')}</strong>{product.originPrice > product.price && <del className="caption1 text-secondary2">Rs. {product.originPrice.toLocaleString('en-PK')}</del>}</div><button type="button" disabled={product.quantity === 0} onClick={() => add(product)} className="button-main mt-3 w-full disabled:opacity-50">{product.quantity === 0 ? 'Out of Stock' : 'Add To Cart'}</button></div>
            </article> })}
        </div>
        {!filtered.length && <div className="rounded-2xl border border-line px-6 py-20 text-center"><h3 className="heading6">No products found</h3><p className="mt-2 text-secondary">Try another search or category.</p></div>}
    </section>
}
