'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { shopPath } from '@/lib/storePaths'

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
]

export default function MarketSearchStrip() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const onSearch = () => {
    const value = query.trim()
    if (value) router.push('/search-result?query=' + encodeURIComponent(value))
  }

  return (
    <section className="mx-mkt-search-strip" aria-label="Mixenza shopping search and benefits">
      <div className="mx-mkt-search-inner">
        <div className="mx-mkt-search-bar">
          <div className="mx-mkt-department-picker">
            <button type="button" aria-expanded={open} aria-controls="mx-mkt-departments" aria-label="Browse product categories" onClick={() => setOpen(v => !v)}>
              <span>All Categories</span><Icon.CaretDown size={13} weight="bold" aria-hidden="true" />
            </button>
            {open && <div id="mx-mkt-departments" className="mx-mkt-search-departments">
              {departments.map(item => <Link key={item.category} href={shopPath(item.category)} onClick={() => setOpen(false)}>{item.name}</Link>)}
              <Link href="/shop" onClick={() => setOpen(false)}>View all products</Link>
            </div>}
          </div>
          <form className="mx-mkt-search-form" onSubmit={event => {event.preventDefault(); onSearch()}}>
            <input value={query} onChange={event => setQuery(event.target.value)} type="search" aria-label="Search Mixenza products" placeholder="Search products..." />
            <button aria-label="Search" type="submit"><Icon.MagnifyingGlass size={21} weight="bold" /></button>
          </form>
        </div>
        <div className="mx-mkt-benefits">
          <span><Icon.Truck size={19} aria-hidden="true" /> Free Shipping Above Rs. 5,000</span>
          <span><Icon.ArrowCounterClockwise size={19} aria-hidden="true" /> Easy Returns Within 7 Days</span>
          <span><Icon.ShieldCheck size={19} aria-hidden="true" /> Secure Checkout</span>
        </div>
      </div>
    </section>
  )
}
