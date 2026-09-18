import Image from 'next/image'
import Link from 'next/link'

const SliderPickora = () => (
    <section className="slider-block w-full">
        <div className="container banner-block lg:pt-[30px] pt-5 grid lg:grid-cols-3 gap-5">
            <Link href="/product/default?id=1971845697" className="group lg:col-span-2 min-h-[440px] md:min-h-[520px] rounded-[28px] overflow-hidden relative bg-gradient-to-br from-[#eef4ff] via-[#dce9ff] to-[#c8d9ff]">
                <div className="relative z-[2] w-[58%] md:w-1/2 h-full flex flex-col justify-center md:pl-14 pl-6 py-12">
                    <span className="text-button-uppercase text-[#395997]">Pickora everyday essential</span>
                    <h1 className="heading2 mt-3">Sip in style,<br />all day long.</h1>
                    <p className="body1 text-secondary mt-4 max-w-[420px]">40oz insulated stainless steel tumbler with handle, secure lid and reusable steel straw.</p>
                    <div className="flex items-center gap-3 mt-7 flex-wrap">
                        <span className="button-main">Shop Tumbler</span>
                        <span className="heading6">Rs. 2,699</span>
                    </div>
                </div>
                <div className="absolute right-[-8%] md:right-0 top-0 bottom-0 w-[58%] md:w-[55%] transition-transform duration-500 group-hover:scale-105">
                    <Image src="/images/pickora/steel-tumbler.png" alt="40oz insulated steel tumbler" fill priority sizes="(max-width: 1024px) 60vw, 40vw" className="object-contain object-right" />
                </div>
            </Link>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
                <Link href="/product/default?id=1963263814" className="group relative min-h-[250px] rounded-[24px] overflow-hidden bg-[#111647]">
                    <Image src="/images/pickora/uv-money-detector.jpg" alt="ERITE UV fake note checker pen" fill priority sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute left-5 right-5 bottom-5 text-white z-[1]">
                        <span className="caption1 font-semibold uppercase">70% off</span>
                        <h2 className="heading6 mt-1">UV Money Detector Pen</h2>
                        <span className="caption1 mt-1 inline-block">Shop now · Rs. 270</span>
                    </div>
                </Link>

                <Link href="/product/default?id=1966895078" className="group relative min-h-[250px] rounded-[24px] overflow-hidden bg-[#eaf9ff]">
                    <Image src="/images/pickora/digital-hand-fan.png" alt="Digital rechargeable hand fan" fill priority sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                    <div className="absolute left-5 right-5 bottom-5 text-white z-[1]">
                        <span className="caption1 font-semibold uppercase">Summer ready</span>
                        <h2 className="heading6 mt-1">5-Speed Digital Hand Fan</h2>
                        <span className="caption1 mt-1 inline-block">Shop now · Rs. 1,399</span>
                    </div>
                </Link>
            </div>
        </div>
    </section>
)

export default SliderPickora
