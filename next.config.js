/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Set NEXT_DIST_DIR to build into a separate folder, so running
    // `next build` never invalidates a running dev server's .next cache.
    distDir: process.env.NEXT_DIST_DIR || '.next',
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
            // Temporary public media host for Memon Traders while Cloudinary is restricted.
            { protocol: 'https', hostname: 'admin.mixenza.com', pathname: '/**' },
            {
                protocol: 'https',
                hostname: 'theonlinestore.com.pk',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.shopify.com',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
