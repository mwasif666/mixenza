'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SourceProduct } from '@/lib/theOnlineStore'
import { shopPath } from '@/lib/storePaths'
import { formatMoney } from '@/utils/currency'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { getBulkMinimum } from '@/lib/bulkOrder'

export default function SourceProductDetail({ product }: { product: SourceProduct }) {
    const galleryImages = useMemo(() => Array.from(new Set([
        ...(product.images || []),
        ...(product.thumbImage || []),
    ].filter(Boolean))), [product.images, product.thumbImage])
    const descriptionSections = useMemo(() => {
        const raw = (product.description || '').trim()
        const sectionNames = 'Product overview|Where this product fits|Choosing the right version|Features and information to check|Using and looking after the item|Understanding the product gallery|Size, quantity and compatibility|Comparing value beyond the price|Ordering and after-delivery checks'
        const sections = raw.split(new RegExp('\\n\\n(?=(?:' + sectionNames + ')\\n)', 'g'))
        if (sections.length <= 1) return [{ heading: 'Product information', body: raw }]
        return sections.map(section => {
            const line = section.indexOf('\n')
            return line < 0 ? { heading: 'Product information', body: section }
                : { heading: section.slice(0, line), body: section.slice(line + 1).trim() }
        })
    }, [product.description])
    const descriptionSummary = (descriptionSections[0]?.body || '').split('\n\n')[0].trim()
    const [activeImage, setActiveImage] = useState(galleryImages[0] || '')
    const [failedImages, setFailedImages] = useState<string[]>([])
    // If the selected photo is unavailable, automatically open the next
    // working gallery entry rather than leaving the product's cover blank.
    useEffect(() => {
        if (activeImage && failedImages.includes(activeImage)) {
            const next = galleryImages.find(image => !failedImages.includes(image))
            if (next) setActiveImage(next)
        }
    }, [activeImage, failedImages, galleryImages])
    const [quantity, setQuantity] = useState(1)
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const salePercent = product.originPrice > product.price ? Math.round((1 - product.price / product.originPrice) * 100) : 0
    const category = product.categories[0] || 'Shop'
    const bulkMinimum = getBulkMinimum(product.name)
    const bulkOnly = bulkMinimum !== null

    const add = () => {
        if (bulkOnly || product.quantity === 0) return
        addToCart({ ...product, quantityPurchase: quantity })
        updateCart(product.id, quantity, '', '')
        openModalCart()
    }

    return (
        <main className="container py-10 md:py-16">
            <p className="caption1 text-secondary">
                <Link href="/" className="hover:text-black">Home</Link>
                <span className="mx-2">/</span>
                <Link href={shopPath(category)} className="hover:text-black">{category}</Link>
                <span className="mx-2">/</span>
                <span>{product.name}</span>
            </p>

            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-8">
                <div>
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#f4f4f5]">
                        {activeImage && !failedImages.includes(activeImage) ? (
                            <Image src={activeImage} alt={product.name} fill unoptimized priority
                                onError={() => setFailedImages(previous => [...previous, activeImage])}
                                sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-secondary">
                                Product image temporarily unavailable
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mt-4">
                        {galleryImages.map((image, index) => (
                            <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)} className={`relative aspect-square overflow-hidden rounded-2xl bg-[#f4f4f5] border transition ${activeImage === image ? 'border-black ring-2 ring-black/10' : 'border-transparent hover:border-black/30'}`}>
                                {!failedImages.includes(image) ? (
                                    <Image src={image} alt={`${product.name} image ${index + 1}`} fill unoptimized sizes="96px"
                                        onError={() => setFailedImages(previous => [...previous, image])} className="object-contain" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center p-1 text-[9px] text-secondary">Image unavailable</span>
                                )}
                            </button>
                        ))}
                    </div>
               </div>

                <div>
                    <h1 className="heading3">{product.name}</h1>
                    <p className="text-secondary mt-3">{descriptionSummary.slice(0, 230) || 'See product details and contact Mixenza with any questions before ordering.'}</p>
                    {bulkOnly && <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                        This is a supplier bulk/carton listing. {bulkMinimum && bulkMinimum > 1 ? `The supplier-listed minimum is ${bulkMinimum} pieces.` : ''}
                        {' '}The displayed price is a reference unit price, not a confirmed carton total. Please request a quote and stock confirmation before ordering.
                    </p>}
                    <div className="flex items-end gap-3 mt-6">
                        <span className="heading4">{formatMoney(product.price)}</span>
                        {product.originPrice > product.price && <del className="text-secondary">{formatMoney(product.originPrice)}</del>}
                        {salePercent > 0 && <span className="text-sm text-[#16a34a]">-{salePercent}%</span>}
                    </div>

                    {!bulkOnly && <div className="flex items-center gap-3 mt-8">
                        <div className="flex items-center rounded-full border border-line h-12">
                            <button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} className="w-12 h-12">−</button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(value => Math.min(product.quantity || 99, value + 1))} className="w-12 h-12">+</button>
                        </div>
                        {product.quantity > 0 && <span className="text-sm text-secondary">Available quantity: {product.quantity} (subject to confirmation)</span>}
                    </div>}

                    {bulkOnly ? (
                        <Link href="/pages/contact" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-white">Request bulk quote</Link>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3 mt-6">
                            <button type="button" onClick={add} disabled={product.quantity === 0} className="h-12 rounded-full bg-black text-white disabled:opacity-40">Buy Now</button>
                            <button type="button" onClick={add} disabled={product.quantity === 0} className="h-12 rounded-full border border-black disabled:opacity-40">Add to Cart</button>
                        </div>
                    )}

                    <div className="mt-8 space-y-4 text-sm">
                        <div className="flex gap-3"><span>🚚</span><div><strong>Delivery within Pakistan</strong><p className="text-secondary">Standard shipping is calculated at checkout. <Link href="/pages/shipping-policy" className="underline">Shipping policy</Link></p></div></div>
                        <div className="flex gap-3"><span>↩</span><div><strong>Return eligibility varies</strong><p className="text-secondary">Product condition and seller terms apply. <Link href="/pages/returns-refunds" className="underline">Returns policy</Link></p></div></div>
                    </div>
                </div>
            </div>

            <section className="mt-16" aria-labelledby="product-description-heading">
                <div className="mb-7 max-w-3xl">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#667194]">Product information</span>
                    <h2 id="product-description-heading" className="heading4 mt-2">Description &amp; Buying Guide</h2>
                    <p className="mt-3 text-sm leading-6 text-secondary">Product details, practical usage information and helpful points to check before ordering.</p>
                </div>
                <div className="grid max-w-5xl gap-5">
                    {descriptionSections.map((section, index) => (
                        <article key={section.heading + index} className="rounded-[24px] border border-line/70 bg-white px-6 py-6 shadow-[0_8px_28px_rgba(28,32,66,0.035)] md:px-8 md:py-7">
                            <div className="flex items-start gap-4">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f4ff] text-xs font-semibold tabular-nums text-[#485384]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold leading-snug text-black">{section.heading}</h3>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-secondary md:text-[15px]">{section.body || 'See product information above.'}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section className="mt-14">
                <h2 className="heading5">{product.name} specifications</h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <dl className="rounded-3xl bg-[#f7f7f8] divide-y divide-white">
                        {[['Brand', product.brand || 'Mixenza'], ['Category', category], ['SKU', product.sku || product.id], ['Availability', product.quantity === 0 ? 'Out of stock' : 'In stock']].map(([label, value]) => (
                            <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm"><dt className="text-secondary">{label}</dt><dd>{value}</dd></div>
                        ))}
                    </dl>
                    <dl className="rounded-3xl bg-[#f7f7f8] divide-y divide-white">
                        {[['Type', product.type || 'General'], ['Tags', product.tags.slice(0, 4).join(', ') || 'Everyday'], ['Price', formatMoney(product.price)], ['Stock', bulkOnly ? 'Confirm bulk availability' : String(product.quantity)]].map(([label, value]) => (
                            <div key={label} className="grid grid-cols-2 px-5 py-3 text-sm"><dt className="text-secondary">{label}</dt><dd>{value}</dd></div>
                        ))}
                    </dl>
                </div>
            </section>
        </main>
    )
}
