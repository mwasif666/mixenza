import { redirect } from 'next/navigation'

export default function ShopBreadcrumbRedirect({ searchParams }: { searchParams: { category?: string; type?: string; gender?: string } }) {
    const category = searchParams.category || searchParams.type
    redirect(category ? `/shop/${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}` : '/shop')
}
