'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Product from '../Product/Product'
import { ProductType } from '@/type/ProductType'
import { motion } from 'framer-motion'

interface Props {
    data: Array<ProductType>;
    start: number;
    limit: number;
}

const MenFashion: React.FC<Props> = ({ data, start, limit }) => {
    const categories = useMemo(() => {
        const values = Array.from(new Set(data.map(product => product.type).filter(Boolean)))
        return values.slice(0, 5)
    }, [data])
    const [activeTab, setActiveTab] = useState<string>('all')

    const filteredProducts = useMemo(() => {
        if (activeTab === 'all') return data
        return data.filter(product => product.type === activeTab)
    }, [activeTab, data])

    const products = filteredProducts.slice(start, start + limit)

    return (
        <section className="tab-features-block md:pt-20 pt-10">
            <div className="container">
                <div className="heading flex items-center justify-between gap-5 flex-wrap">
                    <div>
                        <div className="heading3">Featured Products</div>
                        <p className="text-secondary mt-2">Fresh picks from the Pickora.pk Daraz store</p>
                    </div>
                    {categories.length > 0 && (
                        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl overflow-x-auto max-w-full">
                            <button type="button" onClick={() => setActiveTab('all')} className={`tab-item relative text-secondary py-2 px-5 whitespace-nowrap ${activeTab === 'all' ? 'text-black' : ''}`}>
                                {activeTab === 'all' && <motion.div layoutId="fashion-active-pill" className="absolute inset-0 rounded-2xl bg-white" />}
                                <span className="relative text-button-uppercase z-[1]">All</span>
                            </button>
                            {categories.map(type => (
                                <button type="button" key={type} onClick={() => setActiveTab(type)} className={`tab-item relative text-secondary py-2 px-5 whitespace-nowrap ${activeTab === type ? 'text-black' : ''}`}>
                                    {activeTab === type && <motion.div layoutId="fashion-active-pill" className="absolute inset-0 rounded-2xl bg-white" />}
                                    <span className="relative text-button-uppercase z-[1]">{type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="list-product grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[16px] md:mt-10 mt-6">
                    <Link href="/product/default?id=1971845697" className="banner rounded-[20px] overflow-hidden relative flex items-end min-h-[360px] bg-[#dfeaff]">
                        <Image src="/images/pickora/steel-tumbler.png" width={1000} height={1000} alt="40oz steel tumbler" className="absolute inset-0 w-full h-full object-cover duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[1]" />
                        <div className="heading5 text-white relative z-[2] p-6">The 40oz<br />Tumbler</div>
                    </Link>
                    {products.map((prd, index) => (
                        <Product key={`${prd.id}-${index}`} data={prd} type="grid" style="style-1" />
                    ))}
                </div>

                {!products.length && (
                    <div className="mt-8 rounded-2xl border border-line p-10 text-center">
                        <div className="heading5">Products are being loaded</div>
                        <p className="text-secondary mt-2">Please refresh in a moment while the catalog sync completes.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default MenFashion
