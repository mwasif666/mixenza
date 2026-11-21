'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { formatMoney } from '@/utils/currency'

const offers = [
    { id: '1973702573', title: 'Rechargeable Massage Gun', subtitle: 'Recovery made easier', image: '/images/pickora/massage-gun.png', color: 'bg-[#f5f0ff]' },
    { id: '1971400774', title: 'Automatic Water Pump', subtitle: 'One-touch convenience', image: '/images/pickora/water-dispenser.png', color: 'bg-[#eff9f5]' },
    { id: '1970697444', title: 'Mist Spray Hair Brush', subtitle: 'Detangle and style', image: '/images/pickora/mist-hair-brush.png', color: 'bg-[#fff1f5]' },
]

export default function ProductBanners() {
    const products = useCatalogProducts()
    const currentPrice = (id: string) => {
        const product = products.find(item => item.sku === 'DARAZ-' + id)
        return product ? formatMoney(product.price) : null
    }
    return <section className="md:pt-20 pt-10">
        <div className="container">
            <h2 className="heading3">Featured Collections</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 md:mt-10 mt-6">
                {offers.map(offer => (
                    <Link key={offer.id} href={`/product/${offer.id}`} className={`group rounded-3xl overflow-hidden ${offer.color}`}>
                        <div className="relative aspect-square overflow-hidden">
                            <Image src={offer.image} alt={offer.title} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                        </div>
                        <div className="p-6 pt-2">
                            <span className="text-button-uppercase text-secondary">{offer.subtitle}</span>
                            <h3 className="heading5 mt-2">{offer.title}</h3>
                            {currentPrice(offer.id) && <p className="text-title mt-3">{currentPrice(offer.id)}</p>}
                            <span className="caption1 font-semibold inline-block border-b border-black mt-4">Shop now</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
}
