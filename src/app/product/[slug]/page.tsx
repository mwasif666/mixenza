import { notFound } from 'next/navigation'
import SourceProductDetail from '@/components/TheOnlineStore/SourceProductDetail'
import Footer from '@/components/Footer/Footer'
import { getSourceProductById } from '@/lib/theOnlineStore'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await getSourceProductById(decodeURIComponent(params.slug))
    if (!product) return { title: `Product | ${BRAND.name}` }
    return { title: `${product.name} | ${BRAND.name}`, description: product.description?.slice(0, 160) || product.name }
}

export default async function ProductSlugPage({ params }: { params: { slug: string } }) {
    const product = await getSourceProductById(decodeURIComponent(params.slug))
    if (!product) notFound()
    return <><SourceProductDetail product={product} /><Footer /></>
}
