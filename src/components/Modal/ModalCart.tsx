'use client'

import { formatMoney } from '@/utils/currency'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { ProductType } from '@/type/ProductType';
import { useModalCartContext } from '@/context/ModalCartContext'
import { useCart } from '@/context/CartContext'
import { FREE_SHIPPING_THRESHOLD, calculateShipping } from '@/lib/shipping'
import { isBulkOnlyProduct } from '@/lib/bulkOrder'
import CountdownTimeType from '@/type/CountdownType';

const ModalCart = ({ serverTimeLeft: _serverTimeLeft }: { serverTimeLeft: CountdownTimeType }) => {
    const { isModalOpen, closeModalCart } = useModalCartContext();
    const productData = useCatalogProducts(isModalOpen)
    const { cartState, addToCart, removeFromCart, updateCart } = useCart()

    const handleAddToCart = (productItem: ProductType) => {
        if (isBulkOnlyProduct(productItem.name) || productItem.quantity === 0) return
        if (!cartState.cartArray.find(item => item.id === productItem.id)) {
            addToCart({ ...productItem });
            updateCart(productItem.id, productItem.quantityPurchase, '', '')
        } else {
            updateCart(productItem.id, productItem.quantityPurchase, '', '')
        }
    };

    const moneyForFreeship = FREE_SHIPPING_THRESHOLD
    const totalCart = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = calculateShipping(totalCart)

    return (
        <>
            <div className={`modal-cart-block`} onClick={closeModalCart}>
                <div
                    className={`modal-cart-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="left w-1/2 border-r border-line py-6 max-md:hidden">
                        <div className="heading5 px-6 pb-3">You May Also Like</div>
                        <div className="list px-6">
                            {productData.filter(item => !isBulkOnlyProduct(item.name) && item.quantity > 0).slice(0, 4).map((product) => (
                                <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                    <div className="infor flex items-center gap-5">
                                        <div className="bg-img">
                                            <Image
                                                src={product.images[0]}
                                                width={300}
                                                height={300}
                                                alt={product.name}
                                                className='w-[100px] aspect-square flex-shrink-0 rounded-lg'
                                            />
                                        </div>
                                        <div className=''>
                                            <div className="name text-button">{product.name}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="product-price text-title">{formatMoney(product.price)}</div>
                                                <div className="product-origin-price text-title text-secondary2"><del>{formatMoney(product.originPrice)}</del></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleAddToCart(product)
                                        }}
                                    >
                                        <Icon.Handbag />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right cart-block md:w-1/2 w-full py-6 relative overflow-hidden">
                        <div className="heading px-6 pb-3 flex items-center justify-between relative">
                            <div className="heading5">Shopping Cart</div>
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>
                        <div className="banner mt-3 px-6">
                            <p className="text-sm text-secondary">
                                {totalCart >= moneyForFreeship ? 'Free standard delivery unlocked' : `Add ${formatMoney(moneyForFreeship - totalCart)} more for free standard delivery`}
                            </p>
                            <div className="tow-bar-block mt-3">
                                <div className="progress-line" style={{ width: `${Math.min(100, (totalCart / moneyForFreeship) * 100)}%` }} />
                            </div>
                        </div>
                        <div className="list-product px-6">
                            {cartState.cartArray.map((product) => (
                                <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                    <div className="infor flex items-center gap-3 w-full">
                                        <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={product.images[0]}
                                                width={300}
                                                height={300}
                                                alt={product.name}
                                                className='w-full h-full'
                                            />
                                        </div>
                                        <div className='w-full'>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="name text-button">{product.name}</div>
                                                <div
                                                    className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer"
                                                    onClick={() => removeFromCart(product.id)}
                                                >
                                                    Remove
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-3 w-full">
                                                <div className="flex items-center text-secondary2 capitalize">
                                                    {product.selectedSize || product.sizes[0]}/{product.selectedColor || product.variation[0]?.color || ''}
                                                </div>
                                                <div className="product-price text-title">{formatMoney(product.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
                            <div className="flex items-center justify-between border-t border-line px-6 pt-5 text-sm">
                                <span>Standard shipping</span><span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span>
                            </div>
                            <div className="flex items-center justify-between px-6 pt-3">
                                <span className="heading5">Estimated total</span><span className="heading5">{formatMoney(totalCart + shipping)}</span>
                            </div>
                            <p className="px-6 pt-2 text-xs text-secondary">Add delivery instructions at checkout.</p>
                            <div className="flex gap-3 p-6">
                                <Link href="/cart" onClick={closeModalCart} className="button-main basis-1/2 border border-black bg-white text-center text-black">View cart</Link>
                                <Link href="/checkout" onClick={closeModalCart} className="button-main basis-1/2 text-center">Checkout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalCart
