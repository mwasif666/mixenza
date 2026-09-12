import React from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuEleven from "@/components/Header/Menu/MenuEleven";
import SliderEleven from "@/components/Slider/SliderEleven";
import TrendingNow from "@/components/Home11/TrendingNow";
import Banner from "@/components/Home9/Banner";
import Benefit from "@/components/Home1/Benefit";
import blogData from "@/data/Blog.json";
import NewsInsight from "@/components/Home3/NewsInsight";
import Brand from "@/components/Home1/Brand";
import Newsletter from "@/components/Home10/Newsletter";
import Footer from "@/components/Footer/Footer";
import ModalNewsletter from "@/components/Modal/ModalNewsletter";
import LiveCatalog from "@/components/Home11/LiveCatalog";

export default function HomeEleven() {
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuEleven />
        <SliderEleven />
      </div>
      <TrendingNow />
      <LiveCatalog />
      <Banner />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      <NewsInsight data={blogData} start={0} limit={3} />
      <Brand />
      <Newsletter />
      <Footer />
      <ModalNewsletter />
    </>
  );
}
