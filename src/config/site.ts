/**
 * Runtime URLs for the storefront.
 *
 * Values come from .env.development (local) / .env.production (live domains),
 * both of which Next.js loads automatically. The fallbacks below keep the app
 * working if neither file is present.
 */
export const DEFAULT_SITE_URL = process.env.NODE_ENV === 'production' ? 'https://mixenza.com' : 'http://localhost:3000'
export const DEFAULT_API_URL = process.env.NODE_ENV === 'production' ? 'https://backend.mixenza.com/api' : 'http://localhost:5000/api'

const normalizeUrl = (configured: string | undefined, fallback: string) => {
    const value = (configured || fallback).trim().replace(/\/+$/, '')
    if (process.env.NODE_ENV === 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(value)) return fallback
    return value
}

/** Public origin this storefront is served from, no trailing slash. */
export const getSiteUrl = () =>
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL, DEFAULT_SITE_URL)

/** Backend API base, including the /api suffix, no trailing slash. */
export const getApiUrl = () =>
    normalizeUrl(process.env.NEXT_PUBLIC_API_URL, DEFAULT_API_URL)

/** Build a full API URL: apiPath('/contact') -> https://backend.mixenza.com/api/contact */
export const apiPath = (endpoint: string) =>
    `${getApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
