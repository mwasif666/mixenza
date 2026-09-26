import type { SourceProduct, SourceCategory } from './theOnlineStore'
import { io, type Socket } from 'socket.io-client'
import { getSocketUrl } from '@/config/site'

type Catalog = { products: SourceProduct[]; categories: SourceCategory[] }
let pending: Promise<Catalog> | undefined
let recent: { catalog: Catalog; expires: number } | undefined
let realtimeSocket: Socket | undefined
const subscribers = new Set<() => void>()

const ensureRealtime = () => {
    if (typeof window === 'undefined' || realtimeSocket) return
    realtimeSocket = io(getSocketUrl(), {
        path: '/socket.io',
        transports: ['websocket'],
        withCredentials: true,
        timeout: 10000,
    })
    realtimeSocket.on('products:changed', () => {
        recent = undefined
        subscribers.forEach(listener => listener())
    })
}

export const subscribeCatalogUpdates = (listener: () => void) => {
    subscribers.add(listener)
    ensureRealtime()
    return () => { subscribers.delete(listener) }
}

// Header and homepage share the same in-flight request, including Strict Mode mounts.
export function loadCatalog(): Promise<Catalog> {
    ensureRealtime()
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
