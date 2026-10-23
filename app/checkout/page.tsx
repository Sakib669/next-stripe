"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useStripeConfig } from "@/context/StripeConfigContext";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/products";
import { Order, OrderItem } from "@/lib/types";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Key,
  ShoppingBag,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get("canceled") === "true";
  const canceledOrderId = searchParams.get("order_id");

  const { items, subtotalInCents, taxInCents, totalInCents } = useCart();
  const { config, hasValidKeys, setIsDrawerOpen } = useStripeConfig();
  const { saveOrder, updateOrderStatus } = useOrders();

  const [customerEmail, setCustomerEmail] = useState("tester@example.com");
  const [customerName, setCustomerName] = useState("Demo Customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If returning from a canceled checkout, update the draft order status to canceled
  useEffect(() => {
    if (isCanceled && canceledOrderId) {
      updateOrderStatus(canceledOrderId, "canceled");
    }
  }, [isCanceled, canceledOrderId, updateOrderStatus]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please select products before proceeding.");
      return;
    }

    if (!hasValidKeys) {
      setIsDrawerOpen(true);
      setErrorMessage(
        "Stripe credentials required. Please enter your sandbox test keys in the credentials drawer."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

      // Prepare order items snapshot
      const orderItems: OrderItem[] = items.map((item) => ({
        id: `item_${Math.random().toString(36).substring(2, 9)}`,
        productId: item.productId,
        name: item.product.name,
        unitPriceInCents: item.product.priceInCents,
        quantity: item.quantity,
        image: item.product.image,
      }));

      // Create draft order record in local storage
      const draftOrder: Order = {
        id: orderId,
        stripeSessionId: null,
        stripePaymentIntentId: null,
        createdAt: new Date().toISOString(),
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim(),
        items: orderItems,
        subtotalInCents,
        taxInCents,
        totalInCents,
        currency: "usd",
        paymentStatus: "pending",
        shippingAddress: "Demo Sandbox Address, San Francisco, CA",
      };

      saveOrder(draftOrder);

      // Call Next.js server route handler to create Stripe session
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (config.secretKey) {
        headers["x-stripe-secret-key"] = config.secretKey;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customerEmail: customerEmail.trim(),
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create Stripe checkout session.");
      }

      if (data.url) {
        // Redirect to Stripe Hosted Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No redirect checkout URL received from Stripe.");
      }
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <ShoppingBag className="h-8 w-8 stroke-1" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-950">Your Cart is Empty</h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          You don&apos;t have any items ready for checkout. Please return to the collection
          and select items to test the Stripe sandbox.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-cobalt transition"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      {/* Canceled Notice Banner */}
      {isCanceled && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <h4 className="font-semibold text-sm text-amber-950">Payment Canceled</h4>
            <p className="mt-0.5">
              Your Stripe Checkout session was canceled. Your cart items have been
              safely preserved so you can retry when you are ready.
            </p>
          </div>
        </div>
      )}

      {/* Missing Keys Banner */}
      {!hasValidKeys && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-amber-950">
            <Key className="h-5 w-5 text-amber-700 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Stripe Sandbox Keys Missing</p>
              <p className="text-amber-800">
                You must enter your test credentials before checking out with Stripe.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="w-full sm:w-auto rounded-xl bg-amber-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-950 transition"
          >
            Configure Keys Now
          </button>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-xs text-red-900">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-red-950">Checkout Error</h4>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Customer info & payment method */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h2 className="text-base font-bold text-zinc-950">Customer Information</h2>
              <span className="text-xs text-zinc-400">Demo sandbox data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 focus:bg-white focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 focus:bg-white focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt transition"
                />
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100 flex items-start gap-3 text-xs text-zinc-500">
              <Lock className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Payment details will be entered securely on the official Stripe Hosted Checkout page.
                No sensitive card numbers are handled on this server.
              </span>
            </div>
          </div>

          {/* Payment gateway overview card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-950">Payment Integration</h3>
            <div className="flex items-center justify-between p-4 rounded-xl border border-cobalt/30 bg-cobalt-light/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cobalt text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950">
                    Stripe Hosted Checkout
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Sandbox test mode with dynamic payment methods
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Sandbox Active
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Order summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-zinc-950 border-b border-zinc-100 pb-4">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* Line items list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200/60">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-950 font-mono">
                    {formatPrice(item.product.priceInCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(subtotalInCents)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Taxes & Fees</span>
                <span className="text-emerald-700 font-medium">Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Due</span>
                <span className="text-cobalt font-mono">{formatPrice(totalInCents)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cobalt py-3.5 px-6 text-sm font-semibold text-white hover:bg-cobalt-hover shadow-sm transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Connecting to Stripe...
                </>
              ) : (
                `Pay with Stripe (${formatPrice(totalInCents)})`
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-400">
              You will be redirected to Stripe test checkout to complete simulated payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-zinc-500">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
