import type { SourceProduct, SourceCategory } from './theOnlineStore'

type Catalog = { products: SourceProduct[]; categories: SourceCategory[] }
let pending: Promise<Catalog> | undefined
let recent: { catalog: Catalog; expires: number } | undefined

// Header and homepage share the same in-flight request, including Strict Mode mounts.
export function loadCatalog(): Promise<Catalog> {
    if (recent && recent.expires > Date.now()) return Promise.resolve(recent.catalog)
    if (!pending) {
        pending = fetch('/api/catalog', { cache: 'no-store', signal: AbortSignal.timeout(35000) })
            .then(async response => {
                if (!response.ok) throw new Error('Products could not be loaded. Please try again.')
                return response.json() as Promise<Catalog>
            })
            .then(catalog => {
                recent = { catalog, expires: Date.now() + 5000 }
                return catalog
            })
            .finally(() => { pending = undefined })
    }
    return pending
}
