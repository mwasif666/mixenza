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

const serverTimeLeft: CountdownTimeType = countdownTime();

const instrument = Instrument_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  // Needed so relative OG/social image paths resolve to absolute URLs.
  // Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
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
    // The original (black background) reads better as a social card than a
    // transparent PNG, which platforms composite unpredictably.
    images: [BRAND.logos.originalMain],
    type: 'website',
  },
}

export const viewport = {
  themeColor: BRAND.colors.brandDark,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalProvider>
      <html lang="en">
        <head>
          {/*
            The one and only place brand colours enter the CSS layer.
            Values come from src/constants/brand.ts — edit them there.
          */}
          <style
            id="brand-theme"
            dangerouslySetInnerHTML={{ __html: brandCssVariables }}
          />
        </head>
        <body className={instrument.className}>
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
