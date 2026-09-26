import { NextResponse } from 'next/server'
import { getApiUrl } from '@/config/site'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
    try {
        const body = await request.text()
        const authorization = request.headers.get('authorization')
        const upstream = await fetch(`${getApiUrl()}/orders`, {
            method: 'POST',
            cache: 'no-store',
            signal: AbortSignal.timeout(30000),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(authorization ? { Authorization: authorization } : {}),
            },
            body,
        })
        const payload = await upstream.json().catch(() => ({
            success: false,
            message: 'The order service returned an invalid response.',
        }))
        return NextResponse.json(payload, {
            status: upstream.status,
            headers: { 'Cache-Control': 'no-store' },
        })
    } catch (error) {
        console.error('Order API failed', error)
        return NextResponse.json(
            { success: false, message: 'Order service is temporarily unavailable. Please try again.' },
            { status: 503, headers: { 'Cache-Control': 'no-store' } },
        )
    }
}
