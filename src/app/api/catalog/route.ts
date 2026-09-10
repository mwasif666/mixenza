import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/theOnlineStore'

export const revalidate = 900

export async function GET() {
    try {
        const catalog = await getCatalog()
        return NextResponse.json(catalog, {
            headers: {
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
            },
        })
    } catch (error) {
        console.error('Catalog sync failed', error)
        return NextResponse.json(
            { error: 'Unable to load TheOnlineStore catalog' },
            { status: 502 },
        )
    }
}
