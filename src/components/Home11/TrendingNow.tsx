'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'

export default function TrendingNow() {
    const products = useCatalogProducts()
    const categories = useMemo(() => {
        const result = new Map<string, { name: string; count: number; image: string }>()
        for (const product of products) {
            for (const name of product.categories) {
                const category = result.get(name)
                if (category) category.count++
                else result.set(name, { name, count: 1, image: product.thumbImage[0] || '' })
            }
        }
        return Array.from(result.values())
    }, [products])
    if (!categories.length) return null
    return <section className="trending-block style-six md:pt-20 pt-10">
        <div className="container">
            <h2 className="heading3 text-center">Shop by Category</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 md:mt-10 mt-6">
                {categories.map(category => <Link key={category.name}
                    href={`/shop/breadcrumb1?category=${encodeURIComponent(category.name)}`}
                    className="trending-item block shrink-0 w-40 md:w-48 text-center">
                    <div className="relative aspect-square rounded-full overflow-hidden bg-surface">
                        {category.image && <Image src={category.image} alt={category.name} fill sizes="192px" className="object-cover" />}
                    </div>
                    <div className="text-title mt-5">{category.name}</div>
                    <span className="text-secondary">({category.count})</span>
                </Link>)}
            </div>
        </div>
    </section>
}
