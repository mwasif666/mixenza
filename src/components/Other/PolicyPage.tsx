import React from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { BRAND } from '@/constants/brand'

export type PolicySection = {
    title: string
    paragraphs?: string[]
    bullets?: string[]
}

type PolicyPageProps = {
    title: string
    intro: string
    sections: PolicySection[]
    updated?: string
}

const PolicyPage = ({ title, intro, sections, updated = '25 September 2026' }: PolicyPageProps) => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="Shop useful everyday finds across Pakistan" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading={title} subHeading={title} />
            </div>

            <main className="py-10 md:py-16">
                <div className="container">
                    <div className="mx-auto max-w-[920px]">
                        <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_16px_50px_rgba(31,31,31,0.05)] md:p-10">
                            <p className="text-button-uppercase text-primary">Mixenza customer information</p>
                            <h1 className="heading3 mt-2">{title}</h1>
                            <p className="body1 mt-4 leading-7 text-secondary">{intro}</p>
                            <p className="caption1 mt-3 text-secondary">Last updated: {updated}</p>

                            <div className="mt-8 space-y-8">
                                {sections.map((section) => (
                                    <section key={section.title}>
                                        <h2 className="heading5">{section.title}</h2>
                                        {section.paragraphs?.map((paragraph) => (
                                            <p key={paragraph} className="body1 mt-3 leading-7 text-secondary">{paragraph}</p>
                                        ))}
                                        {section.bullets && (
                                            <ul className="mt-3 list-disc space-y-2 pl-5 text-secondary">
                                                {section.bullets.map((item) => (
                                                    <li key={item} className="body1 leading-7">{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                            </div>

                            <div className="mt-10 rounded-2xl bg-surface p-5 md:p-6">
                                <h2 className="heading6">Need help?</h2>
                                <p className="caption1 mt-2 leading-6 text-secondary">
                                    Contact Mixenza before placing an order if you need clarification about a product, delivery, return or these terms.
                                </p>
                                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                                    <a className="caption1 font-medium hover:text-primary" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                                    <a className="caption1 font-medium hover:text-primary" href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a>
                                    <span className="caption1 text-secondary">{BRAND.address}</span>
                                </div>
                                <Link href="/pages/contact" className="mt-4 inline-block text-button font-medium text-primary hover:underline">Contact us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default PolicyPage
