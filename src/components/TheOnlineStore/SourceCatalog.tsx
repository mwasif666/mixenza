'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import { SourceProduct } from '@/lib/theOnlineStore'
import { shopPath } from '@/lib/storePaths'
import StoreProductCard from '@/components/Shop/StoreProductCard'

interface Props {
    products: SourceProduct[]
    initialCategory?: string | null
    title?: string
}

const PAGE_SIZE = 24

function toggleValue(list: string[], value: string) {
    return list.includes(value) ? list.filter(item => item !== value) : [...list, value]
}

export default function SourceCatalog({ products, initialCategory, title = 'Shop' }: Props) {
    const [category, setCategory] = useState(initialCategory || 'All')
    const [checkedCategories, setCheckedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
    const [availability, setAvailability] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('featured')

    useEffect(() => {
        setCategory(initialCategory || 'All')
        setCheckedCategories(initialCategory ? [initialCategory] : [])
        setPage(1)
    }, [initialCategory])

    const categoryCards = useMemo(() => {
        const map = new Map<string, { name: string; count: number }>()
        for (const product of products) {
            for (const name of product.categories || []) {
                const item = map.get(name)
                if (item) item.count++
                else map.set(name, { name, count: 1 })
            }
        }
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
    }, [products])

    const brandCards = useMemo(() => {
        const map = new Map<string, number>()
        for (const product of products) {
            const brand = product.brand || 'Mixenza'
            map.set(brand, (map.get(brand) || 0) + 1)
        }
        return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name))
    }, [products])

    const stockCounts = useMemo(() => ({
        in: products.filter(product => product.quantity > 0).length,
        out: products.filter(product => product.quantity === 0).length,
    }), [products])

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        const activeCategories = checkedCategories.length ? checkedCategories : (category === 'All' ? [] : [category])
        const result = products.filter(product => {
            const categoryMatch = !activeCategories.length || product.categories.some(name => activeCategories.includes(name))
            const brandMatch = !brands.length || brands.includes(product.brand || 'Mixenza')
            const stockMatch = !availability.length
                || (availability.includes('in') && product.quantity > 0)
                || (availability.includes('out') && product.quantity === 0)
            const queryMatch = !normalized || [product.name, product.category, product.description, ...product.tags].some(value => String(value || '').toLowerCase().includes(normalized))
            return categoryMatch && brandMatch && stockMatch && queryMatch
        })
        return [...result].sort((a, b) => {
            if (sort === 'price-low') return a.price - b.price
            if (sort === 'price-high') return b.price - a.price
            if (sort === 'newest') return Number(b.new) - Number(a.new)
            return Number(b.sale) - Number(a.sale)
        })
    }, [availability, brands, category, checkedCategories, products, query, sort])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <section className="container py-10 md:py-16">
            <div className="mb-8">
                <p className="caption1 text-secondary">Home / Shop{category !== 'All' ? ` / ${category}` : ''}</p>
                <h1 className="heading3 mt-2">{title}</h1>
                <p className="text-secondary mt-2">{filtered.length} items available</p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
                <aside className="lg:sticky lg:top-28 h-fit">
                    <div className="rounded-xl border border-line bg-white">
                        <Link
                            href="/shop"
                            onClick={() => { setCategory('All'); setCheckedCategories([]); setPage(1) }}
                            className={`flex items-center h-14 px-5 text-[22px] font-semibold ${category === 'All' && !checkedCategories.length ? 'border-l-4 border-l-[#2563eb]' : 'border-l-4 border-l-transparent'}`}
                        >
                            Home
                        </Link>
                        <nav className="border-t border-line py-2">
                            {categoryCards.map(item => (
                                <Link
                                    key={item.name}
                                    href={shopPath(item.name)}
                                    onClick={() => { setCategory(item.name); setCheckedCategories([item.name]); setPage(1) }}
                                    className="flex items-center justify-between px-5 py-3.5 text-[15px] text-[#6b7280] hover:text-black"
                                >
                                    {item.name}
                                    <CaretRight size={14} className="text-[#9ca3af]" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-[22px] font-semibold">Categories</h2>
                        <div className="mt-4 space-y-3">
                            {categoryCards.map(item => (
                                <label key={item.name} className="flex items-center gap-3 text-[15px] text-[#6b7280] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-black"
                                        checked={checkedCategories.includes(item.name)}
                                        onChange={() => { setCheckedCategories(toggleValue(checkedCategories, item.name)); setPage(1) }}
                                    />
                                    {item.name} ({item.count})
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-line">
                        <h2 className="text-[22px] font-semibold">Availability</h2>
                        <div className="mt-4 space-y-3">
                            <label className="flex items-center gap-3 text-[15px] text-[#6b7280] cursor-pointer">
                                <input type="checkbox" className="h-4 w-4 accent-black" checked={availability.includes('in')} onChange={() => { setAvailability(toggleValue(availability, 'in')); setPage(1) }} />
                                In stock ({stockCounts.in})
                            </label>
                            <label className="flex items-center gap-3 text-[15px] text-[#6b7280] cursor-pointer">
                                <input type="checkbox" className="h-4 w-4 accent-black" checked={availability.includes('out')} onChange={() => { setAvailability(toggleValue(availability, 'out')); setPage(1) }} />
                                Out of stock ({stockCounts.out})
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-line">
                        <h2 className="text-[22px] font-semibold">Brand</h2>
                        <div className="mt-4 space-y-3">
                            {brandCards.map(item => (
                                <label key={item.name} className="flex items-center gap-3 text-[15px] text-[#6b7280] cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 accent-black" checked={brands.includes(item.name)} onChange={() => { setBrands(toggleValue(brands, item.name)); setPage(1) }} />
                                    {item.name} ({item.count})
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <div>
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search products..." className="h-12 flex-1 rounded-full border border-line bg-white px-5 outline-none focus:border-black" />
                        <select value={sort} onChange={event => { setSort(event.target.value); setPage(1) }} className="h-12 rounded-full border border-line bg-white px-5 outline-none">
                            <option value="featured">Featured</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    {visible.length ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                            {visible.map(product => <StoreProductCard key={product.id} product={product} />)}
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-[#f7f7f8] px-6 py-20 text-center">
                            <h3 className="heading6">No products found</h3>
                            <p className="mt-2 text-secondary">Try another search or category.</p>
                        </div>
                    )}

                    {pageCount > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-3">
                            <button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)} className="rounded-full border border-line px-5 py-2.5 disabled:opacity-40">Previous</button>
                            <span className="text-sm text-secondary">Page {page} of {pageCount}</span>
                            <button type="button" disabled={page === pageCount} onClick={() => setPage(value => value + 1)} className="rounded-full border border-line px-5 py-2.5 disabled:opacity-40">Next</button>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-5 mt-16">
                        {[
                            { title: 'Frequently Asked Questions', copy: 'Updates on safe shopping in our store.', image: '/images/blog/gold-prices.jpg', href: '/pages/faqs' },
                            { title: 'Online Payment Process', copy: 'Pay securely at checkout.', image: '/images/blog/mobile-prices.jpg', href: '/pages/faqs' },
                            { title: 'Home Delivery Options', copy: 'We ship across Pakistan.', image: '/images/blog/china-shipping.jpg', href: '/pages/faqs' },
                        ].map(card => (
                            <Link key={card.title} href={card.href} className="rounded-3xl bg-[#f7f7f8] overflow-hidden hover:shadow-md duration-200">
                                <div className="p-6">
                                    <h3 className="heading6">{card.title}</h3>
                                    <p className="caption1 text-secondary mt-2">{card.copy}</p>
                                </div>
                                <div className="relative h-40">
                                    <Image src={card.image} alt="" fill className="object-cover" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
