'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { formatMoney } from '@/utils/currency'

const slides = [
  { id: '1971845697', eyebrow: 'Mixenza essentials', first: 'Everyday Essentials', second: 'for a Smarter Life.', body: 'Discover practical, well-chosen products that make your everyday routine feel effortless.', image: '/images/pickora/steel-tumbler.png', alt: '40oz insulated tumbler with handle' },
  { id: '1973702573', eyebrow: 'Everyday comfort', first: 'Little Upgrades.', second: 'Big Difference.', body: 'Useful finds for the home, your routine and everything in between.', image: '/images/pickora/massage-gun.png', alt: 'Rechargeable massage gun with accessories' },
  { id: '1971400774', eyebrow: 'Made for your routine', first: 'Thoughtful Finds', second: 'for Every Day.', body: 'From clever gadgets to simple home essentials, discover more with Mixenza.', image: '/images/pickora/water-dispenser.png', alt: 'Automatic water dispenser' },
]

const sideOffers = [
  { id: '1963263814', name: 'UV Money Detector Pen', body: 'A handy everyday essential', image: '/images/pickora/uv-money-detector.jpg', alt: 'UV money detector pen', tone: 'violet' },
  { id: '1966895078', name: '5-Speed Digital Hand Fan', body: 'Compact personal cooling', image: '/images/pickora/digital-hand-fan.png', alt: 'Digital rechargeable hand fan', tone: 'blue' },
]

export default function SliderPickora() {
  const [active, setActive] = useState(0)
  const products = useCatalogProducts()
  const currentPrice = (id: string) => {
    const value = products.find(item => item.sku === 'DARAZ-' + id)
    return value ? formatMoney(value.price) : ''
  }
  const slide = slides[active]
  const changeSlide = (direction: number) => setActive((value) => (value + direction + slides.length) % slides.length)

  return (
    <section className="mx-hero-section" aria-label="Featured Mixenza shopping offers">
      <div className="container mx-hero-grid">
        <div className="mx-hero-stage">
          <div className="mx-hero-light" aria-hidden="true" />
          <div className="mx-hero-copy" key={slide.id}>
            <span className="mx-eyebrow mx-eyebrow-light">{slide.eyebrow}</span>
            <h1>{slide.first}<br /><span>{slide.second}</span></h1>
            <p>{slide.body}</p>
            <Link className="mx-button mx-button-light" href={'/product/' + slide.id}>Shop now <Icon.ArrowRight size={17} weight="bold" /></Link>
          </div>
          <div className="mx-hero-art" key={slide.image}>
            <span className="mx-hero-pedestal" aria-hidden="true" />
            <Image src={slide.image} alt={slide.alt} fill priority sizes="(max-width: 767px) 90vw, (max-width: 1199px) 55vw, 42vw" className="mx-hero-product" />
          </div>
          <button type="button" className="mx-hero-arrow mx-hero-arrow-left" aria-label="Previous featured offer" onClick={() => changeSlide(-1)}><Icon.CaretLeft size={18} weight="bold" /></button>
          <button type="button" className="mx-hero-arrow mx-hero-arrow-right" aria-label="Next featured offer" onClick={() => changeSlide(1)}><Icon.CaretRight size={18} weight="bold" /></button>
          <div className="mx-hero-dots" aria-label="Choose featured offer">
            {slides.map((entry, index) => <button key={entry.id} type="button" onClick={() => setActive(index)} className={index === active ? 'active' : ''} aria-label={'Go to offer ' + (index + 1)} aria-current={index === active ? 'true' : undefined} />)}
          </div>
        </div>
        <div className="mx-hero-side">
          {sideOffers.map((offer) => (
            <Link key={offer.id} href={'/product/' + offer.id} className={'mx-side-offer mx-side-' + offer.tone}>
              <div className="mx-side-copy">
                <span className="mx-side-kicker">Mixenza finds</span>
                <h2>{offer.name}</h2>
                <p>{offer.body}</p>
                <div className="mx-side-meta">{currentPrice(offer.id) && <strong>{currentPrice(offer.id)}</strong>}<span className="mx-side-round" aria-hidden="true"><Icon.ArrowUpRight size={18}/></span></div>
              </div>
              <div className="mx-side-photo"><Image src={offer.image} alt={offer.alt} fill sizes="(max-width: 767px) 45vw, 18vw" className="object-contain" /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
