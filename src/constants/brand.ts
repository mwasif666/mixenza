/**
 * ============================================================
 *  MIXENZA — SINGLE SOURCE OF TRUTH FOR THE WHOLE THEME
 * ============================================================
 *  Change a value HERE and it propagates everywhere:
 *
 *   1. tailwind.config.ts  imports this file  -> bg-primary, text-primary, ...
 *   2. src/app/layout.tsx  injects :root vars -> var(--primary) in every .scss
 *   3. Components import BRAND directly       -> icon color props, logos, name
 *
 *  Never hardcode a brand colour or a logo path anywhere else.
 * ============================================================
 */

/** Raw "R G B" channel triples. Tailwind needs these for `/opacity` support. */
export const BRAND_RGB = {
    primary: '252 89 1', // #FC5901 - the orange from the logo mark
    primaryDark: '214 74 0', // #D64A00 - pressed / hover state
    primaryLight: '255 240 231', // #FFF0E7 - soft tint background
    primaryTint: '255 206 176', // #FFCEB0 - pale chip / badge fill, keeps black text legible
    brand: '48 49 54', // #303136 - the charcoal from the logo wordmark
    brandDark: '26 27 31', // #1A1B1F - deepest surface (top bar, footer)
    brandSoft: '71 73 80', // #474950 - lifted charcoal (borders on dark)
} as const

const hex = (rgb: string) =>
    '#' +
    rgb
        .split(' ')
        .map((n) => Number(n).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()

/** Hex strings — use these where JS needs a literal colour (e.g. Phosphor `color=`). */
export const BRAND_COLORS = {
    primary: hex(BRAND_RGB.primary),
    primaryDark: hex(BRAND_RGB.primaryDark),
    primaryLight: hex(BRAND_RGB.primaryLight),
    primaryTint: hex(BRAND_RGB.primaryTint),
    brand: hex(BRAND_RGB.brand),
    brandDark: hex(BRAND_RGB.brandDark),
    brandSoft: hex(BRAND_RGB.brandSoft),
} as const

/**
 * Logo assets in /public/images/logos.
 *
 * The `wordmark-*` files are the ones the site actually renders. They are
 * derived from the supplied originals: transparent padding trimmed off, so a
 * `height` prop means the height of the glyphs themselves. `wordmark-color`
 * (from main-logo.png) and `wordmark-light` (from main-light-logo.png) also
 * have the originals' baked-in black background keyed out — neither surface
 * they sit on is pure black (the footer is light grey, the header charcoal),
 * so the background had to go or it would show as a box.
 * The untouched originals are kept below for reference / re-export.
 */
export const BRAND_LOGOS = {
    /** Full-colour wordmark, transparent — the default. Works on light surfaces. */
    color: '/images/logos/wordmark-color.png',
    /** Charcoal wordmark, transparent — flat alternative for LIGHT surfaces. */
    dark: '/images/logos/wordmark-dark.png',
    /** White + orange wordmark, transparent — for DARK surfaces (the header). */
    light: '/images/logos/wordmark-light.png',

    /* --- untouched originals --- */
    originalMain: '/images/logos/main-logo.png',
    originalMainLight: '/images/logos/main-light-logo.png',
    originalDark: '/images/logos/dark-logo.png',
    originalLight: '/images/logos/light-logo.png',

    /** Square cart mark — favicon, app icon, compact spots. */
    icon: '/images/logos/favicon.png',
    /** Pre-scaled square marks used for the favicon / PWA icons. */
    icon32: '/images/logos/icon-32.png',
    icon192: '/images/logos/icon-192.png',
    icon512: '/images/logos/icon-512.png',
    appleIcon: '/images/logos/apple-icon.png',
} as const

/** Intrinsic pixel dimensions, so next/image never guesses the aspect ratio. */
export const BRAND_LOGO_SIZE = {
    color: { width: 1905, height: 387 },
    dark: { width: 2070, height: 441 },
    light: { width: 1985, height: 407 },
    icon: { width: 1254, height: 1254 }, // ratio 1:1
} as const

export const BRAND = {
    name: 'Mixenza',
    tagline: 'Your everyday marketplace',
    description: 'Mixenza — shop thousands of products from trusted sellers, all in one marketplace.',
    email: 'mixenza@gmail.com',
    phone: '+92 301 3769247',
    phoneHref: '+923013769247',
    address: 'B-13, 1st Floor, Umer Colony #1, Shahrah-e-Faisal, near Parsa Tower, Karachi, Pakistan',
    colors: BRAND_COLORS,
    rgb: BRAND_RGB,
    logos: BRAND_LOGOS,
    logoSize: BRAND_LOGO_SIZE,
} as const

/**
 * The `:root` custom-property block, generated from the values above.
 * Injected once by the root layout so every .scss file can read `var(--primary)`.
 */
export const brandCssVariables = `:root{
  --primary-rgb:${BRAND_RGB.primary};
  --primary-dark-rgb:${BRAND_RGB.primaryDark};
  --primary-light-rgb:${BRAND_RGB.primaryLight};
  --primary-tint-rgb:${BRAND_RGB.primaryTint};
  --brand-rgb:${BRAND_RGB.brand};
  --brand-dark-rgb:${BRAND_RGB.brandDark};
  --brand-soft-rgb:${BRAND_RGB.brandSoft};
  --primary:rgb(${BRAND_RGB.primary});
  --primary-dark:rgb(${BRAND_RGB.primaryDark});
  --primary-light:rgb(${BRAND_RGB.primaryLight});
  --primary-tint:rgb(${BRAND_RGB.primaryTint});
  --brand:rgb(${BRAND_RGB.brand});
  --brand-dark:rgb(${BRAND_RGB.brandDark});
  --brand-soft:rgb(${BRAND_RGB.brandSoft});
}`

export default BRAND
