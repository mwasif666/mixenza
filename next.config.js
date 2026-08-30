/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Set NEXT_DIST_DIR to build into a separate folder, so running
    // `next build` never invalidates a running dev server's .next cache.
    distDir: process.env.NEXT_DIST_DIR || '.next',
}

module.exports = nextConfig
