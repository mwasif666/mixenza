import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'

const serviceBenefits = [
  { icon: Icon.Truck, title: 'Nationwide Delivery', subtitle: 'Across Pakistan' },
  { icon: Icon.ShieldCheck, title: 'Secure Payments', subtitle: 'Checkout with confidence' },
  { icon: Icon.ArrowCounterClockwise, title: 'Easy Returns', subtitle: 'See our returns policy' },
  { icon: Icon.Headset, title: 'Dedicated Support', subtitle: "We are here to help" },
]

export function PremiumServices() {
  return (
    <div className="container mx-services-container">
      <div className="mx-service-strip">
        {serviceBenefits.map(item => <div className="mx-service" key={item.title}>
          <item.icon size={30} weight="light" aria-hidden="true" />
          <div><strong>{item.title}</strong><span>{item.subtitle}</span></div>
        </div>)}
      </div>
    </div>
  )
}

export function PremiumLifestyleBanner() {
  return (
    <section className="mx-lifestyle mx-lifestyle-v2" aria-labelledby="mx-lifestyle-v2-title">
      <div className="mx-lifestyle-v2-luminous" aria-hidden="true" />
      <div className="mx-lifestyle-v2-copy">
        <div className="mx-lifestyle-v2-eyebrow"><span className="mx-lifestyle-v2-dash" /> The Mixenza Edit <span className="mx-lifestyle-v2-number">01 / BEAUTY</span></div>
        <h2 id="mx-lifestyle-v2-title">Little Rituals.<br /><span>Better Days.</span></h2>
        <p>Discover the 2-in-1 Mist Spray Detangling Hair Brush. A fine-mist nozzle and removable 30ml water tank make everyday styling feel effortless.</p>
        <Link href="/product/1970697444" className="mx-lifestyle-v2-button">
          Explore the hair brush <Icon.ArrowUpRight size={18} weight="bold" aria-hidden="true" />
        </Link>
        <div className="mx-lifestyle-v2-details" aria-label="Product features">
          <span><Icon.Drop size={16} aria-hidden="true" /> Fine mist</span>
          <span><Icon.Sparkle size={16} aria-hidden="true" /> Easy detangling</span>
        </div>
      </div>
      <div className="mx-lifestyle-v2-scene">
        <div className="mx-lifestyle-v2-halo" aria-hidden="true" />
        <div className="mx-lifestyle-v2-pedestal" aria-hidden="true" />
        <div className="mx-lifestyle-v2-product">
          <Image
            src="/images/mixenza/cutouts/mist-hair-brush.png"
            alt="2-in-1 Mist Spray Detangling Hair Brush"
            fill
            unoptimized
            sizes="(max-width: 767px) 85vw, (max-width: 1199px) 47vw, 38vw"
            className="mx-lifestyle-v2-product-image"
          />
        </div>
        <span className="mx-lifestyle-v2-tag">2-IN-1 <Icon.ArrowUpRight size={14} aria-hidden="true" /></span>
        <div className="mx-lifestyle-v2-spec"><strong>30ML</strong><span>Refillable mist tank</span></div>
      </div>
    </section>
  )
}

export function PremiumPromise() {
  const items = [
    { icon: Icon.Diamond, title: 'Curated Selection', description: 'Everyday essentials worth discovering' },
    { icon: Icon.Star, title: 'Thoughtful Quality', description: 'Useful finds for daily life' },
    { icon: Icon.ShieldCheck, title: 'Trusted Shopping', description: 'Shop confidently at Mixenza' },
    { icon: Icon.ArrowCounterClockwise, title: 'Easy Returns', description: 'Review our return options' },
  ]
  return (
    <section className="container mx-promise-section" aria-label="Why shop at Mixenza">
      <div className="mx-promise-grid">
        {items.map(item => <div key={item.title} className="mx-promise-item"><item.icon size={27} weight="light" aria-hidden="true" /><div><strong>{item.title}</strong><span>{item.description}</span></div></div>)}
      </div>
    </section>
  )
}
