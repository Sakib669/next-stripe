"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useStripeConfig } from "@/context/StripeConfigContext";
import {
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Database,
  Lock,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All", "Audio", "Accessories", "Workspace", "Apparel"] as const;

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { hasValidKeys, setIsDrawerOpen } = useStripeConfig();

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-16 pb-20">
      {/* Sandbox Keys Banner */}
      {!hasValidKeys && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Stripe sandbox keys required:</strong> Please add your Stripe test keys to enable direct payments.
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="rounded-lg bg-amber-900 px-3 py-1 font-semibold text-white hover:bg-amber-950 transition"
            >
              Open Credentials Drawer
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-cobalt" />
              <span>Minimalist Design · Stripe Hosted Sandbox</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 font-sans leading-tight">
              Curated objects of utility <br className="hidden sm:inline" />
              and mechanical precision.
            </h1>

            <p className="text-sm sm:text-base text-zinc-500 max-w-xl leading-relaxed">
              Explore our minimalist catalog and test real Stripe sandbox checkout flows.
              Input your test keys directly on screen, complete payments with test cards,
              and receive verified receipts stored locally.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-cobalt transition shadow-xs"
              >
                Explore Collection <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition shadow-xs"
              >
                <Key className="h-3.5 w-3.5 text-cobalt" /> Configure Credentials
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">
              The Collection
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Showing {filteredProducts.length} curated design pieces
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200/50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-white text-zinc-950 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-zinc-950">
              Functional Payment Architecture
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              How this demo connects Stripe sandbox payments with local persistence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cobalt-light text-cobalt mb-3">
                <CreditCard className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Stripe Hosted Checkout
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Creates a secure Checkout Session via Next.js Route Handlers. Customers complete payment on Stripe test domains.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <Database className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Local Storage Persistence
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Cart state, credentials configuration, and completed order history persist safely inside your browser without external database setup.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 mb-3">
                <Lock className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Session Verification
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                After payment, Stripe redirects back to the order page where the server verifies the session status before recording order as paid.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
