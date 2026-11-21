'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, A11y } from 'swiper/modules'
import StoreProductCard from '@/components/Shop/StoreProductCard'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { PremiumLifestyleBanner } from './PremiumExtras'
import 'swiper/css'

export default function LiveCatalog() {
  const products = useCatalogProducts()
  const featured = useMemo(() => products.filter(p => p.id && /^DARAZ-/i.test(p.sku || '') && p.isFeatured).slice(0, 12), [products])
  const arrivals = useMemo(() => {
    const filtered = products.filter(p => p.id && !/^DARAZ-/i.test(p.sku || ''))
    const marked = filtered.filter(p => p.isNewArrival)
    return (marked.length >= 6 ? marked : filtered).slice(0, 6)
  }, [products])

  return (
    <div className="container mx-home-catalog">
      <section className="mx-section mx-featured" aria-labelledby="mx-featured-heading">
        <div className="mx-section-head">
          <div><span className="mx-eyebrow">Handpicked for you</span><h2 id="mx-featured-heading">Featured Products</h2></div>
          <div className="mx-featured-controls">
            <button className="mx-featured-prev" type="button" aria-label="Previous featured products"><Icon.ArrowLeft size={19} /></button>
            <button className="mx-featured-next" type="button" aria-label="Next featured products"><Icon.ArrowRight size={19} /></button>
          </div>
        </div>
        {featured.length > 0 ? (
          <Swiper modules={[Navigation,Autoplay,A11y]} navigation={{ prevEl: '.mx-featured-prev', nextEl: '.mx-featured-next' }}
            autoplay={{ delay: 4900, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={520} spaceBetween={15} slidesPerView={1.55} watchOverflow
            breakpoints={{ 480: { slidesPerView: 2.15 }, 700: { slidesPerView: 3.1 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
            className="mx-featured-swiper" aria-label="Featured Mixenza products carousel">
            {featured.map(product => <SwiperSlide key={product.id} className="!h-auto"><StoreProductCard product={product} premium /></SwiperSlide>)}
          </Swiper>
        ) : <div className="mx-empty-products">Featured products are being loaded.</div>}
      </section>
      <PremiumLifestyleBanner />
      <section className="mx-section mx-new-arrivals" aria-labelledby="mx-new-heading">
        <div className="mx-section-head">
          <div><span className="mx-eyebrow">Just arrived</span><h2 id="mx-new-heading">New Arrivals</h2></div>
          <Link className="mx-outline-link" href="/shop">View all arrivals <Icon.ArrowRight size={17}/></Link>
        </div>
        {arrivals.length > 0 ? (
          <div className="mx-arrival-grid">{arrivals.map(product => <StoreProductCard key={product.id} product={product} premium />)}</div>
        ) : <div className="mx-empty-products">New products are being loaded.</div>}
      </section>
    </div>
  )
}
