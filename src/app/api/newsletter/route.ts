import { NextResponse } from 'next/server'
import { getApiUrl } from '@/config/site'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const email = String(body?.email || '').trim().toLowerCase()
        const source = String(body?.source || 'storefront').trim().slice(0, 80)

        if (!EMAIL_PATTERN.test(email)) {
            return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 })
        }

        // Honeypot field: real visitors never fill this hidden input.
        if (body?.website) {
            return NextResponse.json({ success: true, message: 'Thanks for subscribing!' })
        }

        const response = await fetch(`${getApiUrl()}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, source }),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        })
        const payload = await response.json().catch(() => null)

        return NextResponse.json(
            {
                success: response.ok && payload?.success !== false,
                alreadySubscribed: Boolean(payload?.alreadySubscribed),
                message: payload?.message || (response.ok ? 'Thanks for subscribing!' : 'Subscription could not be completed.'),
            },
            { status: response.status },
        )
    } catch (error) {
        console.error('Newsletter subscription failed', error)
        return NextResponse.json(
            { success: false, message: 'Newsletter service is temporarily unavailable. Please try again.' },
            { status: 503 },
        )
    }
}
