# 0001. Stripe Sandbox Ecommerce Checkout and Order Flow

**Date**: 2026-10-23
**Status**: In Progress

## Summary

This specification establishes a clean, minimal ecommerce application built on Next.js with functional Stripe sandbox payments. Customers browse curated products, add items to a local storage cart, review order totals, and pay through Stripe Hosted Checkout in test mode. A dedicated credentials drawer enables direct input of Stripe test keys without requiring server environment restarts, and successful payments verify session state before recording completed orders into client storage.

## Requirements

**User stories**:
* As a shopper, I want to browse products, view details, and add items to my cart so that I can prepare an order.
* As a shopper, I want to pay securely through Stripe sandbox checkout and view my completed order receipt with confirmed payment details.
* As a demo operator, I want to input my Stripe test publishable and secret keys directly on screen so that I can test payments immediately without server configuration hurdles.
* As a shopper, I want my active cart preserved if I cancel during checkout so that I do not lose my selections.

**Acceptance criteria**:
* **AC-1**: Storefront landing page at `/` displays a curated catalog of demo products with title, image, price in USD, and immediate add to cart functionality.
* **AC-2**: Product details page at `/products/[id]` displays individual product imagery, full description, quantity selector, and cart addition with instant visual feedback.
* **AC-3**: Checkout page at `/checkout` displays line item breakdown, subtotal, tax calculation, order total, and a clear Pay with Stripe action button.
* **AC-4**: In app credentials drawer allows pasting Stripe sandbox publishable and secret keys, validates key prefix formats (`pk_test_...` and `sk_test_...`), and persists keys in browser local storage.
* **AC-5**: Submitting checkout sends line items and optional credentials to `POST /api/checkout`, creating a Stripe Checkout Session and redirecting the browser to Stripe Hosted Checkout.
* **AC-6**: Canceled checkout redirects the customer back to `/checkout?canceled=true`, preserving all cart items and displaying an informative recovery banner.
* **AC-7**: Successful checkout redirects the customer to `/orders/[id]?session_id={CHECKOUT_SESSION_ID}`, where the application calls `GET /api/checkout/verify` to confirm payment with Stripe, marks order status as paid, empties the active cart, and displays a complete order receipt.
* **AC-8**: Orders history page at `/orders` lists past completed orders retrieved from browser local storage with order id, date, total amount, and status badge.

## Decision

**Chosen option**: Option 1: Stripe Hosted Checkout with Local Storage Persistence and Dynamic Key Headers

This architecture balances high fidelity payment execution with lightweight local demonstration. Stripe securely hosts the payment UI, while Next.js handles server route execution and local storage preserves catalog cart and order states.

**Implementation skills**: `stripe-best-practices` (`stripe/ai`, `.agents/skills/stripe-best-practices/`) · `nextjs-app-router-patterns` (`wshobson/agents`, `.agents/skills/nextjs-app-router-patterns/`)

## Rationale

Reasoning, background context, options considered, and references are detailed in [rationale.md](rationale.md).

## Feature design

**Data model sketch**:

```
Product
  id: string (PK)
  name: string
  description: string
  priceInCents: number
  currency: string (usd)
  image: string
  category: string
  inStock: boolean

CartItem
  productId: string (PK)
  product: Product
  quantity: number
  addedAt: number

Order
  id: string (PK, uuid)
  stripeSessionId: string | null
  createdAt: string (ISO timestamp)
  customerEmail: string
  customerName: string
  items: OrderItem[]
  subtotalInCents: number
  taxInCents: number
  totalInCents: number
  currency: string
  paymentStatus: "pending" | "paid" | "failed" | "canceled"
  shippingAddress: string | null

OrderItem
  id: string (PK)
  orderId: string (FK)
  productId: string (FK)
  name: string
  unitPriceInCents: number
  quantity: number
  image: string

StripeConfig
  publishableKey: string
  secretKey: string
  isConfigured: boolean
  updatedAt: string (ISO timestamp)
```

**State transitions**:
* Cart: empty -> items added -> checkout initiated -> cleared upon verified order payment.
* Order: draft created locally with status `pending` -> Stripe session created -> customer redirected to Stripe -> customer completes payment -> return to `/orders/[id]` -> verified via API -> status transitioned to `paid`. If canceled, status marked `canceled` or removed.

**API surface**:
| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| /api/checkout | POST | items: OrderItem[], customerEmail: string, orderId: string | url: string, sessionId: string | Public or custom header | 400 invalid items, 401 missing stripe key, 500 stripe error |
| /api/checkout/verify | GET | session_id: string (query param) | paid: boolean, status: string, amountTotal: number, customerEmail: string, paymentIntentId: string | Public or custom header | 400 missing session id, 401 missing stripe key, 404 session not found, 500 stripe error |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| View catalog | Product cards and pricing | Static catalog array in `lib/products.ts` |
| View product details | Single product data | Matched by id from `lib/products.ts` |
| Add to cart | Cart item quantities and totals | Local storage key `ecommerce_cart` |
| Open credentials drawer | Stripe API keys | Local storage key `ecommerce_stripe_config` or server environment variables |
| Initiate checkout | Stripe checkout session url and session id | Generated by Stripe API via `POST /api/checkout` |
| Create draft order | Order id and initial pending status | Generated client side via random uuid before Stripe redirect |
| Return from Stripe | Session id | Query parameter `session_id` passed by Stripe redirect |
| Verify order payment | Verified payment status and payment intent id | Returned from Stripe API via `GET /api/checkout/verify` |
| Display order receipt | Items, customer email, totals, and payment confirmation | Merged local storage order record and verified Stripe session payload |
| View order history | Chronological list of orders | Local storage key `ecommerce_orders` |

**Key invariants**:
* Subtotal must equal the exact sum of line item prices multiplied by quantities.
* Order price calculations on `/api/checkout` validate against canonical catalog prices to prevent client tampering.
* Only valid Stripe test keys (`pk_test_...` and `sk_test_...`) are accepted by the in app credentials drawer.
* An order cannot transition to `paid` without successful verification against the Stripe session API.

**Security model**:
* All sensitive credit card collection happens strictly on Stripe hosted checkout domains.
* In app sandbox secret keys are stored in client local storage and transmitted over local loopback HTTPS to Next.js route handlers. Keys are never logged or stored in permanent server storage.
* Test keys only: production live keys are rejected by validation guards.

**Configuration required**:
* `STRIPE_SECRET_KEY`: optional server side fallback secret key for sandbox operations.
* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: optional server side fallback publishable key.

**Critical test scenarios**:
* Happy path: Customer adds two items to cart, opens checkout, clicks Pay with Stripe, inputs 4242 test card on Stripe checkout, and returns to `/orders/[id]` with verified paid status, verifies **AC-1**, **AC-2**, **AC-3**, **AC-5**, **AC-7**.
* Failure case: Customer clicks cancel on Stripe checkout, returns to `/checkout?canceled=true`, cart remains intact, and an alert is shown, verifies **AC-6**.
* Missing key case: Customer attempts checkout without configuring Stripe keys, system displays credentials drawer with key guidance, verifies **AC-4**.

## Build plan

1. [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS, satisfies **AC-1**
2. [x] Create static product catalog dataset and product utility functions in `lib/products.ts`, satisfies **AC-1**, **AC-2**
3. [x] Implement local storage state management hooks for Cart, Orders, and Stripe Credentials with hydration guards, satisfies **AC-4**, **AC-8**
4. [x] Build in app Stripe credentials drawer component allowing real time key entry, validation, and status indicators, satisfies **AC-4**
5. [x] Build storefront layout, navigation header with cart badge, and landing page product catalog at `/`, satisfies **AC-1**
6. [x] Build dynamic product details page at `/products/[id]` with image display, description, and quantity controls, satisfies **AC-2**
7. [x] Build checkout page at `/checkout` displaying order summary, credentials status check, and payment trigger, satisfies **AC-3**, **AC-6**
8. [x] Implement server route handler `POST /api/checkout` to create Stripe Checkout Sessions with line items, satisfies **AC-5**
9. [x] Implement server route handler `GET /api/checkout/verify` to retrieve session details and confirm payment status, satisfies **AC-7**
10. [x] Build order details confirmation page at `/orders/[id]` that verifies the Stripe session, marks order paid, and renders receipt, satisfies **AC-7**
11. [x] Build orders history list page at `/orders` displaying past purchases stored in local storage, satisfies **AC-8**

## Consequences

**Positive**:
* Zero friction testing: anyone can run the demo and enter test keys directly in the browser.
* Clean separation of concerns with Next.js App Router route handlers and decoupled client storage.
* High fidelity Stripe checkout experience supporting full sandbox test card validations.

**Negative / tradeoffs**:
* Storing sandbox secret keys in local storage is intended strictly for local development and demos; it is not suitable for production multi user systems.
* Clearing browser cache removes past order history because records reside in local storage.

**Neutral**:
* Requires internet connection to communicate with Stripe sandbox API endpoints.

## Follow-up

* [ ] Verify Stripe webhook signature verification if background webhook handling is needed for production deployment.
* [ ] Consider migrating local storage persistence to SQLite or Postgres if multi device persistence becomes a priority.
