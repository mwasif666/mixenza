import SliderPickora from '@/components/Slider/SliderPickora'
import TrendingNow from '@/components/Home11/TrendingNow'
import LiveCatalog from '@/components/Home11/LiveCatalog'
import { PremiumServices, PremiumPromise } from '@/components/Home11/PremiumExtras'
import Newsletter from '@/components/Home10/Newsletter'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <main className="mixenza-premium-home">
      <SliderPickora />
      <PremiumServices />
      <TrendingNow />
      <LiveCatalog />
      <PremiumPromise />
      <Newsletter />
      <Footer />
    </main>
  )
}
