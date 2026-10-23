"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../lib/types";
import { formatPrice } from "../lib/products";
import { useCart } from "../context/CartContext";
import { Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all duration-300">
      {/* Image container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-zinc-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-zinc-800 shadow-xs border border-zinc-200/40">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.id}`} className="group-hover:text-cobalt transition">
          <h3 className="text-sm font-semibold text-zinc-900 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100">
          <div>
            <span className="text-xs text-zinc-400 block font-normal">Price</span>
            <span className="text-sm font-semibold text-zinc-950 font-mono">
              {formatPrice(product.priceInCents, product.currency)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-zinc-900 text-white hover:bg-cobalt shadow-xs"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
