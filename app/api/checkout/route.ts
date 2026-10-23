import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";

interface CheckoutItemPayload {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const customSecretKey = req.headers.get("x-stripe-secret-key");
    const secretKey =
      (customSecretKey && customSecretKey.trim()) ||
      process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe Secret Key is missing. Please provide your test secret key (sk_test_...) via the on screen credentials drawer or set STRIPE_SECRET_KEY in your environment.",
        },
        { status: 401 }
      );
    }

    if (!secretKey.startsWith("sk_test_")) {
      return NextResponse.json(
        {
          error:
            "Invalid Stripe Secret Key. For this demo, only sandbox test keys starting with sk_test_ are allowed.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { items, customerEmail, orderId } = body as {
      items?: CheckoutItemPayload[];
      customerEmail?: string;
      orderId?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please add at least one item to proceed." },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order reference ID is required." },
        { status: 400 }
      );
    }

    // Build Stripe line items using canonical product pricing
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const canonicalProduct = getProductById(item.productId);
      if (!canonicalProduct) {
        return NextResponse.json(
          { error: `Product with ID "${item.productId}" was not found.` },
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        continue;
      }

      lineItems.push({
        price_data: {
          currency: canonicalProduct.currency.toLowerCase(),
          product_data: {
            name: canonicalProduct.name,
            description: canonicalProduct.tagline,
            images: [canonicalProduct.image],
            metadata: {
              productId: canonicalProduct.id,
            },
          },
          unit_amount: canonicalProduct.priceInCents,
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid line items found for checkout." },
        { status: 400 }
      );
    }

    // Initialize Stripe client
    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });

    // Safely derive origin without path corruption
    const reqUrl = new URL(req.url);
    const originHeader = req.headers.get("origin");
    const refererHeader = req.headers.get("referer");
    let cleanOrigin = originHeader;
    if (!cleanOrigin && refererHeader) {
      try {
        cleanOrigin = new URL(refererHeader).origin;
      } catch {
        cleanOrigin = reqUrl.origin;
      }
    }
    cleanOrigin = cleanOrigin || reqUrl.origin;

    // Create Checkout Session with dynamic payment methods
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerEmail?.trim() || undefined,
      client_reference_id: orderId,
      metadata: {
        orderId,
      },
      success_url: `${cleanOrigin}/orders/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanOrigin}/checkout?canceled=true&order_id=${orderId}`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Stripe checkout session creation failed:", error);
    const message =
      error?.message || "An unexpected error occurred while creating Stripe checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
