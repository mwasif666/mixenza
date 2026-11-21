import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet Mixenza, a Pakistan-based online store for everyday essentials, gadgets and home products.',
}
const benefits = [
  { title: 'Practical everyday finds', copy: 'Explore useful home products, personal care, gadgets and accessories in one place.' },
  { title: 'Clear shopping information', copy: 'View product details and PKR prices before deciding what to buy.' },
  { title: 'Pakistan-wide delivery', copy: 'Delivery and availability vary by item, supplier and destination.' },
]
export default function AboutUs() {
  return (
    <>
      <main className="container py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-secondary"><Link href="/">Home</Link> / About us</nav>
        <section className="mt-8 rounded-3xl border border-line bg-surface p-7 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">About {BRAND.name}</p>
          <h1 className="heading2 mt-4">Everyday essentials. One convenient place.</h1>
          <p className="body1 mt-5 max-w-3xl leading-8 text-secondary">
            Mixenza is an online shopping destination for customers in Pakistan. We bring together useful
            household products, practical gadgets, drinkware, personal care items and accessories, with
            product prices shown in Pakistani Rupees.
          </p>
          <p className="body1 mt-4 max-w-3xl leading-8 text-secondary">
            Products may be supplied by different sellers and fulfillment partners. Availability and delivery
            times can vary, so an order may require stock confirmation before dispatch. We aim to make
            shopping straightforward with clear product details and responsive support.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="button-main inline-flex items-center justify-center">Browse products</Link>
            <Link href="/pages/contact" className="inline-flex items-center rounded-full border border-black px-7 py-3 font-semibold hover:bg-black hover:text-white">Contact Mixenza</Link>
          </div>
        </section>
        <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Why shop with Mixenza">
          {benefits.map(item => (
            <article key={item.title} className="rounded-2xl border border-line bg-white p-6">
              <h2 className="heading6">{item.title}</h2>
              <p className="mt-3 leading-7 text-secondary">{item.copy}</p>
            </article>
          ))}
        </section>
        <p className="mt-9 text-sm text-secondary">Questions? Email <a className="underline" href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or see our <Link href="/pages/shipping-policy" className="underline">shipping</Link> and <Link href="/pages/returns-refunds" className="underline">returns policies</Link>.</p>
      </main>
      <Footer />
    </>
  )
}
