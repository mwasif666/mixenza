'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { formatMoney } from '@/utils/currency'

const offers = [
  {
    id: '1963263814',
    name: 'UV Money Detector Pen',
    body: 'Check & Verify Instantly',
    image: '/images/pickora/uv-money-detector.jpg',
  },
  {
    id: '1966895078',
    name: '5-Speed Digital Hand Fan',
    body: 'Stay Cool Anywhere',
    image: '/images/pickora/digital-hand-fan.png',
  },
]

export default function SliderPickora() {
  const products = useCatalogProducts()
  const currentPrice = (id: string) => {
    const item = products.find(product => product.sku === 'DARAZ-' + id)
    return item ? formatMoney(item.price) : ''
  }

  return (
    <section className="mx-hero-section mx-fullwidth-hero" aria-label="Mixenza everyday essentials">
      {/*
        Desktop: the exact 1667 × 476 visual approved by the client.
        Keep clickable areas separate from artwork to preserve real navigation.
        This is intentionally viewport-wide, not wrapped in .container.
      */}
      <div className="mx-approved-hero">
        <Image
          src="/images/mixenza/approved-hero-banner.png"
          alt="Mixenza everyday essentials: premium travel tumbler, UV money detector pen and portable hand fan"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="mx-approved-hero-image"
        />
        <Link href="/product/1971845697" className="mx-hero-hotspot mx-hero-hotspot-primary" aria-label="Shop Mixenza insulated tumbler" />
        <Link href="/product/1963263814" className="mx-hero-hotspot mx-hero-hotspot-uv" aria-label="Shop UV money detector pen" />
        <Link href="/product/1966895078" className="mx-hero-hotspot mx-hero-hotspot-fan" aria-label="Shop portable digital hand fan" />
      </div>

      {/* Mobile has its own readable composition instead of shrinking a wide banner. */}
      <div className="mx-approved-hero-mobile">
        <div className="mx-approved-mobile-feature">
          <span className="mx-approved-mobile-eyebrow">MIXENZA ESSENTIALS</span>
          <h1>Everyday Products<br />For a <span>Smarter Life</span></h1>
          <p>Discover practical, high-quality and trending items for your home, lifestyle and daily needs.</p>
          <Link href="/product/1971845697" className="mx-approved-mobile-button">
            Shop Now <Icon.ArrowRight size={16} weight="bold" />
          </Link>
          <div className="mx-approved-mobile-product">
            <Image src="/images/pickora/steel-tumbler.png" alt="Insulated travel tumbler" fill priority sizes="(max-width: 640px) 90vw, 50vw" className="object-contain" />
          </div>
        </div>
        <div className="mx-approved-mobile-offers">
          {offers.map(offer => (
            <Link key={offer.id} href={'/product/' + offer.id} className="mx-approved-mobile-offer">
              <div className="mx-approved-mobile-offer-copy">
                <h2>{offer.name}</h2>
                <p>{offer.body}</p>
                {currentPrice(offer.id) && <span className="mx-approved-mobile-price">{currentPrice(offer.id)}</span>}
                <span className="mx-approved-mobile-offer-cta" aria-hidden="true"><Icon.ArrowRight size={16} /></span>
              </div>
              <div className="mx-approved-mobile-offer-image">
                <Image src={offer.image} alt="" fill sizes="45vw" className="object-contain" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
