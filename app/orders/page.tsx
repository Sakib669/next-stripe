"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/products";
import { Clock, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function OrdersHistoryPage() {
  const { orders } = useOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            Order History
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            All sandbox transactions stored locally in your browser
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-cobalt shadow-xs transition"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Back to Catalog
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400">
            <Clock className="h-8 w-8 stroke-1" />
          </div>
          <h2 className="text-lg font-bold text-zinc-950">No Past Orders Found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            You haven&apos;t completed any demo transactions yet. Select items from our
            collection and test the Stripe sandbox checkout flow.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-5 py-2.5 text-xs font-semibold text-white hover:bg-cobalt-hover shadow-xs transition"
            >
              Start Shopping <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPaid = order.paymentStatus === "paid";
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-zinc-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        isPaid
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> PAID
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-amber-600" /> PENDING
                        </>
                      )}
                    </span>
                    <span className="text-xs font-mono font-medium text-zinc-700">
                      #{order.id}
                    </span>
                  </div>

                  <span className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnails preview */}
                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xs font-semibold text-zinc-500 border border-zinc-200">
                        +{order.items.length - 4}
                      </div>
                    )}
                    <div className="ml-2 text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-900 block">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                      <span className="text-[11px]">To: {order.customerEmail}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block uppercase">Total</span>
                      <span className="text-sm font-bold text-zinc-950 font-mono">
                        {formatPrice(order.totalInCents, order.currency)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition shadow-xs"
                    >
                      Receipt <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
