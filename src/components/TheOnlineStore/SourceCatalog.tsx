'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { SourceProduct } from '@/lib/theOnlineStore'
import { formatMoney } from '@/utils/currency'
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

function SectionBar({ label }: { label: string }) {
    return (
        <div className="rounded-md bg-primary px-4 py-2.5">
            <h2 className="text-[14px] font-semibold text-white tracking-wide">{label}</h2>
        </div>
    )
}

function FilterRow({
    checked,
    onChange,
    label,
    count,
}: {
    checked: boolean
    onChange: () => void
    label: string
    count: number
}) {
    return (
        <label className="flex items-center gap-3 py-2 cursor-pointer group">
            <span className={`relative h-[18px] w-[18px] shrink-0 rounded-full border ${checked ? 'border-primary bg-primary' : 'border-[#cfcfcf] bg-white'}`}>
                {checked && <span className="absolute inset-[4px] rounded-full bg-white" />}
            </span>
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <span className={`flex-1 text-[14px] leading-snug ${checked ? 'text-black font-medium' : 'text-[#555] group-hover:text-black'}`}>{label}</span>
            <span className="shrink-0 min-w-[28px] h-6 px-2 rounded-full bg-[#f0f0f0] text-[12px] text-[#777] flex items-center justify-center">{count}</span>
        </label>
    )
}

export default function SourceCatalog({ products, initialCategory, title = 'Shop' }: Props) {
    const [category, setCategory] = useState(initialCategory || 'All')
    const [checkedCategories, setCheckedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
    const [availability, setAvailability] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('featured')

    const priceBounds = useMemo(() => {
        if (!products.length) return { min: 0, max: 10000 }
        const prices = products.map(product => product.price)
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        }
    }, [products])

    const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max])

    useEffect(() => {
        setCategory(initialCategory || 'All')
        setCheckedCategories(initialCategory ? [initialCategory] : [])
        setPage(1)
    }, [initialCategory])

    useEffect(() => {
        setPriceRange([priceBounds.min, priceBounds.max])
    }, [priceBounds.min, priceBounds.max])

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
            const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
            const queryMatch = !normalized || [product.name, product.category, product.description, ...product.tags].some(value => String(value || '').toLowerCase().includes(normalized))
            return categoryMatch && brandMatch && stockMatch && priceMatch && queryMatch
        })
        return [...result].sort((a, b) => {
            if (sort === 'price-low') return a.price - b.price
            if (sort === 'price-high') return b.price - a.price
            if (sort === 'newest') return Number(b.new) - Number(a.new)
            return Number(b.sale) - Number(a.sale)
        })
    }, [availability, brands, category, checkedCategories, priceRange, products, query, sort])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const breadcrumbTail = category !== 'All' ? category : title !== 'Shop' ? title : null

    return (
        <section>
            <div className="breadcrumb-block style-shared">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container py-10 md:py-14 relative">
                        <div className="main-content w-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="heading2 text-center">{title}</div>
                            <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                <Link href="/">Homepage</Link>
                                <CaretRight size={14} className="text-secondary2" />
                                {breadcrumbTail ? (
                                    <>
                                        <Link href="/shop">Shop</Link>
                                        <CaretRight size={14} className="text-secondary2" />
                                        <span className="text-secondary2 capitalize">{breadcrumbTail}</span>
                                    </>
                                ) : (
                                    <span className="text-secondary2">Shop</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8 md:py-12">
                <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
                    <aside className="shop-filter-sidebar lg:sticky lg:top-28 h-fit space-y-5">
                        <div>
                            <Slider
                                range
                                min={priceBounds.min}
                                max={priceBounds.max}
                                value={priceRange}
                                onChange={(value) => {
                                    const next = value as [number, number]
                                    setPriceRange(next)
                                    setPage(1)
                                }}
                                className="mt-1"
                            />
                            <p className="mt-3 text-[14px] text-black">
                                {formatMoney(priceRange[0])} – {formatMoney(priceRange[1])}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <SectionBar label="Search Products" />
                            <input
                                value={query}
                                onChange={event => { setQuery(event.target.value); setPage(1) }}
                                placeholder="Search for products..."
                                className="h-11 w-full rounded-md border border-line bg-white px-3 text-[14px] outline-none focus:border-primary"
                            />
                            <select
                                value={sort}
                                onChange={event => { setSort(event.target.value); setPage(1) }}
                                className="h-11 w-full rounded-md border border-line bg-white px-3 text-[14px] outline-none focus:border-primary"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <SectionBar label="Filter By" />

                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-1">Categories</h3>
                                <div className="divide-y divide-line/60">
                                    {categoryCards.map(item => (
                                        <FilterRow
                                            key={item.name}
                                            checked={checkedCategories.includes(item.name)}
                                            onChange={() => {
                                                setCheckedCategories(toggleValue(checkedCategories, item.name))
                                                setCategory('All')
                                                setPage(1)
                                            }}
                                            label={item.name}
                                            count={item.count}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-1">Availability</h3>
                                <FilterRow
                                    checked={availability.includes('in')}
                                    onChange={() => { setAvailability(toggleValue(availability, 'in')); setPage(1) }}
                                    label="In stock"
                                    count={stockCounts.in}
                                />
                                <FilterRow
                                    checked={availability.includes('out')}
                                    onChange={() => { setAvailability(toggleValue(availability, 'out')); setPage(1) }}
                                    label="Out of stock"
                                    count={stockCounts.out}
                                />
                            </div>

                            <div>
                                <h3 className="text-[14px] font-semibold text-black mb-1">Brand</h3>
                                {brandCards.map(item => (
                                    <FilterRow
                                        key={item.name}
                                        checked={brands.includes(item.name)}
                                        onChange={() => { setBrands(toggleValue(brands, item.name)); setPage(1) }}
                                        label={item.name}
                                        count={item.count}
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div>
                        {visible.length ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                                {visible.map(product => <StoreProductCard key={product.id} product={product} />)}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[#f7f7f8] px-6 py-16 text-center">
                                <h3 className="heading6">No products found</h3>
                                <p className="mt-2 text-secondary text-sm">Try another search or category.</p>
                            </div>
                        )}

                        {pageCount > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() => setPage(value => value - 1)}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
                                >
                                    <CaretLeft size={14} weight="bold" />
                                    Previous
                                </button>
                                <span className="text-sm text-secondary">Page {page} of {pageCount}</span>
                                <button
                                    type="button"
                                    disabled={page === pageCount}
                                    onClick={() => setPage(value => value + 1)}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
                                >
                                    Next
                                    <CaretRight size={14} weight="bold" />
                                </button>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            {[
                                { title: 'Online Payment Process', copy: 'Pay securely at checkout.', image: '/images/blog/mobile-prices.jpg', href: '/pages/faqs' },
                                { title: 'Home Delivery Options', copy: 'We ship across Pakistan.', image: '/images/blog/china-shipping.jpg', href: '/pages/faqs' },
                            ].map(card => (
                                <Link key={card.title} href={card.href} className="rounded-2xl bg-[#f7f7f8] overflow-hidden hover:shadow-md duration-200">
                                    <div className="p-4">
                                        <h3 className="text-[15px] font-semibold">{card.title}</h3>
                                        <p className="caption1 text-secondary mt-1">{card.copy}</p>
                                    </div>
                                    <div className="relative h-32">
                                        <Image src={card.image} alt="" fill className="object-cover" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
