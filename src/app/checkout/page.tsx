'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import Footer from '@/components/Footer/Footer'
import { useCart } from '@/context/CartContext'
import { formatMoney } from '@/utils/currency'

const fieldClass =
    'h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-black outline-none transition placeholder:text-secondary2 focus:border-primary focus:ring-4 focus:ring-primary/10'

export default function Checkout() {
    const { cartState, isLoading, syncError, clearCart } = useCart()
    const [done, setDone] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [orderError, setOrderError] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const subtotal = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250
    const total = subtotal + shipping
    const itemCount = cartState.cartArray.reduce((sum, item) => sum + item.quantity, 0)

    const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (submitting || !cartState.cartArray.length) return
        setSubmitting(true)
        setOrderError('')
        const formData = new FormData(event.currentTarget)
        const fullName = String(formData.get('name') || '').trim()
        const phone = String(formData.get('phone') || '').trim()
        const email = String(formData.get('email') || '').trim()

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartState.cartArray.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor,
                    })),
                    shippingAddress: {
                        fullName,
                        phone,
                        email,
                        addressLine1: String(formData.get('address') || '').trim(),
                        city: String(formData.get('city') || '').trim(),
                        postalCode: String(formData.get('postalCode') || '').trim(),
                        country: 'Pakistan',
                    },
                    customer: { name: fullName, phone, email },
                    notes: String(formData.get('note') || '').trim(),
                    paymentMethod: 'COD',
                }),
            })
            const payload = await response.json() as {
                success?: boolean
                message?: string
                data?: { orderNumber?: string }
            }
            if (!response.ok || !payload.success) throw new Error(payload.message || 'Order could not be placed')
            setOrderNumber(payload.data?.orderNumber || '')
            setDone(true)
            clearCart()
        } catch (error) {
            setOrderError(error instanceof Error ? error.message : 'Order could not be placed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <main className="min-h-screen bg-gradient-to-b from-primary-tint/30 via-white to-white">
                <section className="container py-8 md:py-12 lg:py-16">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-secondary">
                        <Link href="/cart" className="transition hover:text-black">Cart</Link>
                        <Icon.CaretRight size={14} aria-hidden="true" />
                        <span className="font-medium text-black" aria-current="page">Checkout</span>
                    </nav>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Secure checkout</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-black md:text-4xl">Complete your order</h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary">
                            <Icon.LockKey size={18} weight="fill" className="text-success" aria-hidden="true" />
                            Your information is safe with us
                        </div>
                    </div>

                    {isLoading && cartState.cartArray.length === 0 ? (
                        <div className="mt-10 grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                            <div className="h-[520px] rounded-3xl bg-surface" />
                            <div className="h-[420px] rounded-3xl bg-surface" />
                        </div>
                    ) : cartState.cartArray.length === 0 ? (
                        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-[0_18px_60px_rgba(31,31,31,0.06)] md:p-12">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary">
                                <Icon.Handbag size={30} aria-hidden="true" />
                            </div>
                            <h2 className="mt-5 text-2xl font-semibold">Your cart is empty</h2>
                            <p className="mt-2 text-secondary">Add something you love before heading to checkout.</p>
                            <Link href="/shop" className="button-main mt-6 inline-flex items-center justify-center gap-2">
                                Continue shopping
                                <Icon.ArrowRight size={18} aria-hidden="true" />
                            </Link>
                        </div>
                    ) : (
                        <form
                            className="mt-8 grid items-start gap-6 pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:pb-0 xl:gap-8"
                            onSubmit={placeOrder}
                        >
                            <div className="space-y-6">
                                <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(31,31,31,0.04)] sm:p-7" aria-labelledby="delivery-heading">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">1</span>
                                        <div>
                                            <h2 id="delivery-heading" className="text-xl font-semibold">Delivery information</h2>
                                            <p className="mt-1 text-sm text-secondary">Enter the details we should use to deliver your parcel.</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium">Full name <span className="text-primary">*</span></span>
                                            <input name="name" autoComplete="name" required placeholder="e.g. Ali Khan" className={fieldClass} />
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium">Phone number <span className="text-primary">*</span></span>
                                            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="03XX XXXXXXX" className={fieldClass} />
                                        </label>
                                        <label className="block sm:col-span-2">
                                            <span className="mb-2 block text-sm font-medium">Email address <span className="text-primary">*</span></span>
                                            <input name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@example.com" className={fieldClass} />
                                        </label>
                                        <label className="block sm:col-span-2">
                                            <span className="mb-2 block text-sm font-medium">Complete address <span className="text-primary">*</span></span>
                                            <input name="address" autoComplete="street-address" required placeholder="House, street, area" className={fieldClass} />
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium">City <span className="text-primary">*</span></span>
                                            <input name="city" autoComplete="address-level2" required placeholder="Your city" className={fieldClass} />
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium">Postal code <span className="font-normal text-secondary">(optional)</span></span>
                                            <input name="postalCode" inputMode="numeric" autoComplete="postal-code" placeholder="e.g. 54000" className={fieldClass} />
                                        </label>
                                        <label className="block sm:col-span-2">
                                            <span className="mb-2 block text-sm font-medium">Order note <span className="font-normal text-secondary">(optional)</span></span>
                                            <textarea name="note" rows={3} placeholder="Landmark or delivery instructions" className={`${fieldClass} h-auto resize-none py-3`} />
                                        </label>
                                    </div>
                                </section>

                                <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(31,31,31,0.04)] sm:p-7" aria-labelledby="payment-heading">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">2</span>
                                        <div>
                                            <h2 id="payment-heading" className="text-xl font-semibold">Payment method</h2>
                                            <p className="mt-1 text-sm text-secondary">Online payments will be available soon.</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-primary bg-primary-tint/40 p-4 sm:p-5">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                                            <Icon.Money size={24} weight="duotone" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold">Cash on Delivery</p>
                                            <p className="mt-0.5 text-sm text-secondary">Pay in cash when your order arrives.</p>
                                        </div>
                                        <Icon.CheckCircle size={24} weight="fill" className="shrink-0 text-primary" aria-label="Selected" />
                                    </div>
                                </section>
                            </div>

                            <aside className="rounded-3xl border border-line bg-white p-5 shadow-[0_18px_60px_rgba(31,31,31,0.08)] sm:p-6 lg:sticky lg:top-28" aria-labelledby="summary-heading">
                                <div className="flex items-center justify-between">
                                    <h2 id="summary-heading" className="text-xl font-semibold">Order summary</h2>
                                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-secondary">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                                </div>

                                <div className="mt-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">
                                    {cartState.cartArray.map(product => (
                                        <div key={product.id} className="flex items-center gap-3">
                                            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface">
                                                {product.thumbImage?.[0] ? (
                                                    <Image src={product.thumbImage[0]} alt={product.name} fill sizes="72px" unoptimized className="object-contain p-1.5" />
                                                ) : (
                                                    <Icon.ImageSquare size={26} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary2" aria-hidden="true" />
                                                )}
                                                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">{product.quantity}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-sm font-medium leading-5">{product.name}</p>
                                                <p className="mt-1 text-xs text-secondary">Qty: {product.quantity}</p>
                                            </div>
                                            <strong className="shrink-0 text-sm">{formatMoney(product.price * product.quantity)}</strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-6 h-px bg-line" />
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between gap-4"><dt className="text-secondary">Subtotal</dt><dd className="font-medium">{formatMoney(subtotal)}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-secondary">Shipping</dt><dd className={shipping === 0 ? 'font-semibold text-success' : 'font-medium'}>{shipping === 0 ? 'Free' : formatMoney(shipping)}</dd></div>
                                </dl>
                                <div className="my-5 h-px bg-line" />
                                <div className="flex items-end justify-between gap-4">
                                    <span className="font-semibold">Total</span>
                                    <div className="text-right">
                                        <span className="block text-xs text-secondary">PKR</span>
                                        <strong className="text-2xl tracking-[-0.02em]">{formatMoney(total)}</strong>
                                    </div>
                                </div>

                                {orderError && <p className="mt-5 rounded-xl bg-red/10 px-4 py-3 text-sm text-red" role="alert">{orderError}</p>}
                                <button type="submit" disabled={submitting} className="button-main mt-6 hidden min-h-12 w-full items-center justify-center gap-2 !bg-primary !text-sm !text-white hover:!bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 lg:flex">
                                    {submitting ? 'Placing order…' : 'Place order'}
                                    <Icon.ArrowRight size={18} weight="bold" aria-hidden="true" />
                                </button>
                                <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-secondary">
                                    <Icon.ShieldCheck size={16} weight="fill" className="text-success" aria-hidden="true" />
                                    No advance payment required
                                </p>
                            </aside>
                            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 shadow-[0_-10px_30px_rgba(31,31,31,0.08)] backdrop-blur lg:hidden">
                                <button type="submit" disabled={submitting} className="button-main flex min-h-12 w-full items-center justify-center gap-2 !bg-primary !text-sm !text-white hover:!bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
                                    {submitting ? 'Placing order…' : `Place order · ${formatMoney(total)}`}
                                    <Icon.ArrowRight size={18} weight="bold" aria-hidden="true" />
                                </button>
                                {syncError && <p className="mt-1 text-center text-[11px] text-secondary">{syncError}</p>}
                            </div>
                        </form>
                    )}
                </section>
            </main>

            {done && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="success-title">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-2xl sm:p-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                            <Icon.CheckCircle size={38} weight="fill" aria-hidden="true" />
                        </div>
                        <h2 id="success-title" className="mt-5 text-2xl font-semibold">Order placed successfully</h2>
                        <p className="mt-2 leading-6 text-secondary">Thank you! We will contact you shortly to confirm your Cash on Delivery order.</p>
                        {orderNumber && <p className="mt-3 rounded-xl bg-surface px-4 py-3 text-sm">Order number: <strong>{orderNumber}</strong></p>}
                        <Link href="/shop" className="button-main mt-6 inline-flex w-full items-center justify-center gap-2">
                            Continue shopping
                            <Icon.ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}
