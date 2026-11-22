'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { formatMoney } from '@/utils/currency'
import { shopPath } from '@/lib/storePaths'

// These are real catalog SKUs. Product visuals come from existing GitHub images;
// the transparent copies are derived from those exact originals.
const slides = [
  {
    id: '1971845697',
    name: '40oz Insulated Tumbler',
    eyebrow: 'Mixenza Everyday Essentials',
    title: 'Everyday comfort,',
    subtitle: 'in every sip.',
    description: 'Practical drinkware for busy days, your desk and everyday adventures.',
    file: 'steel-tumbler',
    original: '/images/pickora/steel-tumbler.png',
  },
  {
    id: '1973702573',
    name: 'Rechargeable Massage Gun',
    eyebrow: 'Mixenza Personal Care',
    title: 'Small upgrades.',
    subtitle: 'More comfort.',
    description: 'Discover useful accessories designed for your everyday routine.',
    file: 'massage-gun',
    original: '/images/pickora/massage-gun.png',
  },
  {
    id: '1971400774',
    name: 'Automatic Water Dispenser',
    eyebrow: 'Mixenza Home Essentials',
    title: 'Refresh your space.',
    subtitle: 'Simplify your day.',
    description: 'Everyday home finds that make the little things more convenient.',
    file: 'water-dispenser',
    original: '/images/pickora/water-dispenser.png',
  },
]

type CutoutPhotoProps = {
  file: string
  original: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

function CutoutPhoto({ file, original, alt, sizes, priority = false, className = '' }: CutoutPhotoProps) {
  const [attempt, setAttempt] = useState(0)
  const source = attempt === 0 ? '/images/mixenza/cutouts/' + file + '.png' : original
  if (attempt >= 2) return <span className="mx-mkt-photo-fallback" aria-label={alt}>Mixenza</span>
  return <Image
    src={source}
    alt={alt}
    fill
    sizes={sizes}
    priority={priority}
    unoptimized
    onError={() => setAttempt(v => Math.min(v + 1, 2))}
    className={'mx-mkt-transparent-photo ' + className}
  />
}

const departments = [
  { name: 'Home & Cleaning', category: 'Home, Cleaning & Storage' },
  { name: 'Kitchen & Drinkware', category: 'Kitchen & Drinkware' },
  { name: 'Electronics & Gadgets', category: 'Electronics & Gadgets' },
  { name: 'Beauty & Personal Care', category: 'Beauty & Personal Care' },
  { name: 'Health & Wellness', category: 'Health, Fitness & Wellness' },
  { name: 'Lighting & Electronics', category: 'Lighting & Electronics' },
  { name: 'Baby & Kids', category: 'Baby & Kids' },
  { name: 'Fashion & Accessories', category: 'Accessories & Fashion' },
  { name: 'Tools & Automotive', category: 'Tools & Automotive' },
  { name: 'Home & Lifestyle', category: 'Home & Lifestyle' },
  { name: 'Office Accessories', category: 'Office Accessories' },
]

export default function SliderPickora() {
  const [active, setActive] = useState(0)
  const products = useCatalogProducts()
  const slide = slides[active]
  const priceFor = (id: string) => {
    const product = products.find(p => p.sku === 'DARAZ-' + id)
    return product ? formatMoney(product.price) : ''
  }
  const change = (delta: number) => setActive(index => (index + delta + slides.length) % slides.length)
  return (
    <section className="mx-mkt-stage" aria-label="Shop Mixenza featured collections">
      <div className="mx-mkt-market-grid">
        <aside className="mx-mkt-sidebar" aria-label="Shop by category">
          <div className="mx-mkt-sidebar-head"><Icon.SquaresFour size={18} weight="fill" aria-hidden="true" /> Explore Categories</div>
          <nav>
            {departments.map(dept => <Link key={dept.category} href={shopPath(dept.category)}>{dept.name}<Icon.CaretRight size={14} aria-hidden="true" /></Link>)}
          </nav>
          <Link href="/shop" className="mx-mkt-sidebar-all">Browse all products <Icon.ArrowRight size={15} /></Link>
        </aside>

        <div className="mx-mkt-center">
          <div className="mx-mkt-feature" aria-label="Main product promotion">
            <div className="mx-mkt-feature-shape" aria-hidden="true" />
            <div className="mx-mkt-feature-text" key={slide.id}>
              <span className="mx-mkt-kicker">{slide.eyebrow}</span>
              <h1>{slide.title}<br /><span>{slide.subtitle}</span></h1>
              <p>{slide.description}</p>
              {priceFor(slide.id) && <strong className="mx-mkt-feature-price">{priceFor(slide.id)}</strong>}
              <Link href={'/product/' + slide.id} className="mx-mkt-feature-cta">Shop now <Icon.ArrowRight size={16} weight="bold" /></Link>
            </div>
            <Link className="mx-mkt-feature-product" href={'/product/' + slide.id} aria-label={'Shop ' + slide.name}>
              <CutoutPhoto key={slide.file} file={slide.file} original={slide.original} alt={slide.name} priority={active === 0} sizes="(max-width: 700px) 55vw, (max-width: 1050px) 40vw, 32vw" />
            </Link>
            <div className="mx-mkt-feature-pagination">
              <button type="button" aria-label="Previous product" onClick={() => change(-1)}><Icon.CaretLeft size={15}/></button>
              <span>{active+1} / {slides.length}</span>
              <button type="button" aria-label="Next product" onClick={() => change(1)}><Icon.CaretRight size={15}/></button>
            </div>
          </div>

          <div className="mx-mkt-mini-grid">
            <Link href="/product/1973702573" className="mx-mkt-mini mx-mkt-mini-peach">
              <span className="mx-mkt-mini-copy"><span className="mx-mkt-mini-title">Rechargeable<br />Massage Gun</span><span className="mx-mkt-mini-price">{priceFor('1973702573') || 'Explore product'}</span><span className="mx-mkt-mini-link">Shop now <Icon.ArrowRight size={13} /></span></span>
              <span className="mx-mkt-mini-image"><CutoutPhoto file="massage-gun" original="/images/pickora/massage-gun.png" alt="Rechargeable massage gun" sizes="(max-width: 700px) 30vw, 16vw" /></span>
            </Link>
            <Link href="/product/1971400774" className="mx-mkt-mini mx-mkt-mini-grey">
              <span className="mx-mkt-mini-copy"><span className="mx-mkt-mini-title">Automatic Water<br />Dispenser</span><span className="mx-mkt-mini-price">{priceFor('1971400774') || 'Explore product'}</span><span className="mx-mkt-mini-link">Shop now <Icon.ArrowRight size={13} /></span></span>
              <span className="mx-mkt-mini-image"><CutoutPhoto file="water-dispenser" original="/images/pickora/water-dispenser.png" alt="Automatic water dispenser" sizes="(max-width: 700px) 30vw, 16vw" /></span>
            </Link>
          </div>
        </div>

        <div className="mx-mkt-right">
          <Link href="/product/1972612611" className="mx-mkt-vertical mx-mkt-vertical-light mx-mkt-vertical-k206">
            <div className="mx-mkt-vertical-copy"><span className="mx-mkt-vertical-kicker">Mixenza picks</span><h2>K-206 UV<br />Money Detector</h2><p>365/405 nm UV light. USB-C rechargeable.</p>{priceFor('1972612611') && <strong>{priceFor('1972612611')}</strong>}<span className="mx-mkt-vertical-button">Shop now <Icon.ArrowRight size={14}/></span></div>
            <div className="mx-mkt-vertical-product"><CutoutPhoto file="k-206" original="/images/mixenza/products/k-206/01.png" alt="K-206 Rechargeable UV Money Detector and retail packaging" sizes="(max-width: 700px) 48vw, 19vw"/></div>
          </Link>
          <Link href="/product/1966895078" className="mx-mkt-vertical mx-mkt-vertical-dark">
            <div className="mx-mkt-vertical-copy"><span className="mx-mkt-vertical-kicker">Everyday tech</span><h2>5-Speed<br />Digital Hand Fan</h2><p>Stay cool anywhere.</p>{priceFor('1966895078') && <strong>{priceFor('1966895078')}</strong>}<span className="mx-mkt-vertical-button">Shop now <Icon.ArrowRight size={14}/></span></div>
            <div className="mx-mkt-vertical-product"><CutoutPhoto file="digital-hand-fan" original="/images/pickora/digital-hand-fan.png" alt="Digital rechargeable hand fan" sizes="(max-width: 700px) 50vw, 19vw"/></div>
          </Link>
        </div>
      </div>
    </section>
  )
}
