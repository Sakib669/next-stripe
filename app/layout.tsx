import type { Metadata } from "next";
import "./globals.css";
import { StripeConfigProvider } from "@/context/StripeConfigContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CredentialsDrawer } from "@/components/CredentialsDrawer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "ATELIER | Minimalist Ecommerce & Stripe Sandbox Demo",
  description:
    "A clean, minimal ecommerce application with functional Stripe sandbox payments, dynamic test credentials, and local storage persistence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 font-sans antialiased">
        <StripeConfigProvider>
          <CartProvider>
            <OrdersProvider>
              <Header />
              <CredentialsDrawer />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </OrdersProvider>
          </CartProvider>
        </StripeConfigProvider>
      </body>
    </html>
  );
}
