import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer/Footer'
import blogData from '@/data/Blog.json'
import { blogPath } from '@/lib/storePaths'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: `News | ${BRAND.name}`,
    description: 'Today worldwide stories for Mixenza shoppers — gold, shipping, mobile prices and more.',
}

export default function BlogPage() {
    const posts = blogData.filter(post => post.id !== 'no-data')
    return (
        <>
            <section className="container py-10 md:py-16">
                <p className="caption1 text-secondary">Home / News</p>
                <h1 className="heading3 mt-2">Today worldwide stories</h1>
                <div className="grid md:grid-cols-3 gap-7 mt-10">
                    {posts.slice(0, 12).map(post => (
                        <Link key={post.id} href={blogPath(post)} className="group block">
                            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden bg-surface">
                                <Image src={post.thumbImg} alt={post.title} fill className="object-cover group-hover:scale-[1.03] duration-300" />
                            </div>
                            <span className="inline-block mt-5 text-[11px] uppercase tracking-wide bg-[#e8f36a] px-2.5 py-1 rounded-full">{post.tag}</span>
                            <h2 className="heading6 mt-3">{post.title}</h2>
                            <p className="caption1 text-secondary mt-2 line-clamp-2">{post.shortDesc}</p>
                            <p className="caption1 text-secondary mt-3">{post.date}</p>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    )
}
