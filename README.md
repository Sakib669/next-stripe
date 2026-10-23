# Minimal E-Commerce Store with Stripe Sandbox

A minimalist, high performance ecommerce application built with Next.js App Router and Stripe test mode payments. Customers can browse curated products, inspect specifications, manage cart items in local storage, checkout securely via Stripe Hosted Checkout, and review verified order receipts.

## Features

* **Storefront Catalog**: Responsive product grid with category filter pills and quick add to cart.
* **Product Details**: Dedicated product view with detailed specifications, gallery imagery, and quantity controls.
* **Cart Drawer**: Instant slide out cart with quantity management, subtotal, and tax calculations stored in browser localStorage.
* **Stripe Sandbox Checkout**: Hosted Checkout Sessions with dynamic payment methods in Stripe test mode.
* **Payment Verification**: Server route handler verifies session payment state directly with Stripe API.
* **Order Details & History**: Verified order confirmation receipt with Stripe session and payment intent IDs, plus past orders list saved in localStorage.
* **Frictionless Configuration**: Automatically reads credentials from `.env` (`SECRET_KEY` and `PUBLISHABLE_KEY`) with optional in app credentials manager.

## Getting Started

### Prerequisites

* Node.js 18 or later
* npm, yarn, or pnpm
* Stripe account for sandbox test keys

### 1. Clone Repository

```bash
git clone https://github.com/Sakib669/next-stripe.git
cd next-stripe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PUBLISHABLE_KEY="pk_test_..."
SECRET_KEY="sk_test_..."
```

*(You can also use `STRIPE_SECRET_KEY` or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` if preferred.)*

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## Testing Payments

When checking out on the Stripe Hosted Checkout page in test mode, you can use the official Stripe test card:

* **Card Number**: `4242 4242 4242 4242`
* **Expiration Date**: Any valid future month and year
* **CVC**: Any 3 digits
* **ZIP / Postal Code**: Any valid code (e.g. `94103`)

## Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Library**: React 19
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Payment Gateway**: Stripe SDK
* **Client Database**: Browser Local Storage

## License

MIT
