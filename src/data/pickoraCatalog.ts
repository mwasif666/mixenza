import type { SourceProduct } from '@/lib/theOnlineStore'

type PickoraSeed = {
    id: string
    name: string
    category: string
    price: number
    originPrice: number
    image: string
    description: string
    rate?: number
    sold?: number
    isNewArrival?: boolean
}

const seeds: PickoraSeed[] = [
    { id: '1971845697', name: '40oz Stainless Steel Insulated Tumbler', category: 'Drinkware', price: 2699, originPrice: 2999, image: '/images/pickora/steel-tumbler.png', description: 'Premium 1200ml double-wall stainless steel tumbler with secure lid, ergonomic handle and reusable steel straw.', isNewArrival: true },
    { id: '1963263814', name: 'ERITE 395nm UV Money Detector Pen', category: 'Money Detectors', price: 270, originPrice: 899, image: '/images/pickora/uv-money-detector.jpg', description: 'Portable 2-in-1 fake-note checker with a high-power UV light and marker test.', rate: 5, sold: 19 },
    { id: '1966895078', name: 'Digital 5-Speed Rechargeable Hand Fan with Display', category: 'Portable Fans', price: 1399, originPrice: 3000, image: '/images/pickora/digital-hand-fan.png', description: 'Compact 800mAh rechargeable fan with five speeds, digital display, Type-C charging and desktop base.', isNewArrival: true },
    { id: '1965017109', name: 'Portable USB Rechargeable Mini Hand Fan', category: 'Portable Fans', price: 1299, originPrice: 1599, image: '/images/pickora/digital-hand-fan.png', description: 'Lightweight rechargeable personal fan for travel, office, school and power outages.', rate: 5, sold: 11 },
    { id: '1973702573', name: '5-in-1 Rechargeable Full Body Massage Gun', category: 'Wellness', price: 1499, originPrice: 1999, image: '/images/pickora/massage-gun.png', description: 'Portable deep-tissue massage gun with four heads and six speed levels.', isNewArrival: true },
    { id: '1973011885', name: 'Keyboard Shortcut Desk Mat 80 x 30cm', category: 'Office Accessories', price: 799, originPrice: 999, image: '/images/pickora/shortcut-desk-mat.png', description: 'Extended non-slip desk mat printed with useful office and CAD shortcuts.', isNewArrival: true },
    { id: '1972612611', name: 'JC-205 Rechargeable 365nm UV Money Detector', category: 'Money Detectors', price: 550, originPrice: 999, image: '/images/pickora/rechargeable-uv-detector.png', description: 'Rechargeable handheld UV currency checker for compatible banknotes and documents.', isNewArrival: true },
    { id: '1971400774', name: 'Automatic Rechargeable Water Dispenser Pump', category: 'Home Essentials', price: 899, originPrice: 1499, image: '/images/pickora/water-dispenser.png', description: 'One-touch wireless water bottle pump with a 1200mAh rechargeable battery.', isNewArrival: true },
    { id: '1970697444', name: '2-in-1 Mist Spray Detangling Hair Brush', category: 'Hair Care', price: 1499, originPrice: 1999, image: '/images/pickora/mist-hair-brush.png', description: 'Anti-static detangling brush with a fine-mist nozzle and removable water tank.', isNewArrival: true },
]

export const pickoraFallbackProducts: SourceProduct[] = seeds.map(product => ({
    id: `daraz-${product.id}`,
    sourceId: product.id,
    sourceUrl: `/product/default?id=${product.id}`,
    sourceHandle: `pickora-${product.id}`,
    slug: `pickora-${product.id}`,
    sku: `DARAZ-${product.id}`,
    category: product.category,
    type: product.category,
    categories: [product.category],
    tags: ['Pickora.pk', 'Daraz'],
    name: product.name,
    gender: 'unisex',
    new: Boolean(product.isNewArrival),
    sale: product.price < product.originPrice,
    rate: product.rate || 0,
    price: product.price,
    originPrice: product.originPrice,
    brand: 'Pickora.pk',
    sold: product.sold || 0,
    quantity: 25,
    quantityPurchase: 1,
    sizes: [],
    variation: [],
    thumbImage: [product.image],
    images: [product.image],
    description: product.description,
    action: 'add to cart',
    stockStatus: 'instock',
    isFeatured: true,
    isNewArrival: Boolean(product.isNewArrival),
}))
