import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import '@/styles/styles.scss'
import GlobalProvider from './GlobalProvider'
import ModalCart from '@/components/Modal/ModalCart'
import ModalWishlist from '@/components/Modal/ModalWishlist'
import ModalSearch from '@/components/Modal/ModalSearch'
import ModalQuickview from '@/components/Modal/ModalQuickview'
import ModalCompare from '@/components/Modal/ModalCompare'
import CountdownTimeType from '@/type/CountdownType'
import { countdownTime } from '@/store/countdownTime'
import { BRAND, brandCssVariables } from '@/constants/brand'
import DynamicMarketplaceHeader from '@/components/Header/Menu/DynamicMarketplaceHeader'

const serverTimeLeft: CountdownTimeType = countdownTime();
const instrument = Instrument_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  icons: {
    icon: [
      { url: BRAND.logos.icon32, sizes: '32x32', type: 'image/png' },
      { url: BRAND.logos.icon192, sizes: '192x192', type: 'image/png' },
      { url: BRAND.logos.icon512, sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: BRAND.logos.appleIcon, sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    siteName: BRAND.name,
    images: [BRAND.logos.originalMain],
    type: 'website',
  },
}

export const viewport = { themeColor: BRAND.colors.brandDark }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <html lang="en">
        <head>
          <style id="brand-theme" dangerouslySetInnerHTML={{ __html: brandCssVariables }} />
          <style id="single-site-header" dangerouslySetInnerHTML={{ __html: `
            /* The root header is the only header shown on the client site. */
            body > .top-nav,
            body > .header-menu,
            body > #header > .header-menu,
            body > #header > .header-menu-main,
            body > #header .header-menu,
            body > #header .header-menu-main {
              display: none !important;
            }
            body > .site-global-marketplace-header ~ .top-nav,
            body > .site-global-marketplace-header ~ .header-menu,
            body > .site-global-marketplace-header ~ #header .header-menu,
            body > .site-global-marketplace-header ~ #header .header-menu-main {
              display: none !important;
            }
          ` }} />
        </head>
        <body className={instrument.className}>
          <DynamicMarketplaceHeader />
          {children}
          <ModalCart serverTimeLeft={serverTimeLeft} />
          <ModalWishlist />
          <ModalSearch />
          <ModalQuickview />
          <ModalCompare />
        </body>
      </html>
    </GlobalProvider>
  )
}
