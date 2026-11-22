'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import type { SourceProduct } from '@/lib/theOnlineStore'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { productPath } from '@/lib/storePaths'
import { formatMoney } from '@/utils/currency'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { isBulkOnlyProduct } from '@/lib/bulkOrder'
import StoreProductCard from '@/components/Shop/StoreProductCard'
import { PremiumLifestyleBanner } from './PremiumExtras'

type FeaturedTab = 'best' | 'new' | 'popular'
const tabs: Array<{ value: FeaturedTab; label: string }> = [
  { value: 'best', label: 'Best Seller' },
  { value: 'new', label: 'New In' },
  { value: 'popular', label: 'Popular' },
]

function FeaturedGridCard({ product }: { product: SourceProduct }) {
  const { addToCart, updateCart } = useCart()
  const { openModalCart } = useModalCartContext()
  const photos = Array.from(new Set([...(product.images || []), ...(product.thumbImage || [])].filter(Boolean)))
  const [photoIndex, setPhotoIndex] = useState(0)
  const galleryKey = photos.join('|')
  useEffect(() => setPhotoIndex(0), [product.id, galleryKey])

  const currentPrice = Number(product.price) || 0
  const originalPrice = Number(product.originPrice) || 0
  const discounted = currentPrice > 0 && originalPrice > currentPrice
  const saving = discounted ? originalPrice - currentPrice : 0
  const image = photos[photoIndex]
  const inStock = Number(product.quantity) > 0
  const bulkOnly = isBulkOnlyProduct(product.name)
  const reviewCount = Number(product.ratingsCount || 0)
  const hasReviews = reviewCount > 0 && Number(product.rate) > 0

  const add = () => {
    if (!inStock || bulkOnly) return
    addToCart({ ...product })
    updateCart(product.id, 1, '', '')
    openModalCart()
  }

  return (
    <article className="mx-v2-item">
      <div className="mx-v2-photo-shell">
        {discounted && <span className="mx-v2-saving">SAVE {formatMoney(saving)}</span>}
        <Link className="mx-v2-photo-link" href={productPath(product)} aria-label={'View ' + product.name}>
          {image
            ? <Image
                src={image}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 480px) 78vw, (max-width: 760px) 44vw, (max-width: 1100px) 29vw, 17vw"
                className="mx-v2-product-image"
                onError={() => setPhotoIndex(index => Math.min(index + 1, photos.length))}
              />
            : <span className="mx-v2-photo-placeholder">Mixenza<br />Photo temporarily unavailable</span>}
        </Link>
      </div>
      <div className="mx-v2-card-detail">
        {hasReviews && <div className="mx-v2-review"><Icon.Star size={12} weight="fill" aria-hidden="true" /> {Number(product.rate).toFixed(1)} <span>({reviewCount})</span></div>}
        <Link href={productPath(product)} className="mx-v2-product-title">{product.name}</Link>
        <div className="mx-v2-prices">
          <strong className={discounted ? 'mx-v2-sale-price' : ''}>{formatMoney(currentPrice)}</strong>
          {discounted && <del>{formatMoney(originalPrice)}</del>}
        </div>
        <div className="mx-v2-product-meta">
          <span className={'mx-v2-stock ' + (inStock ? 'is-available' : 'is-unavailable')}>
            <span className="mx-v2-stock-dot" aria-hidden="true" />
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
          {bulkOnly && <span className="mx-v2-bulk-note">Bulk quote required</span>}
        </div>
        {photos.length > 1 && (
          <div className="mx-v2-thumbnails" aria-label={'Additional images for ' + product.name}>
            {photos.slice(0, 2).map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setPhotoIndex(index)}
                className={'mx-v2-thumb ' + (photoIndex === index ? 'is-active' : '')}
                aria-label={'View product image ' + (index + 1)}
              >
                <Image src={photo} alt="" fill unoptimized sizes="32px" className="object-contain" />
              </button>
            ))}
          </div>
        )}
        {bulkOnly
          ? <Link className="mx-v2-action" href={productPath(product)}>View bulk details <Icon.ArrowRight size={13} /></Link>
          : <button className="mx-v2-action" type="button" onClick={add} disabled={!inStock}>
              {inStock ? 'Add to cart' : 'Unavailable'} <Icon.ArrowRight size={13} />
            </button>}
      </div>
    </article>
  )
}

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
              ? collections[activeTab].map(product => <FeaturedGridCard key={product.id} product={product} />)
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
            ? <div className="mx-arrival-grid">{arrivals.map(product => <StoreProductCard key={product.id} product={product} premium />)}</div>
            : <div className="mx-empty-products">New products are being loaded.</div>}
        </section>
      </div>
    </div>
  )
}
