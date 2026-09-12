'use client'

import { useEffect, useState } from 'react'
import { loadCatalog } from '@/lib/catalogClient'
import type { SourceProduct } from '@/lib/theOnlineStore'

export function useCatalogProducts(enabled = true) {
    const [products, setProducts] = useState<SourceProduct[]>([])
    useEffect(() => {
        if (!enabled) return
        let cancelled = false
        loadCatalog().then(catalog => {
            if (!cancelled) setProducts(catalog.products)
        }).catch(() => { if (!cancelled) setProducts([]) })
        return () => { cancelled = true }
    }, [enabled])
    return products
}
