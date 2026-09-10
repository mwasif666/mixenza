import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/theOnlineStore'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET() {
    try {
        const catalog = await getCatalog()
        return NextResponse.json(catalog, {
            headers: {
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
            },
        })
    } catch (error) {
        console.error('Catalog API failed', error)
        return NextResponse.json(
            { success: false, products: [], categories: [], error: 'Catalog unavailable' },
            { status: 200, headers: { 'Cache-Control': 'no-store' } },
        )
    }
}
