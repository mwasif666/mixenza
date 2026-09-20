export function slugify(value: string) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function productPath(product: { slug?: string; id?: string; sourceId?: string }) {
    return `/product/${encodeURIComponent(product.slug || product.sourceId || product.id || '')}`
}

export function shopPath(category?: string) {
    if (!category || category === 'All') return '/shop'
    return `/shop/${slugify(category)}`
}

export function blogPath(post: { slug?: string; id?: string; title?: string }) {
    return `/blog/${post.slug || slugify(post.title || '') || post.id}`
}
