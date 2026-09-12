'use client'

import React, { useEffect, useState } from 'react'
import MenFashion from './MenFashion'
import WomenFashion from './WomenFashion'
import { SourceProduct } from '@/lib/theOnlineStore'
import { loadCatalog } from '@/lib/catalogClient'

export default function LiveCatalog() {
    const [products, setProducts] = useState<SourceProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError('')
        loadCatalog()
            .then(payload => {
                if (!cancelled && Array.isArray(payload?.products)) setProducts(payload.products)
            })
            .catch(() => { if (!cancelled) setError('Products could not be loaded. Please try again.') })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [attempt])

    if (error) return <section className="container py-16" role="alert">
        <p>{error}</p>
        <button className="button-main mt-4" onClick={() => setAttempt(value => value + 1)}>Retry</button>
    </section>

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
