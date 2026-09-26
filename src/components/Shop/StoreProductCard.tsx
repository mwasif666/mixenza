'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, Heart } from '@phosphor-icons/react/dist/ssr'
import { formatMoney } from '@/utils/currency'
import { productPath } from '@/lib/storePaths'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext'
import { useWishlist } from '@/context/WishlistContext'
import type { ProductType } from '@/type/ProductType'

export function StarRow({ rate = 5, count = 121 }: { rate?: number; count?: number }) {
    const stars = Math.max(1, Math.min(5, Math.round(Number(rate) || 5)))
    return (
        <div className="flex items-center gap-1 mt-1">
            <span className="text-[#16a34a] text-[11px] tracking-tight leading-none">{'★'.repeat(stars)}</span>
            <span className="text-[11px] text-secondary leading-none">({count})</span>
        </div>
    )
}

export default function StoreProductCard({ product }: { product: ProductType }) {
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const { openQuickview } = useModalQuickviewContext()
    const { wishlistState, addToWishlist, removeFromWishlist } = useWishlist()
    const wished = wishlistState.wishlistArray.some(item => item.id === product.id)
    const image = product.thumbImage?.[0] || product.images?.[0] || ''
    const soldOut = product.quantity === 0

    const add = () => {
        addToCart({ ...product })
        updateCart(product.id, 1, '', '')
        openModalCart()
    }

    return (
        <article className="group">
            <div className="relative h-[300px] rounded-xl bg-[#f4f4f5] overflow-hidden">
                <Link href={productPath(product)} className="absolute inset-0">
                    {image ? (
                        <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-secondary text-sm">No image</span>
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
                    <button
                        type="button"
                        aria-label="Quick view"
                        onClick={() => openQuickview(product)}
                        className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    >
                        <Eye size={14} className="text-black" />
                    </button>
                </div>
                {soldOut && <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[11px] text-center py-1">Out of stock</span>}
                <button
                    type="button"
                    disabled={soldOut}
                    onClick={add}
                    className="absolute inset-x-2 bottom-2 z-[1] h-9 rounded-full bg-black text-white text-xs font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 disabled:opacity-0"
                >
                    {soldOut ? 'Out of stock' : 'Add to Cart'}
                </button>
            </div>
            <div className="flex items-start justify-between gap-2 mt-2.5">
                <Link href={productPath(product)} className="text-[13px] font-medium leading-4 line-clamp-2">{product.name}</Link>
                <strong className="shrink-0 text-[13px] leading-4">{formatMoney(product.price)}</strong>
            </div>
            <p className="text-[12px] text-secondary mt-0.5 line-clamp-1 leading-tight">{product.category || 'Mixenza pick'}</p>
        </article>
    )
}
