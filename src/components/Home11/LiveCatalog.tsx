'use client'

import React, { useEffect, useState } from 'react'
import MenFashion from './MenFashion'
import WomenFashion from './WomenFashion'
import { SourceProduct } from '@/lib/theOnlineStore'

export default function LiveCatalog() {
    const [products, setProducts] = useState<SourceProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        fetch('/api/catalog', { cache: 'no-store' })
            .then(response => response.json())
            .then(payload => {
                if (!cancelled && Array.isArray(payload?.products)) setProducts(payload.products)
            })
            .catch(error => console.error('Live catalog load failed', error))
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [])

    if (loading) {
        return (
            <section className="container py-16">
                <div className="heading3">Featured Collections</div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="aspect-[3/4] rounded-2xl bg-surface animate-pulse" />
                    ))}
                </div>
            </section>
        )
    }

    return (
        <>
            <MenFashion data={products} start={0} limit={8} />
            <WomenFashion data={products} start={8} limit={8} />
        </>
    )
}
