"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StoreProductCard from "@/components/Shop/StoreProductCard";
import { SourceProduct } from "@/lib/theOnlineStore";
import { loadCatalog, subscribeCatalogUpdates } from "@/lib/catalogClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function LiveCatalog() {
  const [products, setProducts] = useState<SourceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    loadCatalog()
      .then((payload) => {
        if (!cancelled && Array.isArray(payload?.products))
          setProducts(payload.products);
      })
      .catch(() => {
        if (!cancelled)
          setError("Products could not be loaded. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    const unsubscribe = subscribeCatalogUpdates(() => setAttempt((value) => value + 1));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [attempt]);

  const pickoraProducts = useMemo(() => {
    // Only authentic Pickora catalog entries, not unrelated products flagged featured.
    const seen = new Set<string>();
    return products.filter(product => {
      if (!product?.id || !/^DARAZ-/i.test(product.sku || '') || !product.isFeatured || seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, [products]);

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    const list: SourceProduct[] = [];
    for (const product of products) {
      if (!product?.id || seen.has(product.id) || /^DARAZ-/i.test(product.sku || '')) continue;
      seen.add(product.id);
      list.push(product);
      if (list.length === 8) break;
    }
    return list;
  }, [products]);

  if (error)
    return (
      <section className="container py-16" role="alert">
        <p>{error}</p>
        <button
          className="button-main mt-4"
          onClick={() => setAttempt((value) => value + 1)}
        >
          Retry
        </button>
      </section>
    );

  return (
    <section className="md:pt-20 pt-10">
      <div className="container">
        <section aria-labelledby="pickora-featured-title" className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f2f6ff] via-[#fafaff] to-[#fff5f1] px-5 pb-8 pt-8 shadow-[0_18px_55px_rgba(24,32,65,0.06)] md:px-9 md:pt-11">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#dbe6ff]/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-[#ffe5e6]/60 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6b7196]">Curated by Mixenza</p>
              <h2 id="pickora-featured-title" className="heading3 mt-2">Featured Products</h2>
              <p className="mt-2 text-sm leading-6 text-secondary md:text-base">Discover Mixenza's favourite everyday finds, from clever gadgets to little home upgrades.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/shop" className="mr-1 hidden text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70 sm:inline">Shop all</Link>
              <button type="button" aria-label="Previous featured product" className="pickora-featured-prev flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-xl shadow-sm transition hover:bg-black hover:text-white disabled:opacity-30">
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" aria-label="Next featured product" className="pickora-featured-next flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-xl shadow-sm transition hover:bg-black hover:text-white disabled:opacity-30">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-[380px] animate-pulse rounded-[24px] bg-white/70" />
              ))}
            </div>
          ) : pickoraProducts.length ? (
            <div className="relative mt-7 md:mt-9">
              <Swiper
                modules={[Navigation, Autoplay, Pagination, A11y]}
                navigation={{ prevEl: ".pickora-featured-prev", nextEl: ".pickora-featured-next" }}
                pagination={{ clickable: true, dynamicBullets: true, el: ".pickora-featured-pagination" }}
                autoplay={{ delay: 4400, disableOnInteraction: false, pauseOnMouseEnter: true }}
                speed={650}
                spaceBetween={16}
                slidesPerView={1.18}
                watchOverflow
                breakpoints={{
                  480: { slidesPerView: 1.5, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 18 },
                  900: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 22 },
                }}
                aria-label="Mixenza featured products carousel"
              >
                {pickoraProducts.map((product, index) => (
                  <SwiperSlide key={product.id} className="!h-auto">
                    <div className="h-full rounded-[22px] border border-white/90 bg-white p-3 shadow-[0_8px_25px_rgba(28,32,66,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(28,32,66,0.13)] md:p-4">
                      <div className="mb-3 flex items-center justify-between gap-2 px-1">
                        <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4d5594]">Mixenza Select</span>
                        <span className="text-xs font-medium tabular-nums text-secondary">{String(index + 1).padStart(2, "0")} / {String(pickoraProducts.length).padStart(2, "0")}</span>
                      </div>
                      <StoreProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="pickora-featured-pagination mt-7 flex min-h-4 items-center justify-center" />
              <Link href="/shop" className="mt-4 block text-center text-sm font-semibold underline underline-offset-4 sm:hidden">Browse the full collection</Link>
            </div>
          ) : (
            <p className="relative mt-7 text-sm text-secondary">Mixenza featured products will appear here when available.</p>
          )}
        </section>
        <div className="flex items-end justify-between gap-4 flex-wrap md:mt-20 mt-12">
          <div>
            <h2 className="heading3">New Arrivals</h2>
            <p className="text-secondary mt-2">Fresh additions from the Mixenza catalog.</p>
          </div>
          <Link
            href="/shop"
            className="text-button-uppercase underline underline-offset-4"
          >
            View all products
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7 md:mt-10 mt-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl bg-surface animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[16px] md:mt-10 mt-6">
            {uniqueProducts.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
