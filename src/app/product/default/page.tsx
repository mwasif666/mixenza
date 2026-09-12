import { notFound } from 'next/navigation'
import SourceProductDetail from '@/components/TheOnlineStore/SourceProductDetail'
import Footer from '@/components/Footer/Footer'
import { getSourceProductById } from '@/lib/theOnlineStore'

export const dynamic = 'force-dynamic'

export default async function ProductDefault({ searchParams }: { searchParams: { id?: string } }) {
    if (!searchParams.id) notFound()
    const product = await getSourceProductById(searchParams.id.replace(/^source-/, ''))
    if (!product) notFound()
    return <><SourceProductDetail product={product} /><Footer /></>
}
