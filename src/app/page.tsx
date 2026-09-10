import React from 'react'

export default function ComingSoon() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-5xl text-center">
                <div className="mx-auto mb-10 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold tracking-[0.28em] uppercase">
                    MIXENZA
                </div>
                <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.04] px-7 py-16 md:px-16 md:py-24 backdrop-blur-sm">
                    <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-white/60">Launching soon</p>
                    <h1 className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight">Something beautiful is coming.</h1>
                    <p className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-8 text-white/65">
                        We are putting the finishing touches on the Mixenza shopping experience. Our new fashion storefront is almost ready.
                    </p>
                    <a href="/homepages/fashion11" className="inline-flex mt-9 items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:scale-[1.02]">
                        Preview the Store
                    </a>
                </div>
            </div>
        </main>
    )
}
