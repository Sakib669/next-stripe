"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProductById, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const product = getProductById(id);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-950">Product Not Found</h1>
        <p className="mt-2 text-sm text-zinc-500">
          The requested product piece does not exist in our catalog.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-cobalt transition"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200/80 shadow-xs">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-zinc-900 border border-zinc-200/60 shadow-xs">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info & Purchase controls */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
              {product.name}
            </h1>
            <p className="text-base text-zinc-500 font-medium leading-relaxed">
              {product.tagline}
            </p>
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">
                {formatPrice(product.priceInCents, product.currency)}
              </span>
              <span className="ml-2 text-xs text-zinc-400 font-medium">USD</span>
            </div>
          </div>

          <div className="border-t border-b border-zinc-200 py-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Description
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Technical Specifications
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Quantity:
              </span>
              <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-950 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-zinc-500 hover:text-zinc-950 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-semibold transition active:scale-[0.98] ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleInstantBuy}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-cobalt py-3.5 px-6 text-sm font-semibold text-white hover:bg-cobalt-hover shadow-sm transition active:scale-[0.98]"
              >
                Buy Now with Stripe
              </button>
            </div>
          </div>

          {/* Reassurance pills */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Stripe Sandbox</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Instant Simulation</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
              <RotateCcw className="h-4 w-4 text-zinc-600" />
              <span>Safe Test Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
