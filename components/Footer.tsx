"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-950 text-white font-mono text-xs font-bold">
                A
              </span>
              <span className="text-sm font-bold tracking-tight text-zinc-900">
                ATELIER
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              Curated minimal storefront demonstration engineered with Next.js App Router,
              functional Stripe Hosted Checkout in test sandbox, and browser local storage persistence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <Link href="/" className="hover:text-zinc-900 transition">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-zinc-900 transition">
                  Checkout Review
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-zinc-900 transition">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Security & Environment
            </h4>
            <div className="flex items-start gap-2 text-xs text-zinc-500">
              <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                PCI DSS SAQ A compliant via Stripe Hosted Checkout. Zero sensitive card data touches our server.
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} ATELIER Demo. Strictly for Stripe Sandbox evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-zinc-500">
              <Sparkles className="h-3 w-3 text-cobalt" /> Next.js App Router + Stripe SDK
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
