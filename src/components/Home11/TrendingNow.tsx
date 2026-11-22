import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { shopPath } from '@/lib/storePaths'

const categoryPromotions = [
  {
    title: 'Home Essentials',
    eyebrow: 'MIXENZA HOME',
    caption: 'Little upgrades for everyday living.',
    category: 'Home Essentials',
    image: '/images/mixenza/cutouts/water-dispenser.png',
    alt: 'Rechargeable automatic water dispenser',
    tone: 'home',
    photo: 'dispenser',
  },
  {
    title: 'Wellness & Recovery',
    eyebrow: 'MIXENZA WELLNESS',
    caption: 'Practical care for your daily routine.',
    category: 'Wellness',
    image: '/images/mixenza/cutouts/massage-gun.png',
    alt: 'Rechargeable massage gun and attachments',
    tone: 'wellness',
    photo: 'massage',
  },
  {
    title: 'Smart Everyday Tech',
    eyebrow: 'MIXENZA TECH',
    caption: 'Useful gadgets worth discovering.',
    category: 'Money Detectors',
    image: '/images/mixenza/cutouts/k-206.png',
    alt: 'K-206 rechargeable UV detection pen and box',
    tone: 'tech',
    photo: 'detector',
  },
]


export default function TrendingNow() {
  return (
    <section className="mx-editorial-categories" aria-labelledby="mx-categories-heading">
      <div className="mx-editorial-category-container">
        <div className="mx-editorial-category-header">
          <div>
            <span className="mx-editorial-category-eyebrow">EXPLORE MIXENZA</span>
            <h2 id="mx-categories-heading">Categories</h2>
          </div>
          <Link href="/shop" className="mx-editorial-all" aria-label="View all product categories">
            View all <Icon.ArrowUpRight size={17} weight="bold" aria-hidden="true" />
          </Link>
        </div>
        <div className="mx-editorial-category-grid">
          {categoryPromotions.map(category => (
            <Link
              key={category.category}
              href={shopPath(category.category)}
              className={'mx-editorial-category-card mx-editorial-category-' + category.tone}
              aria-label={'Shop ' + category.title}
            >
              <div className="mx-editorial-category-copy">
                <span className="mx-editorial-category-kicker">{category.eyebrow}</span>
                <h3>{category.title}</h3>
                <p>{category.caption}</p>
                <span className="mx-editorial-category-cta">
                  Shop now <Icon.ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
              <div className={'mx-editorial-category-art mx-editorial-category-art-' + category.photo}>
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 47vw, (max-width: 980px) 40vw, 24vw"
                  className="mx-editorial-category-image"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
