import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Query parameter session_id is required." },
        { status: 400 }
      );
    }

    const customSecretKey = req.headers.get("x-stripe-secret-key");
    const secretKey =
      (customSecretKey && customSecretKey.trim()) ||
      process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe Secret Key is missing. Unable to verify payment status with Stripe.",
        },
        { status: 401 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    const isPaid = session.payment_status === "paid";
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;

    return NextResponse.json({
      paid: isPaid,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail:
        session.customer_details?.email || session.customer_email || "",
      customerName: session.customer_details?.name || "",
      amountTotal: session.amount_total || 0,
      currency: session.currency || "usd",
      paymentIntentId,
      orderId: session.metadata?.orderId || session.client_reference_id || null,
      createdAt: session.created
        ? new Date(session.created * 1000).toISOString()
        : new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Stripe session verification failed:", error);
    const message =
      error?.message || "Failed to verify Stripe checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
