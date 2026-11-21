'use client'
import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import { BRAND } from '@/constants/brand'

const topics = [
  { title: 'Ordering', items: [
    ['How do I place an order?', 'Choose your product, add it to your cart and enter your delivery details at checkout. Some items may require stock confirmation before dispatch.'],
    ['Can I change or cancel an order?', 'Contact us with your order number as soon as possible. Changes or cancellation may be possible before dispatch.'],
    ['Are all listed products immediately available?', 'Availability may vary by seller and fulfillment partner. Bulk-carton listings require a separate quotation and confirmation.'],
  ] },
  { title: 'Payments', items: [
    ['How can I pay?', 'Cash on Delivery is currently available for eligible orders. Checkout shows the payment methods enabled at the time of purchase.'],
    ['Can I pay with a card or wallet?', 'Online payment options are not active yet. They will appear at checkout only after an approved payment integration goes live.'],
    ['Which currency does Mixenza use?', 'Prices are displayed in Pakistani Rupees (PKR). Your shipping cost appears in the order summary.'],
  ] },
  { title: 'Delivery', items: [
    ['Where do you deliver?', 'We serve destinations across Pakistan, subject to product availability and courier coverage.'],
    ['How much is standard shipping?', 'Standard shipping costs Rs. 250 on orders below Rs. 5,000 and is free from Rs. 5,000. Supplier-specific or bulk orders may require separate confirmation.'],
    ['How long does shipping take?', 'Delivery times depend on the product, fulfillment partner and destination. Estimates are not guaranteed dates.'],
  ] },
  { title: 'Returns & support', items: [
    ['What if a product is damaged or incorrect?', 'Contact Mixenza with your order number and clear photos or video. Keep the packaging while we review your request.'],
    ['Can I return an item?', 'Eligibility depends on item condition, product category and seller terms. Read our Returns & Refunds Policy before sending a parcel back.'],
    ['How can I contact you?', `Reach Mixenza at ${BRAND.email} or ${BRAND.phone}.`],
  ] },
]
export default function FaqsPage() {
  const [topic,setTopic] = useState(0)
  const [open,setOpen] = useState<number|null>(0)
  return <>
    <main className="container py-10 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-secondary"><Link href="/">Home</Link> / FAQs</nav>
      <h1 className="heading3 mt-4">Frequently asked questions</h1>
      <p className="mt-3 text-secondary">Helpful information about ordering, payment, shipping and support.</p>
      <div className="mt-9 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="FAQ topics" className="flex gap-2 overflow-x-auto lg:flex-col">
          {topics.map((item,i) => (
            <button key={item.title} type="button" aria-current={topic === i ? 'page' : undefined}
              onClick={() => {setTopic(i);setOpen(0)}}
              className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-semibold ${topic === i ? 'bg-black text-white' : 'bg-surface text-black hover:bg-primary-tint'}`}>
              {item.title}
            </button>
          ))}
        </nav>
        <section className="space-y-3" aria-label={topics[topic].title}>
          {topics[topic].items.map(([question,answer],i) => (
            <div key={question} className="overflow-hidden rounded-2xl border border-line bg-white">
              <h2><button type="button" aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-5 p-5 text-left font-semibold md:px-6">
                {question}<span aria-hidden="true" className="text-xl text-primary">{open === i ? '−' : '+'}</span>
              </button></h2>
              {open === i && <p className="px-5 pb-5 leading-7 text-secondary md:px-6">{answer}</p>}
            </div>
          ))}
        </section>
      </div>
      <p className="mt-9 text-sm text-secondary">See our <Link href="/pages/shipping-policy" className="underline">Shipping Policy</Link>, <Link href="/pages/returns-refunds" className="underline">Returns & Refunds</Link> or <Link href="/pages/contact" className="underline">contact support</Link>.</p>
    </main><Footer />
  </>
}
