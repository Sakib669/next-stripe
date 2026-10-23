"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/products";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalInCents,
    taxInCents,
    totalInCents,
  } = useCart();

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-6">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-zinc-900" />
            <h2 className="text-base font-semibold text-zinc-900">Your Cart</h2>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 mb-4">
                <ShoppingBag className="h-8 w-8 stroke-1" />
              </div>
              <h3 className="text-base font-medium text-zinc-900">Your cart is empty</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-xs">
                Explore our curated catalog and add high fidelity demo items to test Stripe checkout.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 transition"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-4 border-b border-zinc-100 pb-5"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/60">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {item.product.tagline}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-zinc-400 hover:text-red-500 p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-2 py-1 text-zinc-500 hover:text-zinc-900 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 text-zinc-500 hover:text-zinc-900 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatPrice(
                        item.product.priceInCents * item.quantity,
                        item.product.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50/70 p-6 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalInCents)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(taxInCents)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Estimated Total</span>
                <span className="text-cobalt">{formatPrice(totalInCents)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt px-5 py-3 text-sm font-medium text-white hover:bg-cobalt-hover shadow-sm transition active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
