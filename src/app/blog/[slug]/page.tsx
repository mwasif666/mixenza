import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import blogData from '@/data/Blog.json'
import { blogPath, slugify } from '@/lib/storePaths'
import { BRAND } from '@/constants/brand'
import type { Metadata } from 'next'

const reserved = new Set(['default', 'detail1', 'detail2', 'grid', 'list'])

function findPost(slug: string) {
    return blogData.find(post => post.slug === slug || post.id === slug || slugify(post.title) === slug)
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const post = findPost(params.slug)
    return { title: `${post?.title || 'Story'} | ${BRAND.name}`, description: post?.shortDesc }
}

export default function BlogSlugPage({ params }: { params: { slug: string } }) {
    if (reserved.has(params.slug)) notFound()
    const post = findPost(params.slug)
    if (!post) notFound()
    const more = blogData.filter(item => item.id !== post.id).slice(0, 3)
    return (
        <>
            <article className="container py-10 md:py-16 max-w-4xl">
                <p className="caption1 text-secondary"><Link href="/">Home</Link> / <Link href="/blog">News</Link> / {post.tag}</p>
                <h1 className="heading3 mt-4">{post.title}</h1>
                <p className="text-secondary mt-3">{post.date} · {post.author}</p>
                <div className="relative aspect-[16/8] rounded-3xl overflow-hidden bg-surface mt-8">
                    <Image src={post.coverImg || post.thumbImg} alt={post.title} fill className="object-cover" />
                </div>
                <p className="body1 mt-8 leading-8">{post.description}</p>
            </article>
            <section className="container pb-16">
                <h2 className="heading5 mb-6">More stories</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {more.map(item => (
                        <Link key={item.id} href={blogPath(item)} className="block">
                            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-surface">
                                <Image src={item.thumbImg} alt={item.title} fill className="object-cover" />
                            </div>
                            <h3 className="text-title mt-3">{item.title}</h3>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    )
}
