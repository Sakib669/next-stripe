"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useStripeConfig } from "../context/StripeConfigContext";
import { ShoppingBag, Key, ShieldCheck, AlertCircle, Clock } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { hasValidKeys, config, serverFallbackAvailable, setIsDrawerOpen } =
    useStripeConfig();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white font-mono text-xs font-bold transition group-hover:bg-cobalt">
              A
            </span>
            <span className="text-base font-bold tracking-tight text-zinc-950 font-sans">
              ATELIER<span className="text-cobalt">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition hover:text-zinc-950 ${
                pathname === "/" ? "text-zinc-950 font-semibold" : "text-zinc-500"
              }`}
            >
              Catalog
            </Link>
            <Link
              href="/orders"
              className={`flex items-center gap-1.5 transition hover:text-zinc-950 ${
                pathname.startsWith("/orders")
                  ? "text-zinc-950 font-semibold"
                  : "text-zinc-500"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Past Orders
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Stripe Test Mode Status Pill */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition ${
              hasValidKeys
                ? "bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80"
                : "bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100/80 animate-pulse"
            }`}
            title="Click to view Stripe sandbox credentials"
          >
            {hasValidKeys ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Stripe Sandbox Ready</span>
                <span className="sm:hidden">Ready</span>
              </>
            ) : (
              <>
                <Key className="h-3.5 w-3.5 text-amber-600" />
                <span>Configure .env Keys</span>
              </>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 shadow-xs transition"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cobalt text-[10px] font-bold text-white shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
