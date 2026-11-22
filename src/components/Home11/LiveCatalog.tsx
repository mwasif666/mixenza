'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import type { SourceProduct } from '@/lib/theOnlineStore'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { PremiumLifestyleBanner } from './PremiumExtras'
import MixenzaCatalogCard from '@/components/Shop/MixenzaCatalogCard'

type FeaturedTab = 'best' | 'new' | 'popular'
const tabs: Array<{ value: FeaturedTab; label: string }> = [
  { value: 'best', label: 'Best Seller' },
  { value: 'new', label: 'New In' },
  { value: 'popular', label: 'Popular' },
]

export default function LiveCatalog() {
  const [activeTab, setActiveTab] = useState<FeaturedTab>('best')
  const products = useCatalogProducts()

  const collections = useMemo(() => {
    const withPhotos = products.filter(product =>
      product.id && Number(product.price) > 0 &&
      ((product.images || []).length > 0 || (product.thumbImage || []).length > 0)
    )
    const byPriority = (a: SourceProduct, b: SourceProduct) =>
      Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
      Number(Boolean(b.isRecommended)) - Number(Boolean(a.isRecommended)) ||
      Number(b.ratingsCount || 0) - Number(a.ratingsCount || 0) ||
      a.name.localeCompare(b.name)
    const byNewest = (a: SourceProduct, b: SourceProduct) =>
      Date.parse(b.createdAt || '') - Date.parse(a.createdAt || '') || a.name.localeCompare(b.name)

    return {
      best: withPhotos.filter(p => p.isBestSeller).sort(byPriority).slice(0, 5),
      new: withPhotos.filter(p => p.isNewArrival).sort(byNewest).slice(0, 5),
      popular: withPhotos.filter(p => p.isRecommended || Number(p.ratingsCount || 0) > 0)
        .sort((a, b) =>
          Number(Boolean(b.isRecommended)) - Number(Boolean(a.isRecommended)) ||
          Number(b.ratingsCount || 0) - Number(a.ratingsCount || 0) ||
          Number(b.rate || 0) - Number(a.rate || 0) ||
          a.name.localeCompare(b.name)
        ).slice(0, 5),
    }
  }, [products])

  const arrivals = useMemo(() => {
    const filtered = products.filter(p => p.id && !/^DARAZ-/i.test(p.sku || ''))
    const marked = filtered.filter(p => p.isNewArrival)
    return (marked.length >= 6 ? marked : filtered).slice(0, 6)
  }, [products])

  return (
    <div className="mx-home-catalog">
      <section className="mx-featured-v2" aria-labelledby="mx-featured-v2-label">
        <div className="mx-featured-v2-inner">
          <div className="mx-featured-v2-head">
            <div className="mx-featured-v2-tabs" role="tablist" aria-label="Browse featured products">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  type="button"
                  id={'mx-featured-tab-' + tab.value}
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  aria-controls="mx-featured-v2-panel"
                  className={activeTab === tab.value ? 'is-active' : ''}
                  onClick={() => setActiveTab(tab.value)}
                >{tab.label}</button>
              ))}
            </div>
            <Link href="/shop" className="mx-featured-v2-viewall" id="mx-featured-v2-label">View all <Icon.ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
          <div
            className="mx-featured-v2-grid"
            role="tabpanel"
            id="mx-featured-v2-panel"
            aria-labelledby={'mx-featured-tab-' + activeTab}
          >
            {collections[activeTab].length > 0
              ? collections[activeTab].map(product => <MixenzaCatalogCard key={product.id} product={product} />)
              : <p className="mx-featured-v2-empty">Products for this selection are currently unavailable.</p>}
          </div>
        </div>
      </section>

      <div className="container">
        <PremiumLifestyleBanner />
        <section className="mx-section mx-new-arrivals" aria-labelledby="mx-new-heading">
          <div className="mx-section-head">
            <div><span className="mx-eyebrow">Just arrived</span><h2 id="mx-new-heading">New Arrivals</h2></div>
            <Link className="mx-outline-link" href="/shop">View all arrivals <Icon.ArrowRight size={17}/></Link>
          </div>
          {arrivals.length > 0
            ? <div className="mx-arrival-grid">{arrivals.map(product => <MixenzaCatalogCard key={product.id} product={product} />)}</div>
            : <div className="mx-empty-products">New products are being loaded.</div>}
        </section>
      </div>
    </div>
  )
}
