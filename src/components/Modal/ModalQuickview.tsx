'use client'

import { formatMoney } from '@/utils/currency'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import Rate from '../Other/Rate'
import ModalSizeguide from './ModalSizeguide'
import { productPath } from '@/lib/storePaths'
import { isBulkOnlyProduct } from '@/lib/bulkOrder'

const ModalQuickview = () => {
    const [openSizeGuide, setOpenSizeGuide] = useState(false)
    const { selectedProduct, closeQuickview } = useModalQuickviewContext()
    const [activeColor, setActiveColor] = useState('')
    const [activeSize, setActiveSize] = useState('')
    const { addToCart, updateCart } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()
    const percentSale = selectedProduct && Math.floor(100 - ((selectedProduct.price / selectedProduct.originPrice) * 100))
    const [quickQty, setQuickQty] = useState(1)
    const bulkOnly = isBulkOnlyProduct(selectedProduct?.name || '')
    useEffect(() => { setQuickQty(1) }, [selectedProduct?.id])

    const handleOpenSizeGuide = () => setOpenSizeGuide(true)
    const handleCloseSizeGuide = () => setOpenSizeGuide(false)
    const handleActiveColor = (item: string) => setActiveColor(item)
    const handleActiveSize = (item: string) => setActiveSize(item)

    const handleIncreaseQuantity = () => {
        setQuickQty(value => Math.min(Math.max(1, selectedProduct?.quantity || 1), value + 1))
    }

    const handleDecreaseQuantity = () => {
        setQuickQty(value => Math.max(1, value - 1))
    }

    const handleAddToCart = () => {
        if (!selectedProduct || selectedProduct.quantity <= 0 || bulkOnly) return
        addToCart({ ...selectedProduct, quantityPurchase: quickQty })
        updateCart(selectedProduct.id, quickQty, activeSize, activeColor)
        openModalCart()
        closeQuickview()
    }

    const handleAddToWishlist = () => {
        if (selectedProduct) {
            if (wishlistState.wishlistArray.some(item => item.id === selectedProduct.id)) {
                removeFromWishlist(selectedProduct.id)
            } else {
                addToWishlist(selectedProduct)
            }
        }
        openModalWishlist()
    }

    const handleShare = async () => {
        if (!selectedProduct || typeof window === 'undefined') return
        const url = `${window.location.origin}${productPath(selectedProduct)}`
        const payload = { title: selectedProduct.name, text: selectedProduct.name, url }
        try {
            if (navigator.share) {
                await navigator.share(payload)
                return
            }
            await navigator.clipboard.writeText(url)
        } catch {
            // user cancelled share — ignore
        }
    }

    const productMeta = selectedProduct as (typeof selectedProduct & {
        sku?: string
        categories?: string[]
        tags?: string[]
    }) | null
    const sku = productMeta?.sku || selectedProduct?.id || '—'
    const categories = [
        ...(productMeta?.categories || []),
        selectedProduct?.category,
        selectedProduct?.gender,
    ].filter(Boolean).filter((value, index, list) => list.indexOf(value) === index).join(', ') || 'Mixenza'
    const tags = (productMeta?.tags?.length
        ? productMeta.tags.slice(0, 4).join(', ')
        : selectedProduct?.type) || 'Everyday'

    return (
        <div className="modal-quickview-block" onClick={closeQuickview}>
            <div
                className={`modal-quickview-main py-6 ${selectedProduct !== null ? 'open' : ''}`}
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className="flex h-full max-md:flex-col-reverse gap-y-6">
                    <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
                        <div className="list-img max-md:flex items-center gap-4">
                            {(selectedProduct?.images?.length ? selectedProduct.images : selectedProduct?.thumbImage || []).map((item, index) => (
                                <div className="bg-img w-full aspect-[3/4] max-md:w-[150px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6" key={`${item}-${index}`}>
                                    <Image
                                        src={item}
                                        width={1500}
                                        height={2000}
                                        alt={selectedProduct?.name || 'Product'}
                                        priority={true}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right w-full px-4">
                        <div className="heading pb-6 px-4 flex items-center justify-between relative">
                            <div className="heading5">Quick View</div>
                            <div
                                className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeQuickview}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>
                        <div className="product-infor px-4">
                            <div className="flex justify-between">
                                <div>
                                    <div className="caption2 text-secondary font-semibold uppercase">{selectedProduct?.type || selectedProduct?.category}</div>
                                    <div className="heading4 mt-1">{selectedProduct?.name}</div>
                                </div>
                                <div
                                    className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === selectedProduct?.id) ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                >
                                    {wishlistState.wishlistArray.some(item => item.id === selectedProduct?.id) ? (
                                        <Icon.Heart size={20} weight="fill" className="text-red" />
                                    ) : (
                                        <Icon.Heart size={20} />
                                    )}
                                </div>
                            </div>
                            {!!selectedProduct?.rate && selectedProduct.rate > 0 && (
                                <div className="flex items-center mt-3">
                                    <Rate currentRate={selectedProduct.rate} size={14} />
                                </div>
                            )}
                            <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                                <div className="product-price heading5">{formatMoney(selectedProduct?.price)}</div>
                                {!!selectedProduct?.originPrice && selectedProduct.originPrice > (selectedProduct.price || 0) && (
                                    <>
                                        <div className="w-px h-4 bg-line" />
                                        <div className="product-origin-price font-normal text-secondary2"><del>{formatMoney(selectedProduct.originPrice)}</del></div>
                                        <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                                            -{percentSale}%
                                        </div>
                                    </>
                                )}
                                <div className="desc text-secondary mt-3">{selectedProduct?.description}</div>
                            </div>
                            <div className="list-action mt-6">
                                {!!selectedProduct?.variation?.length && (
                                    <div className="choose-color">
                                        <div className="text-title">Colors: <span className="text-title color">{activeColor}</span></div>
                                        <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                                            {selectedProduct.variation.map((item, index) => (
                                                <div
                                                    className={`color-item w-12 h-12 rounded-xl duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                                                    key={index}
                                                    datatype={item.image}
                                                    onClick={() => handleActiveColor(item.color)}
                                                >
                                                    <Image
                                                        src={item.colorImage}
                                                        width={100}
                                                        height={100}
                                                        alt="color"
                                                        className="rounded-xl"
                                                    />
                                                    <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                                        {item.color}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!!selectedProduct?.sizes?.length && (
                                    <div className="choose-size mt-5">
                                        <div className="heading flex items-center justify-between">
                                            <div className="text-title">Size: <span className="text-title size">{activeSize}</span></div>
                                            <div
                                                className="caption1 size-guide text-red underline cursor-pointer"
                                                onClick={handleOpenSizeGuide}
                                            >
                                                Size Guide
                                            </div>
                                            <ModalSizeguide data={selectedProduct} isOpen={openSizeGuide} onClose={handleCloseSizeGuide} />
                                        </div>
                                        <div className="list-size flex items-center gap-2 flex-wrap mt-3">
                                            {selectedProduct.sizes.map((item, index) => (
                                                <div
                                                    className={`size-item ${item === 'freesize' ? 'px-3 py-2' : 'w-12 h-12'} flex items-center justify-center text-button rounded-full bg-white border border-line ${activeSize === item ? 'active' : ''}`}
                                                    key={index}
                                                    onClick={() => handleActiveSize(item)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="text-title mt-5">Quantity:</div>
                                <div className="choose-quantity flex items-center max-xl:flex-wrap lg:justify-between gap-5 mt-3">
                                    <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                                        <Icon.Minus
                                            onClick={handleDecreaseQuantity}
                                            className={`${quickQty === 1 ? 'disabled' : ''} cursor-pointer body1`}
                                        />
                                        <div className="body1 font-semibold">{quickQty}</div>
                                        <Icon.Plus
                                            onClick={handleIncreaseQuantity}
                                            className="cursor-pointer body1"
                                        />
                                    </div>
                                    {bulkOnly ? (
                                        <Link href="/pages/contact" onClick={closeQuickview} className="button-main w-full text-center bg-white text-black border border-black">Request bulk quote</Link>
                                    ) : (
                                        <button type="button" disabled={!selectedProduct?.quantity} onClick={handleAddToCart}
                                            className="button-main w-full text-center bg-white text-black border border-black disabled:opacity-40">Add To Cart</button>
                                    )}
                                </div>
                                <div className="button-block mt-5">
                                    {!bulkOnly && <button type="button" disabled={!selectedProduct?.quantity} onClick={handleAddToCart}
                                        className="button-main w-full text-center cursor-pointer disabled:opacity-40">Buy It Now</button>}
                                </div>
                                <div className="more-infor mt-6">
                                    <div className="flex items-center flex-wrap gap-1">
                                        <Icon.Timer className="body1" />
                                        <span className="text-title">Delivery:</span>
                                        <Link href="/pages/shipping-policy" onClick={closeQuickview} className="text-secondary underline">Timing varies by supplier and location</Link>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="text-title">SKU:</div>
                                        <div className="text-secondary">{sku}</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="text-title">Categories:</div>
                                        <div className="text-secondary">{categories}</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="text-title">Tag:</div>
                                        <div className="text-secondary">{tags}</div>
                                    </div>
                                    <div className="share flex items-center gap-3 cursor-pointer mt-4" onClick={handleShare}>
                                        <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                            <Icon.ShareNetwork weight="fill" className="heading6" />
                                        </div>
                                        <span>Share Products</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalQuickview
