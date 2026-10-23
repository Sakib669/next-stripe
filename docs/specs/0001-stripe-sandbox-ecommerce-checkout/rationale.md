# Rationale and Decision Record: Stripe Sandbox Ecommerce Checkout

## Context

Demonstrating ecommerce payment flows with Stripe requires a seamless developer and tester experience. While standard production setups bind Stripe credentials strictly to server environment variables, interactive demos and sandbox evaluation benefit from flexible credential entry so testers can plug in their own Stripe test keys on the fly.

Without a well structured flow, client side demos often suffer from race conditions, missing order records after redirects, or unverified payment statuses. This architecture solves these challenges by combining Next.js App Router route handlers for Stripe API communication with robust browser local storage persistence for cart items, customer orders, and test credentials.

## Options considered

### Option 1: Stripe Hosted Checkout with Local Storage Persistence and Dynamic Key Headers (Recommended)

Next.js App Router serves the minimal storefront pages. Stripe Checkout Sessions are created on the server via `POST /api/checkout`, accepting credentials either from server environment variables or from a client provided `x-stripe-secret-key` header. Customers complete payment on Stripe secure checkout pages, and redirect back to `/orders/[id]` where a verification route handler confirms the session status before persisting the finalized order into local storage.

**Pros**:
* Simplest and most reliable payment flow with zero sensitive card inputs on our application DOM.
* Meets PCI DSS SAQ A requirements automatically because payment data is collected entirely on Stripe servers.
* Flexible in app credential entry allows instant testing without rebuilding or restarting the local server.

**Cons**:
* Redirects the user away from the storefront domain to checkout.stripe.com during the payment step.
* Relies on browser local storage rather than a shared database, limiting order history to the active browser instance.

### Option 2: Stripe Embedded Checkout with Direct Elements

The checkout form is embedded directly into the `/checkout` page using Stripe Elements or Embedded Checkout iframe components.

**Pros**:
* Keeps the customer on the storefront domain for the entire purchase flow.

**Cons**:
* Higher implementation complexity requiring client SDK mounting, styling alignment, and iframe lifecycle management.
* Harder to debug during sandbox demo tests when credentials change dynamically.

### Option 3: Pure Client Side Mock Payment

Simulate payment success locally with a timer and dummy order creation, bypassing real Stripe API calls.

**Pros**:
* Requires zero Stripe credentials or network setup.

**Cons**:
* Fails the core requirement of demonstrating functional Stripe sandbox payments.
* Does not prove integration viability or handle actual card declines and web redirects.

## Rationale

Stripe Hosted Checkout provides the most robust sandbox verification experience. It guarantees full support for test cards, mobile wallets, localized currencies, and validation edge cases without maintaining complex client payment form components. Passing the secret key through request headers with a fallback to environment variables gives developers the freedom to test with their own keys instantly while preserving standard deployment patterns.

## References

**Project sources**:
* Installed skill `.agents/skills/stripe-best-practices/` for Stripe API session patterns
* Installed skill `.agents/skills/nextjs-app-router-patterns/` for Next.js App Router route handler conventions

**Practices & standards**:
* PCI DSS SAQ A compliance standard for hosted payment redirects
* Idempotent payment session creation and post redirect verification

**Links**:
* Stripe Checkout Quickstart: https://skills.sh/stripe/ai/stripe-best-practices
* Next.js App Router Patterns: https://skills.sh/wshobson/agents/nextjs-app-router-patterns
