'use client'

/**
 * The site now has one global DynamicMarketplaceHeader in app/layout.tsx.
 * Keep this component as a compatibility no-op for existing GlobalProvider imports.
 * All department/shop/search data is rendered by the global header itself.
 */
export default function DynamicMarketplaceMenu() {
    return null
}
