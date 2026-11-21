'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { shopPath } from '@/lib/storePaths'

const orderedCategories = [
  { name: 'Home, Cleaning & Storage', short: 'Home & Cleaning', tone: 'sand', icon: Icon.House },
  { name: 'General Merchandise', short: 'General Merchandise', tone: 'rose', icon: Icon.Gift },
  { name: 'Kitchen & Drinkware', short: 'Kitchen & Dining', tone: 'stone', icon: Icon.CookingPot },
  { name: 'Beauty & Personal Care', short: 'Beauty & Personal Care', tone: 'pink', icon: Icon.Sparkle },
  { name: 'Health, Fitness & Wellness', short: 'Health, Fitness & Wellness', tone: 'purple', icon: Icon.Barbell },
  { name: 'Lighting & Electronics', short: 'Lighting & Electronics', tone: 'slate', icon: Icon.Lightning },
]

export default function TrendingNow() {
  const products = useCatalogProducts()
  const categories = useMemo(() => orderedCategories.map((item) => {
    const matching = products.filter(p => (p.categories || []).includes(item.name))
    const withPhoto = matching.find(p => (p.images || []).length || (p.thumbImage || []).length)
    return { ...item, image: withPhoto?.thumbImage?.[0] || withPhoto?.images?.[0] || '', count: matching.length }
  }).filter(item => item.count > 0), [products])

  return (
    <section className="mx-section mx-categories-section" aria-labelledby="mx-categories-heading">
      <div className="container">
        <div className="mx-section-head">
          <div><span className="mx-eyebrow">Explore our range</span><h2 id="mx-categories-heading">Shop by Category</h2></div>
          <Link className="mx-outline-link" href="/shop">View all categories <Icon.ArrowRight size={17} /></Link>
        </div>
        <div className="mx-category-grid">
          {(categories.length ? categories : orderedCategories.map(item => ({...item, image: '', count: 0}))).map((category) => (
            <Link key={category.name} href={shopPath(category.name)} className={'mx-category-card mx-category-' + category.tone}>
              {category.image && <Image src={category.image} alt="" fill unoptimized sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 16vw" className="mx-category-photo" />}
              <div className="mx-category-shade" />
              <category.icon size={23} weight="light" className="mx-category-symbol" aria-hidden="true" />
              <span className="mx-category-title">{category.short}</span>
              <span className="mx-category-arrow" aria-hidden="true"><Icon.ArrowUpRight size={18} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
