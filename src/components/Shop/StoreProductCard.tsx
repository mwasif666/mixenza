'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from '@phosphor-icons/react/dist/ssr'
import { formatMoney } from '@/utils/currency'
import { productPath } from '@/lib/storePaths'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import type { ProductType } from '@/type/ProductType'

export function StarRow({ rate = 5, count = 121 }: { rate?: number; count?: number }) {
    const stars = Math.max(1, Math.min(5, Math.round(Number(rate) || 5)))
    return (
        <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[#16a34a] text-[13px] tracking-tight">{'★'.repeat(stars)}</span>
            <span className="text-xs text-secondary">({count})</span>
        </div>
    )
}

export default function StoreProductCard({ product }: { product: ProductType }) {
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
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
            <div className="relative aspect-square rounded-2xl bg-[#f4f4f5] overflow-hidden">
                <Link href={productPath(product)} className="absolute inset-0">
                    {image ? (
                        <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-secondary">No image</span>
                    )}
                </Link>
                <button
                    type="button"
                    aria-label="Wishlist"
                    onClick={() => wished ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className="absolute top-3 right-3 z-[1] h-9 w-9 rounded-full bg-white shadow-sm flex items-center justify-center"
                >
                    <Heart size={18} weight={wished ? 'fill' : 'regular'} className={wished ? 'text-red' : 'text-black'} />
                </button>
                {soldOut && <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs text-center py-1.5">Out of stock</span>}
            </div>
            <div className="flex items-start justify-between gap-3 mt-4">
                <Link href={productPath(product)} className="text-[15px] font-medium leading-5 line-clamp-2">{product.name}</Link>
                <strong className="shrink-0 text-[15px]">{formatMoney(product.price)}</strong>
            </div>
            <p className="caption1 text-secondary mt-1 line-clamp-1">{product.category || 'Mixenza pick'}</p>
            <StarRow rate={product.rate} count={product.sold || 121} />
            <button
                type="button"
                disabled={soldOut}
                onClick={add}
                className="mt-4 w-full h-11 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white duration-200 disabled:opacity-40"
            >
                {soldOut ? 'Out of stock' : 'Add to Cart'}
            </button>
        </article>
    )
}
