import Image from 'next/image'
import Link from 'next/link'

const offers = [
    { id: '1973702573', title: 'Rechargeable Massage Gun', subtitle: 'Recovery made easier', price: 'Rs. 1,499', image: '/images/pickora/massage-gun.png', color: 'bg-[#f5f0ff]' },
    { id: '1971400774', title: 'Automatic Water Pump', subtitle: 'One-touch convenience', price: 'Rs. 899', image: '/images/pickora/water-dispenser.png', color: 'bg-[#eff9f5]' },
    { id: '1970697444', title: 'Mist Spray Hair Brush', subtitle: 'Detangle and style', price: 'Rs. 1,499', image: '/images/pickora/mist-hair-brush.png', color: 'bg-[#fff1f5]' },
]

export default function ProductBanners() {
    return <section className="md:pt-20 pt-10">
        <div className="container grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {offers.map(offer => <Link key={offer.id} href={`/product/default?id=${offer.id}`} className={`group relative min-h-[260px] rounded-3xl overflow-hidden ${offer.color}`}>
                <div className="relative z-[1] p-7 w-[58%]">
                    <span className="text-button-uppercase text-secondary">{offer.subtitle}</span>
                    <h3 className="heading5 mt-2">{offer.title}</h3>
                    <p className="text-title mt-4">{offer.price}</p>
                    <span className="caption1 font-semibold inline-block border-b border-black mt-5">Shop now</span>
                </div>
                <div className="absolute right-[-8%] top-0 bottom-0 w-[58%] transition-transform duration-500 group-hover:scale-105">
                    <Image src={offer.image} alt={offer.title} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-contain" />
                </div>
            </Link>)}
        </div>
    </section>
}
