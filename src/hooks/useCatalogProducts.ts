'use client'

import { useEffect, useState } from 'react'
import { loadCatalog, subscribeCatalogUpdates } from '@/lib/catalogClient'
import type { SourceProduct } from '@/lib/theOnlineStore'

export function useCatalogProducts(enabled = true) {
    const [products, setProducts] = useState<SourceProduct[]>([])
    useEffect(() => {
        if (!enabled) return
        let cancelled = false
        const refresh = () => {
            loadCatalog().then(catalog => {
                if (!cancelled) setProducts(catalog.products)
            }).catch(() => { if (!cancelled) setProducts([]) })
        }
        refresh()
        const unsubscribe = subscribeCatalogUpdates(refresh)
        return () => {
            cancelled = true
            unsubscribe()
        }
    }, [enabled])
    return products
}
