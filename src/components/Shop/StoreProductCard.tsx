'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/Brand/Logo'
import { Eye, Heart } from '@phosphor-icons/react/dist/ssr'
import { formatMoney } from '@/utils/currency'
import { productPath } from '@/lib/storePaths'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext'
import { useWishlist } from '@/context/WishlistContext'
import type { ProductType } from '@/type/ProductType'
import { isBulkOnlyProduct } from '@/lib/bulkOrder'

export function StarRow({ rate = 0, count = 0 }: { rate?: number; count?: number }) {
    if (!(Number(rate) > 0 && Number(count) > 0)) return null
    const stars = Math.max(1, Math.min(5, Math.round(Number(rate))))
    return (
        <div className="flex items-center gap-1 mt-1">
            <span className="text-[#16a34a] text-[11px] tracking-tight leading-none">{'★'.repeat(stars)}</span>
            <span className="text-[11px] text-secondary leading-none">({count})</span>
        </div>
    )
}

export default function StoreProductCard({ product, premium = false }: { product: ProductType; premium?: boolean }) {
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const { openQuickview } = useModalQuickviewContext()
    const { wishlistState, addToWishlist, removeFromWishlist } = useWishlist()
    const wished = wishlistState.wishlistArray.some(item => item.id === product.id)
    // Try every real photo in the gallery before showing an unavailable state.
    // This handles an expired first Cloudinary URL without discarding valid media.
    const candidates = Array.from(new Set([...(product.thumbImage || []), ...(product.images || [])].filter(Boolean)))
    const [imageIndex, setImageIndex] = useState(0)
    const image = candidates[imageIndex] || ''
    const galleryKey = candidates.join('|')
    useEffect(() => setImageIndex(0), [product.id, galleryKey])
    const bulkOnly = isBulkOnlyProduct(product.name)
    const soldOut = product.quantity === 0

    const add = () => {
        if (bulkOnly || soldOut) return
        addToCart({ ...product })
        updateCart(product.id, 1, '', '')
        openModalCart()
    }

    return (
        <article className={premium ? "group mx-product-card" : "group"}>
            <div className={premium ? "mx-product-photo relative h-[300px] rounded-xl bg-[#f4f4f5] overflow-hidden" : "relative h-[300px] rounded-xl bg-[#f4f4f5] overflow-hidden"}>
                <Link href={productPath(product)} className="absolute inset-0">
                    {image ? (
                        <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw"
                            onError={() => setImageIndex(index => Math.min(index + 1, candidates.length))}
                            className="object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f1f3f9] via-[#f7f8fc] to-[#ebeef7] px-5 text-center">
                            <div className="mb-4 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-sm"><Logo href={null} height={28} /></div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657188]">Photo unavailable</span>
                            <span className="mt-2 line-clamp-2 max-w-[200px] text-xs leading-5 text-secondary">{product.name}</span>
                        </div>
                    )}
                </Link>
                <div className="absolute top-2 right-2 z-[1] flex flex-col gap-1.5">
                    <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={() => wished ? removeFromWishlist(product.id) : addToWishlist(product)}
                        className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center"
                    >
                        <Heart size={14} weight={wished ? 'fill' : 'regular'} className={wished ? 'text-red' : 'text-black'} />
                    </button>
                    {!bulkOnly && <button
                        type="button"
                        aria-label="Quick view"
                        onClick={() => openQuickview(product)}
                        className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center opacity-100 transition-all duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                        <Eye size={14} className="text-black" />
                    </button>}
                </div>
                {bulkOnly && <span className="absolute top-2 left-2 z-[1] rounded-full bg-white px-2 py-1 text-[10px] font-semibold">Bulk quote required</span>}
                {soldOut && !bulkOnly && <span className="absolute bottom-0 inset-x-0 bg-black/70 py-1 text-center text-[11px] text-white">Out of stock</span>}
                {bulkOnly ? (
                    <Link href={productPath(product)} className="absolute inset-x-2 bottom-2 z-[1] flex h-9 items-center justify-center rounded-full bg-black text-xs font-medium text-white">View bulk details</Link>
                ) : (
                    <button type="button" disabled={soldOut} onClick={add}
                        className="absolute inset-x-2 bottom-2 z-[1] h-9 rounded-full bg-black text-xs font-medium text-white opacity-100 transition-all duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40">
                        {soldOut ? 'Out of stock' : 'Add to Cart'}
                    </button>
                )}
            </div>
            <div className={premium ? "mx-product-caption flex items-start justify-between gap-2 mt-2.5" : "flex items-start justify-between gap-2 mt-2.5"}>
                <Link href={productPath(product)} className="text-[13px] font-medium leading-4 line-clamp-2">{product.name}</Link>
                <strong className="shrink-0 text-[13px] leading-4">{formatMoney(product.price)}</strong>
            </div>
            <p className="text-[12px] text-secondary mt-0.5 line-clamp-1 leading-tight">{product.category || 'Mixenza pick'}</p>
        </article>
    )
}
