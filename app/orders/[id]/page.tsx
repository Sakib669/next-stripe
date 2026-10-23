"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import { useStripeConfig } from "@/context/StripeConfigContext";
import { formatPrice } from "@/lib/products";
import { Order } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Printer,
  ArrowRight,
  Loader2,
} from "lucide-react";

function OrderDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = typeof params?.id === "string" ? params.id : "";
  const sessionId = searchParams.get("session_id");

  const { getOrderById, updateOrderStatus, saveOrder } = useOrders();
  const { clearCart } = useCart();
  const { config } = useStripeConfig();

  const [order, setOrder] = useState<Order | undefined>(() => getOrderById(orderId));
  const [isVerifying, setIsVerifying] = useState(Boolean(sessionId && order?.paymentStatus !== "paid"));
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const existing = getOrderById(orderId);
    if (existing) {
      setOrder(existing);
    }
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (!sessionId || hasVerifiedRef.current || order?.paymentStatus === "paid") {
      return;
    }

    hasVerifiedRef.current = true;
    let isMounted = true;

    async function verifyPayment() {
      setIsVerifying(true);
      setVerificationError(null);

      try {
        const headers: Record<string, string> = {};
        if (config.secretKey) {
          headers["x-stripe-secret-key"] = config.secretKey;
        }

        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`, {
          headers,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Payment verification failed.");
        }

        if (isMounted) {
          // Security check: verify that Stripe session metadata orderId matches URL orderId
          if (data.orderId && data.orderId !== orderId) {
            throw new Error(
              `Security validation failed: The verified Stripe session belongs to order "${data.orderId}" rather than "${orderId}".`
            );
          }

          if (data.paid) {
            // Update order status in context and local storage
            updateOrderStatus(orderId, "paid", {
              stripeSessionId: sessionId ?? undefined,
              stripePaymentIntentId: data.paymentIntentId ?? undefined,
              customerEmail: data.customerEmail ?? undefined,
            });

            // Also ensure we have an order record if cache was cleared
            setOrder((prev) => {
              if (prev) {
                return {
                  ...prev,
                  paymentStatus: "paid",
                  stripeSessionId: sessionId,
                  stripePaymentIntentId: data.paymentIntentId,
                  customerEmail: data.customerEmail || prev.customerEmail,
                };
              }
              const recovered: Order = {
                id: orderId,
                stripeSessionId: sessionId,
                stripePaymentIntentId: data.paymentIntentId,
                createdAt: data.createdAt,
                customerEmail: data.customerEmail || "customer@example.com",
                customerName: data.customerName || "Verified Customer",
                items: [],
                subtotalInCents: data.amountTotal,
                taxInCents: 0,
                totalInCents: data.amountTotal,
                currency: data.currency,
                paymentStatus: "paid",
                shippingAddress: "Stripe Verified Billing Address",
              };
              saveOrder(recovered);
              return recovered;
            });

            // Empty the active cart upon verified payment
            clearCart();
          } else {
            setVerificationError(
              `Payment status reported by Stripe is: ${data.paymentStatus || data.status}`
            );
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Session verification error:", err);
          setVerificationError(err.message || "Failed to verify session status.");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, orderId, config.secretKey, order?.paymentStatus, updateOrderStatus, clearCart, saveOrder]);

  const handlePrint = () => {
    window.print();
  };

  if (isVerifying) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-cobalt mx-auto" />
        <h2 className="text-xl font-bold text-zinc-950">
          Verifying Payment with Stripe...
        </h2>
        <p className="text-xs text-zinc-500">
          Connecting to Stripe sandbox to confirm session ID {sessionId}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-zinc-950">Order Not Found</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          We could not find an order matching reference &quot;{orderId}&quot; in your browser&apos;s
          local storage.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-cobalt transition"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Verification error alert */}
      {verificationError && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-red-950">Verification Warning</h4>
            <p className="mt-0.5">{verificationError}</p>
          </div>
        </div>
      )}

      {/* Status banner */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isPaid
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}
            >
              {isPaid ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Receipt #{order.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
                {isPaid ? "Payment Confirmed & Verified" : "Order Status: Pending"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-xs transition"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
            >
              All Orders
            </Link>
          </div>
        </div>

        {/* Transaction Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
          <div>
            <span className="text-zinc-400 block mb-0.5">Order Date</span>
            <span className="font-medium text-zinc-900">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5">Customer</span>
            <span className="font-medium text-zinc-900 truncate block">
              {order.customerName || "Demo User"}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5">Email</span>
            <span className="font-medium text-zinc-900 truncate block">
              {order.customerEmail}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5">Payment Status</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                isPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stripe Session Verification Proof */}
        {order.stripeSessionId && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Verified by Stripe API:</strong> Session ID:{" "}
                <code className="font-mono text-[11px] bg-emerald-100/60 px-1.5 py-0.5 rounded">
                  {order.stripeSessionId}
                </code>
              </span>
            </div>
            {order.stripePaymentIntentId && (
              <span className="text-[11px] text-emerald-800 font-mono">
                PI: {order.stripePaymentIntentId}
              </span>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
            Purchased Line Items
          </h3>

          <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden bg-white">
            {order.items.length === 0 ? (
              <p className="p-4 text-xs text-zinc-500">
                No individual item breakdown recorded for this direct session.
              </p>
            ) : (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 gap-4"
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Qty: {item.quantity} × {formatPrice(item.unitPriceInCents)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-zinc-950 font-mono">
                    {formatPrice(item.unitPriceInCents * item.quantity)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-2 border-t border-zinc-100 pt-6 text-xs max-w-xs ml-auto">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-mono">{formatPrice(order.subtotalInCents)}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Tax</span>
            <span className="font-mono">{formatPrice(order.taxInCents)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
            <span>Amount Paid</span>
            <span className="text-cobalt font-mono">
              {formatPrice(order.totalInCents, order.currency)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-900 hover:text-cobalt transition"
          >
            ← Return to Storefront
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-5 py-2.5 text-xs font-semibold text-white hover:bg-cobalt-hover shadow-xs transition"
          >
            View All Past Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-zinc-500">
          Loading receipt details...
        </div>
      }
    >
      <OrderDetailsContent />
    </Suspense>
  );
}
