import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SliderMarketplace = () => {
    return (
        <section className="slider-block style-marketplace w-full py-3 md:py-5">
            <div className="container">
                <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#171717] sm:min-h-[480px] lg:min-h-[540px]">
                    <Image src="/images/slider/marketplace.png" width={2400} height={1500} priority alt="Mixenza marketplace" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
                    <div className="relative z-[1] flex min-h-[420px] max-w-2xl flex-col justify-center px-7 py-12 sm:min-h-[480px] sm:px-12 lg:min-h-[540px] lg:px-16">
                        <span className="caption2 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-2 uppercase tracking-[0.2em] text-white backdrop-blur">MIXENZA MARKETPLACE</span>
                        <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">Your everyday essentials. Curated better.</h1>
                        <p className="mt-5 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Discover a growing collection of products, fresh arrivals and standout deals — all in one smooth shopping experience.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="#products" className="button-main bg-white text-black hover:bg-white/90">Shop Collection</Link>
                            <Link href="#deals" className="button-main border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">View Deals</Link>
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6 z-[1] hidden rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs uppercase tracking-widest text-white/70 backdrop-blur sm:block">New season · Live catalog</div>
                </div>
            </div>
        </section>
    )
}

export default SliderMarketplace
