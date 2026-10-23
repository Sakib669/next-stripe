# Design System

## Character

Clean minimal editorial aesthetic with crisp modern typography, calm whitespace, balanced contrast, and discreet interactive affordances. The visual language emphasizes product imagery, straightforward purchase journeys, and clear real time payment status indicators.

## Palette

* Canvas Background: `#FAFAFA` (warm light slate canvas) with dark contrast mode support `#09090B`
* Surface Cards: `#FFFFFF` (pure clean white) with subtle border `#E4E4E7`
* Primary Text: `#09090B` (deep charcoal black)
* Secondary Muted Text: `#71717A` (calm neutral gray)
* Brand Accent: `#18181B` (monochrome minimalist lead) with `#0000F2` (Hermes cobalt accent for active focus rings and payment actions)
* Success Badge: `#16A34A` (clean emerald for verified payments)
* Warning Alert: `#F59E0B` (amber alert for test credentials reminder)
* Danger Alert: `#DC2626` (ruby red for payment errors and cancellations)

## Typography

* Display and Headings: Modern geometric sans (Geist, Inter, or system sans), tracking tight, deliberate scale contrast
* Body copy: Clean neutral sans with relaxed line height for readability
* Monospace: Font mono for Stripe keys, session ids, order references, and monetary calculations

## Components

* Product Cards: Minimalist aspect ratio containers, soft hover lift, high quality product photography, clear price display, and direct add to cart actions
* Credentials Drawer: Subtle expandable utility bar displaying Stripe test mode status (`pk_test_...` and `sk_test_...`) with instant validation pills
* Checkout Summary: Structured financial breakdown with subtotal, tax, and order total
* Order Confirmation: Trustworthy receipt card with Stripe payment verification badge, transaction details, and order items list

## Build Mandate

Never leave unstyled bare inputs, default browser buttons, or floating empty forms. Every view must include structured page headers, responsive grid containers, loading states, error boundaries, empty cart fallbacks, and clear feedback toasts.
