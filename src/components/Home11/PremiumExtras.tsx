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
    <section className="mx-lifestyle" aria-label="Mixenza lifestyle collection">
      <div className="mx-lifestyle-content">
        <span className="mx-eyebrow mx-eyebrow-light">Mixenza picks</span>
        <h2>Smart Living<br />Essentials</h2>
        <p>Practical, modern and everyday solutions for your home and lifestyle.</p>
        <Link href="/shop" className="mx-button mx-button-light">Explore collection <Icon.ArrowRight size={16} /></Link>
      </div>
      <div className="mx-lifestyle-display" aria-hidden="true">
        <div className="mx-lifestyle-arch" />
        <Image src="/images/pickora/water-dispenser.png" alt="" fill sizes="(max-width: 767px) 60vw, 38vw" className="object-contain" />
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
