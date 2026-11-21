'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import Logo from '@/components/Brand/Logo'
import useLoginPopup from '@/store/useLoginPopup'
import useMenuMobile from '@/store/useMenuMobile'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useCart } from '@/context/CartContext'
import { loadCatalog, subscribeCatalogUpdates } from '@/lib/catalogClient'
import { productPath, shopPath } from '@/lib/storePaths'

type Product = {
    id: string
    name: string
    price: number
    originPrice: number
    thumbImage?: string[]
    images?: string[]
    categories?: string[]
    tags?: string[]
    slug?: string
    rate?: number
    sold?: number
}

type CategoryCard = { name: string; slug: string; count: number; image: string; products: Product[] }

/* ─── Department: simple vertical list dropdown ─── */
function DepartmentDropdown({
    categories,
    loading,
    error,
    onClose,
}: {
    categories: CategoryCard[]
    loading: boolean
    error: boolean
    onClose: () => void
}) {
    return (
        <div className="absolute top-full left-0 z-[130] w-[260px] rounded-2xl bg-white border border-line shadow-2xl py-2 overflow-hidden">
            {categories.length > 0 ? categories.slice(0, 10).map(category => (
                <Link
                    key={category.slug}
                    href={shopPath(category.name)}
                    onClick={onClose}
                    className="group flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-[#f5f5f3]"
                >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[#f0f0ee]">
                        {category.image && <img src={category.image} alt="" className="h-full w-full rounded-lg object-cover" loading="lazy" />}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-black group-hover:text-primary">{category.name}</span>
                        <span className="block text-[11px] text-secondary">{category.count} products</span>
                    </span>
                </Link>
            )) : (
                <p className="px-5 py-4 text-sm text-secondary">{loading ? 'Loading...' : error ? 'Unavailable' : 'No categories'}</p>
            )}
            {categories.length > 10 && (
                <Link href="/shop" onClick={onClose} className="block border-t border-line mt-1 px-5 py-3 text-xs font-semibold text-primary hover:underline text-center">
                    View all categories →
                </Link>
            )}
        </div>
    )
}

/* ─── Shop: mega menu with category columns + products (3rd screenshot style) ─── */
function ShopMegaMenu({
    categories,
    loading,
    error,
    onClose,
}: {
    categories: CategoryCard[]
    loading: boolean
    error: boolean
    onClose: () => void
}) {
    /* Show max 6 categories (2 per column × 3 columns) to fit on screen */
    const visibleCategories = categories.slice(0, 6)
    const colSize = 2
    const columns: CategoryCard[][] = []
    for (let i = 0; i < visibleCategories.length; i += colSize) {
        columns.push(visibleCategories.slice(i, i + colSize))
    }

    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-[130] w-[min(1080px,calc(100vw-32px))] rounded-[22px] border border-black/5 bg-[#f3f3f0] p-7 shadow-2xl">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8">
                {/* Category columns with products */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
                    {columns.map((col, colIdx) => (
                        <div key={colIdx} className="min-w-0">
                            {col.map(category => (
                                <div key={category.slug} className="mb-6">
                                    {/* Category heading with icon */}
                                    <Link
                                        href={shopPath(category.name)}
                                        onClick={onClose}
                                        className="group flex items-center gap-2.5 mb-2.5"
                                    >
                                        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-[#f0f0ee]">
                                            {category.image && <img src={category.image} alt="" className="h-full w-full rounded-lg object-cover" loading="lazy" />}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-bold text-black group-hover:underline">{category.name}</span>
                                            <span className="block text-[11px] text-secondary">{category.count} products</span>
                                        </span>
                                    </Link>
                                    {/* Products list under category */}
                                    <div className="pl-[42px] space-y-1.5">
                                        {category.products.slice(0, 3).map(product => (
                                            <Link
                                                key={product.id}
                                                href={productPath(product)}
                                                onClick={onClose}
                                                className="block truncate text-[13px] text-secondary transition-colors hover:text-black hover:underline"
                                            >
                                                {product.name}
                                            </Link>
                                        ))}
                                        {category.count > 3 && (
                                            <Link
                                                href={shopPath(category.name)}
                                                onClick={onClose}
                                                className="block text-[13px] font-semibold text-black hover:underline"
                                            >
                                                View all →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    {!categories.length && (
                        <p className="text-secondary col-span-3 py-4">{loading ? 'Loading categories...' : error ? 'Categories unavailable. Please reload.' : 'No categories yet.'}</p>
                    )}
                </div>

                {/* Featured card on right — Mixenza shop CTA */}
                <Link href="/shop" onClick={onClose} className="group relative overflow-hidden rounded-2xl p-7 flex flex-col justify-between" style={{ background: 'linear-gradient(145deg, #303136 0%, #1A1B1F 55%, #D64A00 120%)' }}>
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
                    <div className="absolute bottom-12 -left-8 h-28 w-28 rounded-full bg-primary/20" />
                    <div className="absolute top-1/2 right-6 h-16 w-16 rounded-full bg-white/[0.03]" />

                    <div className="relative">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary text-[11px] uppercase tracking-[0.18em] text-white">Mixenza Shop</span>
                    </div>

                    <div className="relative mt-auto pt-8">
                        <h4 className="text-[22px] font-bold text-white leading-tight">Everyday essentials, priced in PKR</h4>
                        <p className="mt-3 text-sm text-white/70 leading-relaxed">{categories.length} categories &middot; {categories.reduce((sum, c) => sum + c.count, 0)}+ products across Pakistan</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                            Shop the collection <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                        </span>
                    </div>
                </Link>
            </div>
            {categories.length > 6 && (
                <div className="mt-5 pt-4 border-t border-black/5 text-center">
                    <Link href="/shop" onClick={onClose} className="text-sm font-semibold text-black hover:underline inline-flex items-center gap-1.5">
                        View all {categories.length} categories <span aria-hidden>→</span>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function DynamicMarketplaceHeader() {
    const [products, setProducts] = useState<Product[]>([])
    const [openDepartment, setOpenDepartment] = useState(false)
    const [openShop, setOpenShop] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [catalogLoading, setCatalogLoading] = useState(true)
    const [catalogError, setCatalogError] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { openMenuMobile, handleMenuMobile } = useMenuMobile()
    const { openModalCart } = useModalCartContext()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()
    const { cartState } = useCart()

    useEffect(() => {
        let cancelled = false
        const refresh = () => {
            loadCatalog()
                .then(data => {
                    if (!cancelled) {
                        setProducts(Array.isArray(data?.products) ? data.products : [])
                        setCatalogError(false)
                    }
                })
                .catch(() => { if (!cancelled) setCatalogError(true) })
                .finally(() => { if (!cancelled) setCatalogLoading(false) })
        }
        refresh()
        const unsubscribe = subscribeCatalogUpdates(refresh)
        return () => {
            cancelled = true
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        const close = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    const categories = useMemo(() => {
        const map = new Map<string, CategoryCard>()
        for (const product of products) {
            for (const name of product.categories || []) {
                const existing = map.get(name)
                if (existing) existing.count++
                else map.set(name, {
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                    count: 1,
                    image: product.thumbImage?.[0] || product.images?.[0] || '',
                    products: [product],
                })
                if (existing && !existing.products.some(item => item.id === product.id)) existing.products.push(product)
            }
        }
        return Array.from(map.values()).sort((a, b) => b.count - a.count)
    }, [products])

    const suggestions = useMemo(() => {
        const value = keyword.trim().toLowerCase()
        if (!value) return []
        return products
            .filter(product => [product.name, ...(product.categories || []), ...(product.tags || [])].some(item => String(item).toLowerCase().includes(value)))
            .slice(0, 6)
    }, [keyword, products])

    const search = (value = keyword) => {
        const query = value.trim()
        if (!query) return
        setSearchOpen(false)
        router.push(`/search-result?query=${encodeURIComponent(query)}`)
    }

    const featuredImage = categories[0]?.image || products[0]?.thumbImage?.[0] || ''

    return (
        <header className="site-global-marketplace-header mx-site-header relative z-[100] w-full bg-white">
          <div className="mx-announcement">
            <div className="container mx-announcement-inner">
              <span><Icon.Truck size={17} /> Free Shipping on Orders Above Rs. 5,000</span>
              <span><Icon.ArrowCounterClockwise size={17} /> Easy Returns Within 7 Days</span>
              <span><Icon.ShieldCheck size={17} /> Secure &amp; Trusted Payments</span>
            </div>
          </div>
          <div className="mx-mainbar">
            <div className="container mx-header-inner">
              <button type="button" className="mx-mobile-menu-button" onClick={handleMenuMobile} aria-label="Toggle navigation"><Icon.List size={26} /></button>
              <Logo variant="color" height={31} priority href="/" />
              <nav className="mx-primary-nav" aria-label="Main navigation" onMouseLeave={() => setOpenShop(false)}>
                <Link href="/" className="mx-nav-active">Home</Link>
                <div className="mx-shop-entry" onMouseEnter={() => setOpenShop(true)}>
                  <Link href="/shop">Shop <Icon.CaretDown size={12}/></Link>
                </div>
                <Link href="/shop">All Categories</Link>
                <Link href="/shop">New Arrivals</Link>
                <Link href="/shop">Best Sellers</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/pages/contact">Contact</Link>
                {openShop && <div className="mx-menu-popup" onMouseEnter={() => setOpenShop(true)} onMouseLeave={() => setOpenShop(false)}><ShopMegaMenu categories={categories} loading={catalogLoading} error={catalogError} onClose={() => setOpenShop(false)} /></div>}
              </nav>
              <div className="mx-header-actions">
                <button type="button" aria-label="Search Mixenza" onClick={() => setSearchOpen(!searchOpen)}><Icon.MagnifyingGlass size={22}/></button>
                <button type="button" aria-label="My account" onClick={handleLoginPopup}><Icon.User size={22}/></button>
                <button type="button" aria-label="Wishlist" onClick={openModalWishlist} className="mx-wishlist-action"><Icon.Heart size={23}/></button>
                <button type="button" aria-label="Shopping cart" onClick={openModalCart} className="mx-cart-action"><Icon.ShoppingCart size={23}/><span>{cartState.cartArray.length}</span></button>
              </div>
            </div>
          </div>
          {searchOpen && <div className="mx-search-panel">
            <div className="container">
              <div className="mx-search-wrap" ref={searchRef}>
                <Icon.MagnifyingGlass size={21} aria-hidden="true"/>
                <input type="search" value={keyword} placeholder="Search for products and categories" aria-label="Search products" autoFocus
                  onChange={event => setKeyword(event.target.value)} onKeyDown={event => {if(event.key === 'Enter')search()}} />
                <button type="button" className="mx-search-submit" onClick={() => search()}>Search</button>
                <button type="button" className="mx-search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}><Icon.X size={20}/></button>
              </div>
              {keyword.trim() && <div className="mx-search-results">
                {suggestions.length ? suggestions.map(product =>
                  <Link href={productPath(product)} onClick={() => setSearchOpen(false)} key={product.id}>{product.name}</Link>
                ) : <button type="button" onClick={() => search()}>Search for &ldquo;{keyword.trim()}&rdquo;</button>}
              </div>}
            </div>
          </div>}
          {openMenuMobile && <nav className="mx-mobile-nav" aria-label="Mobile navigation">
            <Link href="/" onClick={handleMenuMobile}>Home</Link>
            <Link href="/shop" onClick={handleMenuMobile}>Shop</Link>
            <Link href="/shop" onClick={handleMenuMobile}>All Categories</Link>
            <Link href="/shop" onClick={handleMenuMobile}>New Arrivals</Link>
            <Link href="/blog" onClick={handleMenuMobile}>Blog</Link>
            <Link href="/pages/contact" onClick={handleMenuMobile}>Contact</Link>
          </nav>}
            <div className={`login-popup absolute top-[118px] right-8 w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? 'open' : ''}`}>
                <Link href="/login" className="button-main w-full text-center">Login</Link>
                <div className="text-secondary text-center mt-3 pb-4">Don&apos;t have an account? <Link href="/register" className="text-black pl-1 hover:underline">Register</Link></div>
                <Link href="/my-account" className="button-main bg-white text-black border border-black w-full text-center">Dashboard</Link>
            </div>
        </header>
    )
}
