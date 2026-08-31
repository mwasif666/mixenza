/**
 * Runtime URLs for the storefront.
 *
 * Values come from .env.development (local) / .env.production (live domains),
 * both of which Next.js loads automatically. The fallbacks below keep the app
 * working if neither file is present.
 */
export const DEFAULT_SITE_URL = 'http://localhost:3000'
export const DEFAULT_API_URL = 'http://localhost:5000/api'

/** Public origin this storefront is served from, no trailing slash. */
export const getSiteUrl = () =>
    (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')

/** Backend API base, including the /api suffix, no trailing slash. */
export const getApiUrl = () =>
    (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '')

/** Build a full API URL: apiPath('/contact') -> https://backend.mixenza.com/api/contact */
export const apiPath = (endpoint: string) =>
    `${getApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
