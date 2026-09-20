"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StoreProductCard from "@/components/Shop/StoreProductCard";
import { SourceProduct } from "@/lib/theOnlineStore";
import { loadCatalog } from "@/lib/catalogClient";

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
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    const list: SourceProduct[] = [];
    for (const product of products) {
      if (!product?.id || seen.has(product.id)) continue;
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
        <div className="flex items-center justify-between gap-5 flex-wrap">
          {/* <div>
                        <div className="heading3">Featured Products</div>
                        <p className="text-secondary mt-2">Eight fresh picks — no repeats</p>
                    </div> */}
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
