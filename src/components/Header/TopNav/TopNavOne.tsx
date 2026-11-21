'use client'
import React from 'react'
import Link from 'next/link'

interface Props {
  props: string
  slogan: string
}

const TopNavOne: React.FC<Props> = ({ props }) => (
  <div className={`top-nav md:h-[44px] h-[30px] ${props}`}>
    <div className="container mx-auto h-full">
      <div className="top-nav-main flex h-full items-center justify-between gap-4">
        <Link href="/pages/shipping-policy" className="hidden text-xs text-white hover:underline md:block">Delivery across Pakistan · Prices in PKR</Link>
        <span className="text-center text-xs font-medium text-white md:text-sm">Shop useful everyday finds at Mixenza</span>
        <Link href="/pages/contact" className="hidden text-xs text-white hover:underline md:block">Contact us</Link>
      </div>
    </div>
  </div>
)
export default TopNavOne
