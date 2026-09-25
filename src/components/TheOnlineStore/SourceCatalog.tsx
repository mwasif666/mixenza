'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { SourceProduct } from '@/lib/theOnlineStore'
import { shopPath } from '@/lib/storePaths'
import StoreProductCard from '@/components/Shop/StoreProductCard'

interface Props {
    products: SourceProduct[]
    initialCategory?: string | null
    title?: string
}

const PAGE_SIZE = 24

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
]

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
    const [sortOpen, setSortOpen] = useState(false)

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
    const activeSortLabel = sortOptions.find(option => option.value === sort)?.label || 'Featured'

    return (
        <section className="container py-8 md:py-12">
            <div className="mb-6 md:mb-8">
                <p className="caption1 text-secondary">Home / Shop{category !== 'All' ? ` / ${category}` : ''}</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="heading3">{title}</h1>
                        <p className="caption1 mt-1 text-secondary">{filtered.length} items available</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
                <aside className="h-fit lg:sticky lg:top-28">
                    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(31,31,31,0.03)]">
                        <Link
                            href="/shop"
                            onClick={() => { setCategory('All'); setCheckedCategories([]); setPage(1) }}
                            className={`flex min-h-12 items-center px-4 text-[18px] font-semibold transition ${category === 'All' && !checkedCategories.length ? 'border-l-4 border-l-primary bg-primary/5' : 'border-l-4 border-l-transparent hover:bg-surface'}`}
                        >
                            Home
                        </Link>
                        <nav className="divide-y divide-line border-t border-line">
                            {categoryCards.map(item => (
                                <Link
                                    key={item.name}
                                    href={shopPath(item.name)}
                                    onClick={() => { setCategory(item.name); setCheckedCategories([item.name]); setPage(1) }}
                                    className="flex min-h-11 items-center justify-between gap-3 px-4 py-2.5 text-[14px] text-secondary transition hover:bg-surface hover:text-black"
                                >
                                    <span className="leading-5">{item.name}</span>
                                    <CaretRight size={14} className="shrink-0 text-secondary2" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(31,31,31,0.03)]">
                        <div className="border-b border-line px-4 py-3">
                            <h2 className="text-[18px] font-semibold">Categories</h2>
                        </div>
                        <div className="divide-y divide-line">
                            {categoryCards.map(item => (
                                <label key={item.name} className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] text-secondary transition hover:bg-surface hover:text-black">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 shrink-0 accent-black"
                                        checked={checkedCategories.includes(item.name)}
                                        onChange={() => { setCheckedCategories(toggleValue(checkedCategories, item.name)); setPage(1) }}
                                    />
                                    <span className="flex-1 leading-5">{item.name}</span>
                                    <span className="text-xs text-secondary2">({item.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(31,31,31,0.03)]">
                        <div className="border-b border-line px-4 py-3">
                            <h2 className="text-[18px] font-semibold">Availability</h2>
                        </div>
                        <div className="divide-y divide-line">
                            <label className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] text-secondary transition hover:bg-surface hover:text-black">
                                <input type="checkbox" className="h-4 w-4 shrink-0 accent-black" checked={availability.includes('in')} onChange={() => { setAvailability(toggleValue(availability, 'in')); setPage(1) }} />
                                <span className="flex-1">In stock</span>
                                <span className="text-xs text-secondary2">({stockCounts.in})</span>
                            </label>
                            <label className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] text-secondary transition hover:bg-surface hover:text-black">
                                <input type="checkbox" className="h-4 w-4 shrink-0 accent-black" checked={availability.includes('out')} onChange={() => { setAvailability(toggleValue(availability, 'out')); setPage(1) }} />
                                <span className="flex-1">Out of stock</span>
                                <span className="text-xs text-secondary2">({stockCounts.out})</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(31,31,31,0.03)]">
                        <div className="border-b border-line px-4 py-3">
                            <h2 className="text-[18px] font-semibold">Brand</h2>
                        </div>
                        <div className="max-h-[300px] divide-y divide-line overflow-y-auto">
                            {brandCards.map(item => (
                                <label key={item.name} className="flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] text-secondary transition hover:bg-surface hover:text-black">
                                    <input type="checkbox" className="h-4 w-4 shrink-0 accent-black" checked={brands.includes(item.name)} onChange={() => { setBrands(toggleValue(brands, item.name)); setPage(1) }} />
                                    <span className="flex-1 leading-5">{item.name}</span>
                                    <span className="text-xs text-secondary2">({item.count})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-surface/60 p-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <input
                                value={query}
                                onChange={event => { setQuery(event.target.value); setPage(1) }}
                                placeholder="Search products..."
                                className="h-11 w-full rounded-xl border border-line bg-white px-4 text-[14px] outline-none transition focus:border-black"
                            />
                        </div>

                        <div className="relative sm:w-[210px]">
                            <button
                                type="button"
                                onClick={() => setSortOpen(value => !value)}
                                className="flex h-11 w-full items-center justify-between rounded-xl border border-line bg-white px-4 text-left text-[14px] font-medium transition hover:border-secondary2"
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                            >
                                <span>{activeSortLabel}</span>
                                <CaretDown size={15} className={`transition ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_14px_40px_rgba(31,31,31,0.12)]" role="listbox">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => { setSort(option.value); setPage(1); setSortOpen(false) }}
                                            className={`block w-full px-4 py-2.5 text-left text-[14px] transition hover:bg-surface ${sort === option.value ? 'bg-primary/10 font-semibold text-primary' : 'text-black'}`}
                                            role="option"
                                            aria-selected={sort === option.value}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {visible.length ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-5">
                            {visible.map(product => <StoreProductCard key={product.id} product={product} />)}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
                            <h3 className="heading6">No products found</h3>
                            <p className="mt-2 text-secondary">Try another search or category.</p>
                        </div>
                    )}

                    {pageCount > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage(value => value - 1)}
                                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <CaretLeft size={16} />
                                Previous
                            </button>
                            <span className="text-sm text-secondary">Page {page} of {pageCount}</span>
                            <button
                                type="button"
                                disabled={page === pageCount}
                                onClick={() => setPage(value => value + 1)}
                                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <CaretRight size={16} />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}
