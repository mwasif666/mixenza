'use client'

import { useEffect } from 'react'

type Product = {
    id: string
    name: string
    price: number
    originPrice: number
    thumbImage?: string[]
    images?: string[]
    categories?: string[]
    quantity?: number
    new?: boolean
    sale?: boolean
}

type CatalogResponse = {
    products?: Product[]
    categories?: { name: string; slug: string; count: number }[]
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[char] || char))
}

function productMarkup(product: Product) {
    const image = product.thumbImage?.[0] || product.images?.[0]
    const price = Number(product.price || 0).toLocaleString('en-PK')
    const origin = Number(product.originPrice || 0).toLocaleString('en-PK')
    const sale = product.originPrice > product.price
    const salePercent = sale ? Math.round((1 - product.price / product.originPrice) * 100) : 0
    const href = `/product/default?id=${encodeURIComponent(product.id)}`

    return `<a href="${href}" class="block group min-w-0">
        <div class="relative aspect-square overflow-hidden rounded-xl bg-surface">
            ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />` : ''}
            ${sale ? `<span class="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white">-${salePercent}%</span>` : ''}
        </div>
        <div class="mt-2 min-w-0">
            <div class="truncate text-sm text-black">${escapeHtml(product.name)}</div>
            <div class="mt-1 flex items-center gap-2 text-sm">
                <strong>Rs. ${price}</strong>
                ${sale ? `<del class="text-secondary2">Rs. ${origin}</del>` : ''}
            </div>
        </div>
    </a>`
}

export default function DynamicMarketplaceMenu() {
    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                const response = await fetch('/api/catalog', { cache: 'no-store' })
                if (!response.ok) return
                const catalog: CatalogResponse = await response.json()
                if (cancelled) return

                const products = Array.isArray(catalog.products) ? catalog.products : []
                const categories = Array.isArray(catalog.categories) ? catalog.categories : []

                // Replace every legacy "Recent Products" block with live products.
                const recentProducts = products
                    .filter(product => product.quantity !== 0)
                    .slice(0, 2)

                document.querySelectorAll<HTMLElement>('.recent-product .list-product').forEach(list => {
                    if (recentProducts.length) {
                        list.innerHTML = recentProducts.map(productMarkup).join('')
                    }
                })

                // Replace the hard-coded department list with actual source categories.
                const departmentLinks = document.querySelectorAll<HTMLAnchorElement>('.menu-department-block .sub-menu-department > a')
                if (departmentLinks.length && categories.length) {
                    departmentLinks.forEach((link, index) => {
                        const category = categories[index]
                        if (!category) {
                            link.style.display = 'none'
                            return
                        }
                        link.style.display = ''
                        link.href = `/shop/breadcrumb1?category=${encodeURIComponent(category.name)}`
                        const name = link.querySelector('.name')
                        if (name) name.textContent = category.name
                    })
                }
            } catch {
                // Keep the existing menu as a graceful fallback when the source is unavailable.
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return null
}
