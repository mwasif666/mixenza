'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'

const heroProducts = [
  {
    id: '1971845697',
    image: '/images/pickora/steel-tumbler.png',
    alt: 'Mixenza insulated 40oz stainless steel tumbler with handle and straw',
    headline: 'Everyday Products',
    preHighlight: 'For a',
    highlight: 'Smarter Life',
    description: 'Discover practical, high-quality and trending items for your home, lifestyle and daily needs.',
  },
  {
    id: '1973702573',
    image: '/images/pickora/massage-gun.png',
    alt: 'Mixenza rechargeable body massage gun with attachments',
    headline: 'Thoughtful Essentials',
    preHighlight: 'For Everyday',
    highlight: 'Comfort',
    description: 'Useful, modern finds that make your daily routine simpler and more comfortable.',
  },
  {
    id: '1971400774',
    image: '/images/pickora/water-dispenser.png',
    alt: 'Mixenza automatic water dispenser',
    headline: 'Simple Solutions',
    preHighlight: 'For Better',
    highlight: 'Living',
    description: 'Make room for convenient home and lifestyle essentials chosen for everyday use.',
  },
]

const sideOffers = [
  {
    id: '1963263814',
    name: 'UV Money Detector Pen',
    description: 'Check & verify instantly',
    image: '/images/pickora/uv-money-detector.jpg',
    type: 'uv',
  },
  {
    id: '1966895078',
    name: '5-Speed Digital Hand Fan',
    description: 'Stay cool anywhere',
    image: '/images/pickora/digital-hand-fan.png',
    type: 'fan',
  },
]

export default function MixenzaHero() {
  const [active, setActive] = useState(0)
  const selected = heroProducts[active]
  const move = (direction: number) =>
    setActive(current => (current + direction + heroProducts.length) % heroProducts.length)

  return (
    <section className="mx-hero-section mx-fullwidth-hero mx-built-hero-section" aria-label="Mixenza featured products">
      <div className="mx-built-hero">
        <div className="mx-built-main">
          <div className="mx-built-ambient" aria-hidden="true" />
          <div className="mx-built-copy" key={selected.id}>
            <span className="mx-built-eyebrow">Mixenza Essentials</span>
            <h1>
              <span className="mx-built-headline">{selected.headline}</span>
              <span className="mx-built-headline">{selected.preHighlight} <em>{selected.highlight}</em></span>
            </h1>
            <p>{selected.description}</p>
            <Link href={'/product/' + selected.id} className="mx-built-shop">
              Shop Now <Icon.ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </div>
          <div className="mx-built-product-stage" key={selected.image}>
            <div className="mx-built-product-light" aria-hidden="true" />
            <div className="mx-built-product-pedestal" aria-hidden="true" />
            <Image
              src={selected.image}
              alt={selected.alt}
              fill
              priority={active === 0}
              sizes="(max-width: 600px) 88vw, (max-width: 900px) 60vw, 36vw"
              className="mx-built-product-image"
            />
          </div>
          <button type="button" className="mx-built-nav mx-built-nav-prev" onClick={() => move(-1)} aria-label="Previous featured product">
            <Icon.CaretLeft size={18} weight="bold" />
          </button>
          <button type="button" className="mx-built-nav mx-built-nav-next" onClick={() => move(1)} aria-label="Next featured product">
            <Icon.CaretRight size={18} weight="bold" />
          </button>
          <div className="mx-built-pagination" aria-label="Featured products carousel">
            {heroProducts.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === active ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={'Show featured product ' + (index + 1)}
                aria-current={index === active ? 'true' : undefined}
              />
            ))}
          </div>
        </div>

        <div className="mx-built-side" aria-label="More Mixenza essentials">
          {sideOffers.map(offer => (
            <Link href={'/product/' + offer.id} key={offer.id} className={'mx-built-offer mx-built-offer-' + offer.type}>
              <div className="mx-built-offer-text">
                <h2>{offer.name}</h2>
                <p>{offer.description}</p>
                <span className="mx-built-offer-arrow" aria-hidden="true"><Icon.ArrowRight size={18} weight="bold" /></span>
              </div>
              <div className="mx-built-offer-visual">
                <Image src={offer.image} alt="" fill sizes="(max-width: 600px) 50vw, 18vw" className="mx-built-offer-image" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
