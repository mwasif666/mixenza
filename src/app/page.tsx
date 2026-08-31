import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BRAND } from '@/constants/brand'
import NotifyForm from '@/components/ComingSoon/NotifyForm'

/**
 * Holding page served at `/` until launch.
 *
 * The finished storefront still lives at `/homepages/marketplace` — swapping
 * this file back to `export { default } from '@/app/homepages/marketplace/page'`
 * puts the shop live again.
 */
export const metadata: Metadata = {
    title: `${BRAND.name} — Coming Soon`,
    description: `${BRAND.name} is almost here. ${BRAND.description}`,
}

const socialLinks = [
    { href: 'https://www.facebook.com/', icon: 'icon-facebook', label: 'Facebook' },
    { href: 'https://www.instagram.com/', icon: 'icon-instagram', label: 'Instagram' },
    { href: 'https://www.youtube.com/', icon: 'icon-youtube', label: 'YouTube' },
    { href: 'https://www.twitter.com/', icon: 'icon-twitter', label: 'Twitter' },
]

export default function ComingSoonPage() {
    return (
        <main className='coming-soon relative w-full min-h-screen bg-brand-dark overflow-hidden'>
            {/* Soft brand glow behind the content — pure CSS, no asset to load. */}
            <div
                aria-hidden
                className='absolute inset-0 pointer-events-none'
                style={{
                    background:
                        'radial-gradient(60% 60% at 50% 30%, rgba(252,89,1,0.22) 0%, rgba(252,89,1,0) 70%)',
                }}
            />

            <div className='container relative z-[1] min-h-screen flex flex-col items-center justify-center text-center py-16'>
                <Link href={'/homepages/marketplace'} aria-label={BRAND.name}>
                    <Image
                        src={BRAND.logos.light}
                        width={BRAND.logoSize.light.width}
                        height={BRAND.logoSize.light.height}
                        alt={BRAND.name}
                        priority
                        className='h-9 sm:h-12 w-auto'
                    />
                </Link>

                <h1 className='text-white heading1 mt-10'>Coming Soon</h1>

                <p className='text-secondary2 body1 mt-4 max-w-[520px]'>
                    {BRAND.tagline}. We&apos;re putting the finishing touches on the
                    store. Leave your email and a message — we&apos;ll get back to you,
                    and let you know the day we open.
                </p>

                <NotifyForm />

                <div className='list-social flex items-center gap-6 justify-center mt-10'>
                    {socialLinks.map((item) => (
                        <Link
                            key={item.icon}
                            href={item.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={item.label}
                            className='text-white hover:text-primary duration-300'
                        >
                            <div className={`${item.icon} text-xl`}></div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
