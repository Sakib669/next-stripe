import { NextResponse } from "next/server";

export async function GET() {
  const rawSecret =
    process.env.SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY ||
    "";
  const secretKey = rawSecret.replace(/^["']|["']$/g, "").trim();
  const hasEnvKey = Boolean(secretKey && secretKey.startsWith("sk_test_"));

  const rawPub =
    process.env.PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY ||
    "";
  const publishableKey = rawPub.replace(/^["']|["']$/g, "").trim();
  const hasPub = Boolean(publishableKey && publishableKey.startsWith("pk_test_"));

  return NextResponse.json({
    serverConfigured: hasEnvKey,
    hasPublishableKey: hasPub,
    publishableKey: hasPub ? publishableKey : null,
  });
}
