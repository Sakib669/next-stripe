# Verify: Stripe Sandbox Ecommerce Store · spec 0001 · updated 2026-10-23
_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

* [ ] Visit storefront home at `http://localhost:3001/` → catalog grid displays 6 curated items with prices in USD and category filter pills → AC-1
* [ ] Click any product card → navigates to `/products/[id]` showing imagery, detailed specifications, and quantity controls → AC-2
* [ ] Click Add to Cart → slide out cart drawer opens with item quantity, subtotal, and tax calculation → AC-2, AC-3
* [ ] Click Configure Keys in top navigation header → open credentials drawer and enter test keys `pk_test_...` and `sk_test_...` → status indicator turns green and persists in browser local storage → AC-4
* [ ] Click Proceed to Checkout → navigate to `/checkout` with order summary breakdown and Pay with Stripe button → AC-3
* [ ] Click Pay with Stripe → Next.js server creates Checkout Session and browser redirects to Stripe Hosted Checkout at `checkout.stripe.com` → AC-5
* [ ] Click back or cancel on Stripe checkout page → redirects back to `/checkout?canceled=true` with friendly cancellation alert and cart preserved → AC-6
* [ ] Complete checkout using test card 4242 4242 4242 4242 → redirects to `/orders/[id]?session_id=...` → AC-5, AC-7
* [ ] On `/orders/[id]`, application verifies session with Stripe API, marks order status as PAID, clears active cart, and displays verified receipt with Stripe session and payment intent IDs → AC-7
* [ ] Visit `/orders` → verify completed order appears in local storage past orders list with date, total, and receipt view link → AC-8

## Commands

* [ ] `npm run build` → Next.js builds all static and dynamic routes cleanly with zero TypeScript errors → AC-1, AC-5, AC-7
* [ ] `curl -s http://localhost:3001/api/checkout/status` → returns `{ "serverConfigured": false }` when no environment keys set → AC-4
* [ ] `curl -s -X POST http://localhost:3001/api/checkout -H "Content-Type: application/json" -d '{}'` → returns 401 with missing key prompt → AC-4, AC-5

## Acceptance criteria coverage

* AC-1 Storefront catalog covered by UI step 1 and Command step 1
* AC-2 Product details and cart addition covered by UI step 2 and step 3
* AC-3 Checkout review and breakdown covered by UI step 3 and step 5
* AC-4 In app credentials drawer covered by UI step 4 and Command step 2
* AC-5 Stripe session creation and redirect covered by UI step 6, step 8, and Command step 3
* AC-6 Canceled checkout recovery covered by UI step 7
* AC-7 Payment verification and receipt receipt covered by UI step 8 and step 9
* AC-8 Local storage order history covered by UI step 10
