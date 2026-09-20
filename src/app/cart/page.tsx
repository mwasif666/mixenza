'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from '@phosphor-icons/react/dist/ssr'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/context/CartContext'
import { formatMoney } from '@/utils/currency'
import { productPath } from '@/lib/storePaths'

export default function Cart() {
    const { cartState, updateCart, removeFromCart } = useCart()
    const subtotal = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250
    const total = subtotal + shipping

    return (
        <>
            <section className="container py-10 md:py-16">
                <p className="caption1 text-secondary">Home / Cart</p>
                <h1 className="heading3 mt-2">Review items</h1>
                <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
                    <div className="rounded-3xl border border-line p-5 md:p-7">
                        {cartState.cartArray.length === 0 ? (
                            <p className="py-10 text-center text-secondary">Your cart is empty. <Link href="/shop" className="underline">Continue shopping</Link></p>
                        ) : cartState.cartArray.map(product => (
                            <div key={product.id} className="flex items-center gap-4 py-5 border-b border-line last:border-0">
                                <Link href={productPath(product)} className="relative h-20 w-20 shrink-0 rounded-2xl bg-[#f4f4f5] overflow-hidden">
                                    {product.thumbImage?.[0] && <Image src={product.thumbImage[0]} alt={product.name} fill unoptimized className="object-contain p-2" />}
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <Link href={productPath(product)} className="font-medium line-clamp-2">{product.name}</Link>
                                    <p className="caption1 text-secondary mt-1">{formatMoney(product.price)}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center rounded-full border border-line h-9">
                                            <button type="button" className="w-9" onClick={() => product.quantity > 1 && updateCart(product.id, product.quantity - 1, product.selectedSize, product.selectedColor)}><Minus size={14} /></button>
                                            <span className="w-6 text-center text-sm">{product.quantity}</span>
                                            <button type="button" className="w-9" onClick={() => updateCart(product.id, product.quantity + 1, product.selectedSize, product.selectedColor)}><Plus size={14} /></button>
                                        </div>
                                        <button type="button" onClick={() => removeFromCart(product.id)} className="text-secondary hover:text-black"><X size={18} /></button>
                                    </div>
                                </div>
                                <strong className="shrink-0">{formatMoney(product.price * product.quantity)}</strong>
                            </div>
                        ))}
                    </div>
                    <aside className="h-fit rounded-3xl bg-[#f7f7f8] p-6">
                        <h2 className="heading6">Order summary</h2>
                        <div className="flex justify-between mt-5 text-sm"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                        <div className="flex justify-between mt-3 text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span></div>
                        <div className="flex justify-between mt-5 heading6"><span>Total</span><span>{formatMoney(total)}</span></div>
                        <Link href={`/checkout?ship=${shipping}`} className="button-main w-full text-center mt-6 block">Checkout</Link>
                        <Link href="/shop" className="block text-center mt-4 text-sm underline">Continue shopping</Link>
                    </aside>
                </div>
            </section>
            <Footer />
        </>
    )
}
