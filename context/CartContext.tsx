"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "../lib/types";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../lib/storage";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    setItems(stored);
    setIsHydrated(true);
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    saveToStorage(STORAGE_KEYS.CART, newItems);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = items.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      updateCart(updated);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        addedAt: Date.now(),
      };
      updateCart([...items, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((item) => item.productId !== productId);
    updateCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    updateCart(updated);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalInCents = items.reduce(
    (total, item) => total + item.product.priceInCents * item.quantity,
    0
  );
  // Estimated 8% standard tax
  const taxInCents = Math.round(subtotalInCents * 0.08);
  const totalInCents = subtotalInCents + taxInCents;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalInCents,
        taxInCents,
        totalInCents,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
