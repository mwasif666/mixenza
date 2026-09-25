import React from 'react'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import Logo from '@/components/Brand/Logo'
import NewsletterForm from '@/components/Newsletter/NewsletterForm'
import { BRAND } from '@/constants/brand'

const Footer = () => {
    const paymentMethods = [
        {
            name: 'Visa',
            src: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg',
            className: 'h-4 sm:h-5',
        },
        {
            name: 'Mastercard',
            src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
            className: 'h-6 sm:h-7',
        },
        {
            name: 'UnionPay',
            src: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg',
            className: 'h-6 sm:h-7',
        },
        {
            name: 'Easypaisa',
            src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Easypaisa_Digital_Bank_logo.png',
            className: 'h-5 sm:h-6',
        },
        {
            name: 'JazzCash',
            src: 'https://upload.wikimedia.org/wikipedia/commons/4/41/JazzCash_logo_%282025%29.png',
            className: 'h-7 sm:h-8',
        },
    ]

    return (
        <footer id="footer" className="footer bg-surface">
            <div className="container">
                <div className="grid gap-10 py-14 md:py-16 lg:grid-cols-[1.1fr_2fr_1.15fr] lg:gap-12">
                    <div>
                        <Logo variant="color" height={34} priority />
                        <p className="caption1 mt-4 max-w-[310px] leading-6 text-secondary">
                            Everyday essentials, useful gadgets and marketplace finds delivered across Pakistan.
                        </p>
                        <div className="mt-6 space-y-3">
                            <a href={`mailto:${BRAND.email}`} className="group flex w-fit items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm"><Icon.EnvelopeSimple size={18} /></span>
                                <span className="caption1 group-hover:text-primary">{BRAND.email}</span>
                            </a>
                            <a href={`tel:${BRAND.phoneHref}`} className="group flex w-fit items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm"><Icon.Phone size={18} /></span>
                                <span className="caption1 group-hover:text-primary">{BRAND.phone}</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm"><Icon.MapPin size={18} /></span>
                                <span className="caption1">{BRAND.address}</span>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        <div className="flex flex-col">
                            <div className="text-button-uppercase pb-4">Information</div>
                            <Link className="caption1 has-line-before w-fit duration-300" href="/pages/contact">Contact us</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/about">About us</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/my-account">My Account</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/order-tracking">Orders & Returns</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/faqs">FAQs</Link>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-button-uppercase pb-4">Quick Shop</div>
                            <Link className="caption1 has-line-before w-fit duration-300" href="/shop">Shop</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/shop">Full catalog</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/shop">New arrivals</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/faqs">Support</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/blog">Blog</Link>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-button-uppercase pb-4">Customer Care</div>
                            <Link className="caption1 has-line-before w-fit duration-300" href="/pages/faqs">Order FAQs</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/shipping-policy">Shipping Policy</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/privacy-policy">Privacy Policy</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/returns-refunds">Returns & Refunds</Link>
                            <Link className="caption1 has-line-before w-fit pt-2.5 duration-300" href="/pages/terms-conditions">Terms & Conditions</Link>
                        </div>
                    </nav>

                    <div>
                        <div className="text-button-uppercase">Newsletter</div>
                        <p className="caption1 mt-3 leading-6 text-secondary">Get new arrivals, useful buying guides and subscriber-only offers.</p>
                        <div className="mt-4"><NewsletterForm source="footer" /></div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-line py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="caption1 text-secondary">©{new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            <Link href="/pages/privacy-policy" className="text-xs text-secondary hover:text-black">Privacy</Link>
                            <Link href="/pages/returns-refunds" className="text-xs text-secondary hover:text-black">Returns & Refunds</Link>
                            <Link href="/pages/shipping-policy" className="text-xs text-secondary hover:text-black">Shipping</Link>
                            <Link href="/pages/terms-conditions" className="text-xs text-secondary hover:text-black">Terms</Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3" aria-label="Accepted payment methods">
                        <span className="caption1 mr-1 text-secondary">Accepted payments:</span>
                        {paymentMethods.map(method => (
                            <div
                                key={method.name}
                                className="flex h-[46px] min-w-[68px] items-center justify-center rounded-lg border border-line bg-white px-3 py-1.5 shadow-sm sm:min-w-[78px]"
                                title={method.name}
                            >
                                <img
                                    src={method.src}
                                    alt={method.name + ' accepted'}
                                    loading="lazy"
                                    className={method.className + ' max-w-[72px] object-contain'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
