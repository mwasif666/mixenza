import type { Config } from 'tailwindcss'
import { BRAND_RGB } from './src/constants/brand'

/**
 * Brand tokens are declared ONCE in src/constants/brand.ts.
 * They are wired in twice, from that same source:
 *   - here, as Tailwind colour utilities (bg-primary, text-primary, ...)
 *   - in src/app/layout.tsx, as :root CSS variables for the .scss files
 * Because these resolve to `rgb(var(--x) / <alpha-value>)`, opacity
 * modifiers such as `bg-primary/10` keep working.
 */
const brandToken = (channels: string, variable: string) =>
  `rgb(var(${variable}, ${channels}) / <alpha-value>)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  mode: 'jit',
  jit: true,
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    container: {
      padding: {
        DEFAULT: '16px',
      },
    },
    colors: {
      transparent: 'transparent',

      /* ---- Brand palette (single source: src/constants/brand.ts) ---- */
      'primary': brandToken(BRAND_RGB.primary, '--primary-rgb'),
      'primary-dark': brandToken(BRAND_RGB.primaryDark, '--primary-dark-rgb'),
      'primary-light': brandToken(BRAND_RGB.primaryLight, '--primary-light-rgb'),
      'primary-tint': brandToken(BRAND_RGB.primaryTint, '--primary-tint-rgb'),
      'brand': brandToken(BRAND_RGB.brand, '--brand-rgb'),
      'brand-dark': brandToken(BRAND_RGB.brandDark, '--brand-dark-rgb'),
      'brand-soft': brandToken(BRAND_RGB.brandSoft, '--brand-soft-rgb'),

      /* ---- Neutrals & semantic colours ---- */
      // Legacy token name, kept so the template's 51 `bg-green` chips keep
      // working — now a pale orange from the same brand source.
      'green': brandToken(BRAND_RGB.primaryTint, '--primary-tint-rgb'),
      'black': '#1F1F1F',
      'secondary': '#696C70',
      'secondary2': '#A0A0A0',
      'white': '#ffffff',
      'surface': '#F7F7F7',
      'red': brandToken(BRAND_RGB.primary, '--primary-rgb'),
      'purple': '#8684D4',
      'success': '#3DAB25',
      'yellow': '#ECB018',
      'pink': '#F4407D',
      'line': '#E9E9E9',
      'outline': 'rgba(0, 0, 0, 0.15)',
      'surface2': 'rgba(255, 255, 255, 0.2)',
      'surface1': 'rgba(255, 255, 255, 0.1)',
    },
  },
  plugins: [],
}
export default config
