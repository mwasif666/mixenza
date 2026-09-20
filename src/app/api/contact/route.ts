import { NextResponse } from 'next/server'
import { getApiUrl } from '@/config/site'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const name = String(body?.name || '').trim().slice(0, 120)
        const email = String(body?.email || '').trim().toLowerCase().slice(0, 254)
        const phone = String(body?.phone || '').trim().slice(0, 40)
        const subject = String(body?.subject || 'Storefront enquiry').trim().slice(0, 160)
        const message = String(body?.message || '').trim().slice(0, 5000)

        if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
            return NextResponse.json(
                { success: false, message: 'Please provide your name, a valid email, and a message of at least 10 characters.' },
                { status: 400 },
            )
        }

        if (body?.website) {
            return NextResponse.json({ success: true, message: 'Your message has been received.' })
        }

        const response = await fetch(`${getApiUrl()}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ name, email, phone, subject, message }),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        })
        const payload = await response.json().catch(() => null)

        return NextResponse.json(
            {
                success: response.ok && payload?.success !== false,
                message: payload?.message || (response.ok ? 'Your message has been received.' : 'Your message could not be sent.'),
            },
            { status: response.status },
        )
    } catch (error) {
        console.error('Contact submission failed', error)
        return NextResponse.json(
            { success: false, message: 'Contact service is temporarily unavailable. Please try again.' },
            { status: 503 },
        )
    }
}
