'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from '@phosphor-icons/react/dist/ssr'
import type { SourceProduct } from '@/lib/theOnlineStore'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { formatMoney } from '@/utils/currency'
import { productPath } from '@/lib/storePaths'
import { isBulkOnlyProduct } from '@/lib/bulkOrder'
import BulkInquiryModal from './BulkInquiryModal'

/** One consistent card for featured products, new arrivals and the Shop grid. */
export default function MixenzaCatalogCard({ product }: { product: SourceProduct }) {
  const { addToCart, updateCart } = useCart()
  const { openModalCart } = useModalCartContext()
  const [showEnquiry, setShowEnquiry] = useState(false)
  const photos = useMemo(
    () => Array.from(new Set([...(product.images || []), ...(product.thumbImage || [])].filter(Boolean))),
    [product.images, product.thumbImage],
  )
  const [photoIndex, setPhotoIndex] = useState(0)
  const galleryKey = photos.join('|')

  useEffect(() => setPhotoIndex(0), [product.id, galleryKey])

  const currentPrice = Number(product.price) || 0
  const originalPrice = Number(product.originPrice) || 0
  const discounted = currentPrice > 0 && originalPrice > currentPrice
  const bulkOnly = isBulkOnlyProduct(product.name)
  const inStock = Number(product.quantity) > 0
  const reviewCount = Number(product.ratingsCount || 0)
  const hasReviews = reviewCount > 0 && Number(product.rate) > 0
  const image = photos[photoIndex] || ''

  const add = () => {
    if (bulkOnly || !inStock) return
    addToCart({ ...product })
    updateCart(product.id, 1, '', '')
    openModalCart()
  }

  return (
    <article className="mx-v2-item">
      <div className="mx-v2-photo-shell">
        {discounted && <span className="mx-v2-saving">SAVE {formatMoney(originalPrice - currentPrice)}</span>}
        <Link className="mx-v2-photo-link" href={productPath(product)} aria-label={'View ' + product.name}>
          {image ? (
            <Image
              key={image}
              src={image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 48vw, (max-width: 1100px) 29vw, 18vw"
              className="mx-v2-product-image"
              onError={() => setPhotoIndex(index => Math.min(index + 1, photos.length))}
            />
          ) : <span className="mx-v2-photo-placeholder">Mixenza<br />Product photo unavailable</span>}
        </Link>
      </div>
      <div className="mx-v2-card-detail">
        <div className="mx-v2-review-slot">
          {hasReviews && <div className="mx-v2-review"><Star size={12} weight="fill" aria-hidden="true" /> {Number(product.rate).toFixed(1)} <span>({reviewCount})</span></div>}
        </div>
        <Link href={productPath(product)} className="mx-v2-product-title">{product.name}</Link>
        <div className="mx-v2-prices">
          <strong className={discounted ? 'mx-v2-sale-price' : ''}>{formatMoney(currentPrice)}</strong>
          {discounted && <del>{formatMoney(originalPrice)}</del>}
        </div>
        <div className="mx-v2-product-meta">
          {bulkOnly ? (
            <span className="mx-v2-stock is-available"><span className="mx-v2-stock-dot" aria-hidden="true" /> Stock on request</span>
          ) : (
            <span className={'mx-v2-stock ' + (inStock ? 'is-available' : 'is-unavailable')}>
              <span className="mx-v2-stock-dot" aria-hidden="true" />{inStock ? 'In stock' : 'Out of stock'}
            </span>
          )}
          {bulkOnly && <span className="mx-v2-bulk-note">Bulk quote required</span>}
        </div>
        <div className="mx-v2-thumbnails" aria-label={'Product gallery for ' + product.name}>
          {photos.length > 1 && photos.slice(0, 2).map((photo, index) => (
            <button key={photo} type="button" onClick={() => setPhotoIndex(index)}
              className={'mx-v2-thumb ' + (photoIndex === index ? 'is-active' : '')}
              aria-label={'View product image ' + (index + 1)}>
              <Image src={photo} alt="" fill unoptimized sizes="32px" className="object-contain" />
            </button>
          ))}
        </div>
        {bulkOnly ? (
          <button type="button" className="mx-v2-action mx-v2-action-bulk" onClick={() => setShowEnquiry(true)}>
            Bulk order <ArrowRight size={15} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="mx-v2-action" onClick={add} disabled={!inStock}>
            {inStock ? 'Add to cart' : 'Unavailable'} <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      {bulkOnly && (
        <BulkInquiryModal
          open={showEnquiry}
          onClose={() => setShowEnquiry(false)}
          productName={product.name}
          productSku={product.sku}
        />
      )}
    </article>
  )
}
