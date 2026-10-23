# Scope

**Workflow**: Alpha

## At a glance

| Feature | Status | Spec |
|---|---|---|
| Stripe Sandbox Ecommerce Store | in progress | [0001](../specs/0001-stripe-sandbox-ecommerce-checkout/index.md) |

## Features

### Stripe Sandbox Ecommerce Store (in progress)

Minimal ecommerce application built on Next.js with functional Stripe sandbox checkout, on screen credentials input, and local storage order persistence.

**Spec**: [0001](../specs/0001-stripe-sandbox-ecommerce-checkout/index.md)

**Done when**: A customer can browse products, add items to cart, enter Stripe test credentials, complete checkout on Stripe Hosted Checkout, return to a verified order confirmation receipt, and review past orders in local storage.

* [x] Design it (spec): completed in [0001](../specs/0001-stripe-sandbox-ecommerce-checkout/index.md)
* [x] Build it: /develop stripe sandbox ecommerce store (code in app/, components/, lib/, context/)
  * [x] Foundation and storage layer (Next.js setup, product catalog, and local storage hooks), covers AC-1, AC-4, AC-8
  * [x] Storefront browsing and credentials drawer (Landing catalog, product details, and credentials manager), covers AC-1, AC-2, AC-4
  * [x] Checkout page and Stripe session creation API route, covers AC-3, AC-5, AC-6
  * [x] Payment verification API route, order receipt page, and order history, covers AC-7, AC-8
* [x] Verify it: /check verify stripe sandbox ecommerce store
* [ ] Test it: /test stripe sandbox ecommerce store
