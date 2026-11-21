"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StoreProductCard from "@/components/Shop/StoreProductCard";
import { SourceProduct } from "@/lib/theOnlineStore";
import { loadCatalog, subscribeCatalogUpdates } from "@/lib/catalogClient";

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
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="heading3">Featured Products</h2>
            <p className="text-secondary mt-2">Discover our Pickora favorites, selected for everyday convenience.</p>
          </div>
          <Link href="/shop" className="text-button-uppercase underline underline-offset-4">Shop all products</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 md:mt-10 mt-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[16px] md:mt-10 mt-6">
            {pickoraProducts.map(product => <StoreProductCard key={product.id} product={product} />)}
          </div>
        )}
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
