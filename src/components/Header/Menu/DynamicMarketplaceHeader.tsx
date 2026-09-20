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
import { loadCatalog } from '@/lib/catalogClient'
import { productPath, shopPath } from '@/lib/storePaths'
import { StarRow } from '@/components/Shop/StoreProductCard'

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

type CategoryCard = { name: string; slug: string; count: number; image: string }

function MegaMenu({
    categories,
    loading,
    error,
    featuredImage,
    onClose,
}: {
    categories: CategoryCard[]
    loading: boolean
    error: boolean
    featuredImage: string
    onClose: () => void
}) {
    return (
        <div className="absolute top-full left-0 z-[130] w-[min(920px,calc(100vw-48px))] rounded-2xl bg-[#f3f3f0] p-6 shadow-2xl grid lg:grid-cols-[1fr_250px] gap-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {categories.slice(0, 9).map(category => (
                    <Link
                        key={category.slug}
                        href={shopPath(category.name)}
                        onClick={onClose}
                        className="group flex items-start gap-3"
                    >
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#e8f36a]">
                            {category.image && <img src={category.image} alt="" className="h-full w-full object-contain p-1.5" />}
                        </span>
                        <span>
                            <span className="block text-sm font-semibold text-black group-hover:underline">{category.name}</span>
                            <span className="block text-xs text-secondary mt-0.5">{category.count} products</span>
                        </span>
                    </Link>
                ))}
                {!categories.length && (
                    <p className="text-secondary col-span-3">{loading ? 'Loading categories...' : error ? 'Categories unavailable. Please reload.' : 'No categories yet.'}</p>
                )}
            </div>
            <Link href="/shop" onClick={onClose} className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#0b1c29] text-white p-6 flex flex-col justify-end">
                {featuredImage && <img src={featuredImage} alt="" className="absolute inset-0 h-full w-full object-contain opacity-40 p-8" />}
                <span className="relative text-[11px] uppercase tracking-[0.18em] text-white/70">Bestsellers</span>
                <span className="relative heading6 mt-3">Shop picks that actually sell</span>
                <span className="relative mt-5 text-sm inline-flex items-center gap-2">View all products <span aria-hidden>→</span></span>
            </Link>
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
        loadCatalog()
            .then(data => {
                if (!cancelled) setProducts(Array.isArray(data?.products) ? data.products : [])
            })
            .catch(() => { if (!cancelled) setCatalogError(true) })
            .finally(() => { if (!cancelled) setCatalogLoading(false) })
        return () => { cancelled = true }
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
                })
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
        <header className="site-global-marketplace-header relative z-[100] w-full bg-white">
            <div className="md:h-[44px] h-[34px] bg-brand-dark border-b border-surface1">
                <div className="container mx-auto h-full flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-5 text-white text-xs">
                        <span>English</span>
                        <span>PKR</span>
                    </div>
                    <div className="text-center text-button-uppercase text-white flex-1">
                        New customers save 10% with the code GET10
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-white text-xs">
                        <span>f</span><span>◎</span><span>▶</span><span>𝕏</span><span>p</span>
                    </div>
                </div>
            </div>

            <div className="header-menu-main style-marketplace relative bg-brand w-full md:h-[74px] h-[56px]">
                <div className="container mx-auto h-full">
                    <div className="header-main flex items-center justify-between h-full gap-4">
                        <button className="lg:hidden text-white" onClick={handleMenuMobile} aria-label="Open menu"><Icon.List size={24} /></button>
                        <Logo variant="light" height={26} priority href="/" />
                        <div ref={searchRef} className="relative flex-1 max-w-[640px] px-2 max-lg:hidden">
                            <div className="flex items-center h-11 rounded-full bg-white overflow-hidden pl-4 shadow-sm">
                                <Icon.MagnifyingGlass size={18} className="text-secondary shrink-0" />
                                <input
                                    className="h-full flex-1 border-0 bg-transparent px-3 outline-none text-sm"
                                    placeholder="Search products, categories..."
                                    value={keyword}
                                    onFocus={() => setSearchOpen(true)}
                                    onChange={event => { setKeyword(event.target.value); setSearchOpen(true) }}
                                    onKeyDown={event => event.key === 'Enter' && search()}
                                />
                                <button type="button" onClick={() => search()} className="h-full px-6 bg-primary hover:bg-primary-dark text-white text-xs font-semibold tracking-wide uppercase">Search</button>
                            </div>
                            {searchOpen && keyword.trim() && (
                                <div className="absolute left-2 right-2 top-[52px] z-[120] rounded-2xl bg-white p-4 shadow-2xl">
                                    {suggestions.length ? suggestions.map(product => (
                                        <Link
                                            key={product.id}
                                            href={productPath(product)}
                                            onClick={() => setSearchOpen(false)}
                                            className="flex items-center gap-3 py-3 border-b border-line last:border-0"
                                        >
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f5]">
                                                {product.thumbImage?.[0] && <img src={product.thumbImage[0]} alt="" className="h-full w-full object-contain p-1" loading="lazy" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium">{product.name}</div>
                                                <StarRow rate={product.rate} count={product.sold || 121} />
                                            </div>
                                            <strong className="text-sm">Rs. {Number(product.price || 0).toLocaleString('en-PK')}</strong>
                                        </Link>
                                    )) : <button type="button" onClick={() => search()} className="w-full px-3 py-3 text-left text-sm text-secondary">Search for “{keyword.trim()}”</button>}
                                </div>
                            )}
                        </div>
                        <button className="lg:hidden text-white" onClick={openModalSearch} aria-label="Search"><Icon.MagnifyingGlass size={23} /></button>
                        <div className="flex items-center gap-4 text-white">
                            <button onClick={handleLoginPopup} aria-label="Account"><Icon.User weight="bold" size={23} /></button>
                            <button onClick={openModalWishlist} aria-label="Wishlist" className="max-md:hidden"><Icon.Heart weight="bold" size={23} /></button>
                            <button onClick={openModalCart} aria-label="Cart" className="relative"><Icon.Handbag weight="bold" size={23} /><span className="absolute -right-2 -top-2 text-[10px] text-white bg-red w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span></button>
                        </div>
                    </div>
                </div>
            </div>

            {openMenuMobile && (
                <div id="menu-mobile" className="lg:hidden bg-white border-b border-line px-6 py-4 flex flex-col gap-3">
                    <Link href="/" onClick={handleMenuMobile} className="text-button-uppercase py-2">Home</Link>
                    <Link href="/shop" onClick={handleMenuMobile} className="text-button-uppercase py-2">Shop</Link>
                    <Link href="/blog" onClick={handleMenuMobile} className="text-button-uppercase py-2">Blog</Link>
                    <Link href="/pages/contact" onClick={handleMenuMobile} className="text-button-uppercase py-2">Contact</Link>
                </div>
            )}

            <div className="border-b border-line h-[52px] max-lg:hidden bg-white">
                <div className="container mx-auto h-full flex items-center">
                    <div
                        className="relative h-full flex items-center pr-8 border-r border-line"
                        onMouseEnter={() => setOpenDepartment(true)}
                        onMouseLeave={() => setOpenDepartment(false)}
                    >
                        <button className="h-full flex items-center gap-3 text-button-uppercase" aria-expanded={openDepartment}>
                            <Icon.List size={19} /> Department <Icon.CaretDown size={17} />
                        </button>
                        {openDepartment && (
                            <MegaMenu categories={categories} loading={catalogLoading} error={catalogError} featuredImage={featuredImage} onClose={() => setOpenDepartment(false)} />
                        )}
                    </div>

                    <nav className="flex items-center gap-8 pl-8 h-full">
                        <Link href="/" className="text-button-uppercase">Home</Link>
                        <div
                            className="relative h-full flex items-center"
                            onMouseEnter={() => setOpenShop(true)}
                            onMouseLeave={() => setOpenShop(false)}
                        >
                            <Link href="/shop" className="h-full flex items-center gap-1 text-button-uppercase">
                                Shop <Icon.CaretDown size={14} />
                            </Link>
                            {openShop && (
                                <MegaMenu categories={categories} loading={catalogLoading} error={catalogError} featuredImage={featuredImage} onClose={() => setOpenShop(false)} />
                            )}
                        </div>
                        <Link href="/shop" className="text-button-uppercase">Products</Link>
                        <Link href="/blog" className="text-button-uppercase">Blog</Link>
                        <Link href="/pages/contact" className="text-button-uppercase">Contact</Link>
                    </nav>
                </div>
            </div>

            <div className={`login-popup absolute top-[118px] right-8 w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? 'open' : ''}`}>
                <Link href="/login" className="button-main w-full text-center">Login</Link>
                <div className="text-secondary text-center mt-3 pb-4">Don’t have an account? <Link href="/register" className="text-black pl-1 hover:underline">Register</Link></div>
                <Link href="/my-account" className="button-main bg-white text-black border border-black w-full text-center">Dashboard</Link>
            </div>
        </header>
    )
}
