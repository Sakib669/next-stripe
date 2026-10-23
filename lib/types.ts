export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceInCents: number;
  currency: string;
  image: string;
  category: "Audio" | "Accessories" | "Workspace" | "Apparel";
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  unitPriceInCents: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "canceled";
  shippingAddress: string | null;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  isConfigured: boolean;
  updatedAt: string | null;
}
