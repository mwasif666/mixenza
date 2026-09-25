'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
    CaretDown,
    CaretLeft,
    CaretRight,
    Check,
    FunnelSimple,
    MagnifyingGlass,
} from '@phosphor-icons/react/dist/ssr'
import { SourceProduct } from '@/lib/theOnlineStore'
import { shopPath } from '@/lib/storePaths'
import StoreProductCard from '@/components/Shop/StoreProductCard'

interface Props {
    products: SourceProduct[]
    initialCategory?: string | null
    title?: string
}

const PAGE_SIZE = 24
const INITIAL_CATEGORY_LIMIT = 8

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
    const [availability, setAvailability] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('featured')
    const [sortOpen, setSortOpen] = useState(false)
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [filtersOpen, setFiltersOpen] = useState(false)

    useEffect(() => {
        setCategory(initialCategory || 'All')
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

    const visibleCategories = showAllCategories
        ? categoryCards
        : categoryCards.slice(0, INITIAL_CATEGORY_LIMIT)

    const brandCards = useMemo(() => {
        const map = new Map<string, number>()
        for (const product of products) {
            const brand = product.brand || 'Mixenza'
            map.set(brand, (map.get(brand) || 0) + 1)
        }
        return Array.from(map.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [products])

    const stockCounts = useMemo(() => ({
        in: products.filter(product => product.quantity > 0).length,
        out: products.filter(product => product.quantity === 0).length,
    }), [products])

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase()

        const result = products.filter(product => {
            const categoryMatch = category === 'All' || product.categories.includes(category)
            const brandMatch = !brands.length || brands.includes(product.brand || 'Mixenza')
            const stockMatch = !availability.length
                || (availability.includes('in') && product.quantity > 0)
                || (availability.includes('out') && product.quantity === 0)
            const queryMatch = !normalized
                || [product.name, product.category, product.description, ...product.tags]
                    .some(value => String(value || '').toLowerCase().includes(normalized))

            return categoryMatch && brandMatch && stockMatch && queryMatch
        })

        return [...result].sort((a, b) => {
            if (sort === 'price-low') return a.price - b.price
            if (sort === 'price-high') return b.price - a.price
            if (sort === 'newest') return Number(b.new) - Number(a.new)
            return Number(b.sale) - Number(a.sale)
        })
    }, [availability, brands, category, products, query, sort])

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const activeSortLabel = sortOptions.find(option => option.value === sort)?.label || 'Featured'
    const hasActiveFilters = category !== 'All' || availability.length > 0 || brands.length > 0 || query.trim() !== ''

    const clearLocalFilters = () => {
        setCategory('All')
        setAvailability([])
        setBrands([])
        setQuery('')
        setSort('featured')
        setPage(1)
        setSortOpen(false)
    }

    return (
        <section className="container py-8 md:py-12">
            <div className="mb-6 md:mb-8">
                <p className="caption1 text-secondary">
                    Home / Shop{category !== 'All' ? ` / ${category}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="heading3">{title}</h1>
                        <p className="caption1 mt-1 text-secondary">
                            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} available
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
                <aside className="h-fit lg:sticky lg:top-28">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(value => !value)}
                        className="mb-3 flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-left lg:hidden"
                    >
                        <span className="flex items-center gap-2 text-[15px] font-semibold">
                            <FunnelSimple size={18} className="text-primary" />
                            Filters
                        </span>
                        <CaretDown size={16} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`${filtersOpen ? 'block' : 'hidden'} overflow-hidden rounded-[18px] border border-line bg-white lg:block`}>
                        <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                            <div className="flex items-center gap-2">
                                <FunnelSimple size={18} className="text-primary" />
                                <span className="text-[15px] font-semibold">Shop filters</span>
                            </div>
                            {hasActiveFilters && (
                                <Link
                                    href="/shop"
                                    onClick={() => {
                                        clearLocalFilters()
                                        setFiltersOpen(false)
                                    }}
                                    className="text-[12px] font-medium text-primary hover:underline"
                                >
                                    Clear all
                                </Link>
                            )}
                        </div>

                        <div className="border-b border-line px-3 py-4">
                            <div className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary">
                                Categories
                            </div>

                            <div className="space-y-1">
                                <Link
                                    href="/shop"
                                    onClick={() => {
                                        setCategory('All')
                                        setPage(1)
                                        setFiltersOpen(false)
                                    }}
                                    className={`flex min-h-9 items-center justify-between rounded-lg px-3 py-2 text-[13px] transition ${category === 'All' ? 'bg-primary-light font-semibold text-black' : 'text-secondary hover:bg-surface hover:text-black'}`}
                                >
                                    <span>All products</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${category === 'All' ? 'bg-white text-primary' : 'bg-surface text-secondary2'}`}>
                                        {products.length}
                                    </span>
                                </Link>

                                {visibleCategories.map(item => {
                                    const active = category === item.name
                                    return (
                                        <Link
                                            key={item.name}
                                            href={shopPath(item.name)}
                                            onClick={() => {
                                                setCategory(item.name)
                                                setPage(1)
                                                setFiltersOpen(false)
                                            }}
                                            className={`flex min-h-9 items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] transition ${active ? 'bg-primary-light font-semibold text-black' : 'text-secondary hover:bg-surface hover:text-black'}`}
                                        >
                                            <span className="min-w-0 flex-1 leading-5">{item.name}</span>
                                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${active ? 'bg-white text-primary' : 'bg-surface text-secondary2'}`}>
                                                {item.count}
                                            </span>
                                        </Link>
                                    )
                                })}
                            </div>

                            {categoryCards.length > INITIAL_CATEGORY_LIMIT && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllCategories(value => !value)}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-primary transition hover:bg-primary-light"
                                >
                                    {showAllCategories ? 'Show less' : `Show all ${categoryCards.length} categories`}
                                    <CaretDown size={13} className={`transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>

                        <div className="border-b border-line px-3 py-4">
                            <div className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary">
                                Availability
                            </div>

                            <div className="space-y-1">
                                {[
                                    { key: 'in', label: 'In stock', count: stockCounts.in },
                                    { key: 'out', label: 'Out of stock', count: stockCounts.out },
                                ].map(item => {
                                    const active = availability.includes(item.key)
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => {
                                                setAvailability(toggleValue(availability, item.key))
                                                setPage(1)
                                            }}
                                            className={`flex min-h-9 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition ${active ? 'bg-primary-light text-black' : 'text-secondary hover:bg-surface hover:text-black'}`}
                                            aria-pressed={active}
                                        >
                                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${active ? 'border-primary bg-primary text-white' : 'border-outline bg-white'}`}>
                                                {active && <Check size={11} weight="bold" />}
                                            </span>
                                            <span className="flex-1">{item.label}</span>
                                            <span className="text-[11px] text-secondary2">{item.count}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="px-3 py-4">
                            <div className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-secondary">
                                Brand
                            </div>

                            <div className="space-y-1">
                                {brandCards.map(item => {
                                    const active = brands.includes(item.name)
                                    return (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => {
                                                setBrands(toggleValue(brands, item.name))
                                                setPage(1)
                                            }}
                                            className={`flex min-h-9 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition ${active ? 'bg-primary-light text-black' : 'text-secondary hover:bg-surface hover:text-black'}`}
                                            aria-pressed={active}
                                        >
                                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${active ? 'border-primary bg-primary text-white' : 'border-outline bg-white'}`}>
                                                {active && <Check size={11} weight="bold" />}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate">{item.name}</span>
                                            <span className="text-[11px] text-secondary2">{item.count}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="mb-6 flex flex-col gap-3 rounded-[18px] border border-line bg-white p-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <MagnifyingGlass
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary2"
                            />
                            <input
                                value={query}
                                onChange={event => {
                                    setQuery(event.target.value)
                                    setPage(1)
                                }}
                                placeholder="Search products..."
                                className="h-11 w-full rounded-xl border border-line bg-surface/60 pl-11 pr-4 text-[14px] outline-none transition focus:border-primary focus:bg-white"
                            />
                        </div>

                        <div className="relative sm:w-[210px]">
                            <button
                                type="button"
                                onClick={() => setSortOpen(value => !value)}
                                className="flex h-11 w-full items-center justify-between rounded-xl border border-line bg-surface/60 px-4 text-left text-[14px] font-medium transition hover:border-primary hover:bg-white"
                                aria-haspopup="listbox"
                                aria-expanded={sortOpen}
                            >
                                <span>{activeSortLabel}</span>
                                <CaretDown size={15} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {sortOpen && (
                                <div
                                    className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-white p-1 shadow-[0_14px_40px_rgba(31,31,31,0.12)]"
                                    role="listbox"
                                >
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSort(option.value)
                                                setPage(1)
                                                setSortOpen(false)
                                            }}
                                            className={`block w-full rounded-lg px-3 py-2.5 text-left text-[13px] transition hover:bg-surface ${sort === option.value ? 'bg-primary-light font-semibold text-primary' : 'text-black'}`}
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
                        <div className="rounded-[18px] border border-line bg-surface px-6 py-16 text-center">
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
                                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <CaretLeft size={16} />
                                Previous
                            </button>
                            <span className="text-sm text-secondary">Page {page} of {pageCount}</span>
                            <button
                                type="button"
                                disabled={page === pageCount}
                                onClick={() => setPage(value => value + 1)}
                                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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
