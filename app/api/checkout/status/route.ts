import { NextResponse } from "next/server";

export async function GET() {
  const hasEnvKey = Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY.startsWith("sk_test_")
  );

  return NextResponse.json({
    serverConfigured: hasEnvKey,
  });
}
