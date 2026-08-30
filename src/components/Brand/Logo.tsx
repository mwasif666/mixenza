import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BRAND } from '@/constants/brand'

type LogoVariant = 'color' | 'dark' | 'light'

interface LogoProps {
    /**
     * `color` — full-colour wordmark, for light surfaces (default).
     * `dark`  — flat charcoal wordmark, for light surfaces.
     * `light` — white wordmark, for DARK surfaces.
     */
    variant?: LogoVariant
    /** Rendered glyph height in px. The wordmark's aspect ratio is preserved. */
    height?: number
    /** Where the logo links to. Pass `null` to render the image without a link. */
    href?: string | null
    className?: string
    priority?: boolean
}

/**
 * The single logo component for the whole site — header, footer, mobile menu,
 * checkout. Swap the asset in src/constants/brand.ts and every instance follows.
 */
const Logo: React.FC<LogoProps> = ({
    variant = 'color',
    height = 36,
    href = '/',
    className = '',
    priority = false,
}) => {
    const src = BRAND.logos[variant]
    const size = BRAND.logoSize[variant]

    // Ask next/image for the size we actually paint, not the full-width source,
    // so the optimizer serves a small file instead of the original.
    const width = Math.round(height * (size.width / size.height))

    const image = (
        <Image
            src={src}
            width={width}
            height={height}
            alt={BRAND.name}
            priority={priority}
            style={{ height, width: 'auto' }}
            className="max-w-none object-contain"
        />
    )

    if (href === null) {
        return <span className={`logo inline-flex items-center ${className}`}>{image}</span>
    }

    return (
        <Link href={href} className={`logo inline-flex items-center ${className}`} aria-label={BRAND.name}>
            {image}
        </Link>
    )
}

export default Logo
