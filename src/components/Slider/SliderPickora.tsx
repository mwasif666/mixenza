import Image from 'next/image'
import Link from 'next/link'

const SliderPickora = () => (
    <section className="slider-block w-full">
        <div className="container banner-block lg:pt-[30px] pt-5 grid lg:grid-cols-3 gap-5">
            <Link href="/product/1971845697" className="group lg:col-span-2 rounded-[28px] overflow-hidden bg-[#e7edf7] grid md:grid-cols-2 items-stretch">
                <div className="relative z-[2] flex flex-col justify-center md:pl-14 px-6 py-10">
                    <span className="text-button-uppercase text-[#395997]">Pickora everyday essential</span>
                    <h1 className="heading2 mt-3">Sip in style,<br />all day long.</h1>
                    <p className="body1 text-secondary mt-4 max-w-[420px]">40oz insulated stainless steel tumbler with handle, secure lid and reusable steel straw.</p>
                    <div className="flex items-center gap-3 mt-7 flex-wrap">
                        <span className="button-main">Shop Tumbler</span>
                        <span className="heading6">Rs. 2,699</span>
                    </div>
                </div>
                <div className="relative m-4 aspect-square overflow-hidden rounded-[22px] bg-white/40 md:my-6 md:ml-0 md:mr-6 md:aspect-auto md:min-h-[472px]">
                    <Image src="/images/pickora/steel-tumbler.png" alt="40oz insulated steel tumbler" fill priority sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                </div>
            </Link>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
                <Link href="/product/1963263814" className="group grid grid-cols-2 min-h-[220px] rounded-[24px] overflow-hidden bg-[#111647]">
                    <div className="relative m-4 mr-0 overflow-hidden rounded-[18px] bg-white/5">
                        <Image src="/images/pickora/uv-money-detector.jpg" alt="ERITE UV fake note checker pen" fill priority sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center p-5 text-white">
                        <span className="caption1 font-semibold uppercase">70% off</span>
                        <h2 className="heading6 mt-1">UV Money Detector Pen</h2>
                        <span className="caption1 mt-2 inline-block">Shop now · Rs. 270</span>
                    </div>
                </Link>

                <Link href="/product/1966895078" className="group grid grid-cols-2 min-h-[220px] rounded-[24px] overflow-hidden bg-[#eef8fc]">
                    <div className="relative m-4 mr-0 overflow-hidden rounded-[18px] bg-white/50">
                        <Image src="/images/pickora/digital-hand-fan.png" alt="Digital rechargeable hand fan" fill priority sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center p-5">
                        <span className="caption1 font-semibold uppercase text-secondary">Summer ready</span>
                        <h2 className="heading6 mt-1">5-Speed Digital Hand Fan</h2>
                        <span className="caption1 mt-2 inline-block">Shop now · Rs. 1,399</span>
                    </div>
                </Link>
            </div>
        </div>
    </section>
)

export default SliderPickora
