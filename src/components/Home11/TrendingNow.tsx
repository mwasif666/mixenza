'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { shopPath } from '@/lib/storePaths'

const colors = ['#f59e0b', '#f0627e', '#ef4444', '#22b95f', '#8055e8', '#32aee4', '#f97316', '#14a99d']

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
        return Array.from(result.values()).sort((a, b) => b.count - a.count).slice(0, 6)
    }, [products])
    if (!categories.length) return null
    return (
        <section className="md:pt-20 pt-10">
            <div className="container">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <h2 className="heading3">Shop our top categories</h2>
                    <Link href="/shop" className="text-button-uppercase underline underline-offset-4">All categories</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:mt-10 mt-6 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.name}
                            href={shopPath(category.name)}
                            className="group flex h-[230px] flex-col overflow-hidden rounded-[28px] border border-black/5 p-3 shadow-[0_10px_30px_rgba(31,31,31,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,31,31,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:h-[260px] sm:p-4 lg:h-[240px]"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        >
                            <div className="flex h-11 shrink-0 items-center justify-between gap-2 px-1 pb-2 text-white">
                                <h3 className="line-clamp-2 text-sm font-semibold leading-tight drop-shadow-sm sm:text-base">
                                    {category.name}
                                </h3>
                                <span className="shrink-0 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm sm:text-xs">
                                    {category.count}
                                </span>
                            </div>
                            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px]">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={`${category.name} category`}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 17vw"
                                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-secondary">
                                        Explore collection
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
