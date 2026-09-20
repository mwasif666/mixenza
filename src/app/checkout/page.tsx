'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/context/CartContext'
import { formatMoney } from '@/utils/currency'

export default function Checkout() {
    const searchParams = useSearchParams()
    const { cartState } = useCart()
    const [payment, setPayment] = useState('cod')
    const [done, setDone] = useState(false)
    const subtotal = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = Number(searchParams.get('ship') || 0)
    const total = subtotal + shipping

    return (
        <>
            <section className="container py-10 md:py-16">
                <p className="caption1 text-secondary">Home / Checkout</p>
                <h1 className="heading3 mt-2">Checkout</h1>
                <form
                    className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8"
                    onSubmit={event => { event.preventDefault(); setDone(true) }}
                >
                    <div className="space-y-5">
                        <div className="rounded-3xl border border-line p-6">
                            <h2 className="heading6">Review items and shipping</h2>
                            {cartState.cartArray.map(product => (
                                <div key={product.id} className="flex items-center gap-4 mt-5">
                                    <div className="relative h-16 w-16 rounded-2xl bg-[#f4f4f5] overflow-hidden">
                                        {product.thumbImage?.[0] && <Image src={product.thumbImage[0]} alt="" fill unoptimized className="object-contain p-1.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium line-clamp-1">{product.name}</p>
                                        <p className="caption1 text-secondary">Qty {product.quantity}</p>
                                    </div>
                                    <strong>{formatMoney(product.price * product.quantity)}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-3xl border border-line p-6">
                            <h2 className="heading6">Delivery information</h2>
                            <div className="grid sm:grid-cols-2 gap-4 mt-5">
                                <input required placeholder="Full name *" className="border border-line rounded-xl px-4 py-3" />
                                <input required type="tel" placeholder="Phone *" className="border border-line rounded-xl px-4 py-3" />
                                <input required type="email" placeholder="Email *" className="border border-line rounded-xl px-4 py-3 sm:col-span-2" />
                                <input required placeholder="Address *" className="border border-line rounded-xl px-4 py-3 sm:col-span-2" />
                                <input required placeholder="City *" className="border border-line rounded-xl px-4 py-3" />
                                <input required placeholder="Postal code *" className="border border-line rounded-xl px-4 py-3" />
                            </div>
                        </div>
                    </div>
                    <aside className="h-fit rounded-3xl bg-[#f7f7f8] p-6">
                        <h2 className="heading6">Order summary</h2>
                        <div className="flex justify-between mt-5 text-sm"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                        <div className="flex justify-between mt-3 text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span></div>
                        <div className="flex justify-between mt-5 heading6"><span>Total</span><span>{formatMoney(total)}</span></div>
                        <div className="mt-6 space-y-3 text-sm">
                            {[['cod', 'Cash on delivery'], ['card', 'Credit or debit card']].map(([id, label]) => (
                                <label key={id} className="flex items-center gap-3">
                                    <input type="radio" name="pay" checked={payment === id} onChange={() => setPayment(id)} />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="button-main w-full mt-6">Place order</button>
                    </aside>
                </form>
            </section>
            {done && (
                <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-[32px] bg-white p-10 text-center shadow-2xl">
                        <div className="mx-auto h-16 w-16 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-3xl">✓</div>
                        <h2 className="heading5 mt-6">Your order has been accepted</h2>
                        <p className="caption1 text-secondary mt-2">We will confirm on WhatsApp shortly.</p>
                        <Link href="/shop" className="button-main inline-flex mt-6">Continue shopping</Link>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}
