"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
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

  useEffect(() => {
    const stored = getFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    setItems(stored);
  }, []);

  const updateCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    saveToStorage(STORAGE_KEYS.CART, newItems);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          addedAt: Date.now(),
        };
        updated = [...prev, newItem];
      }
      saveToStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      saveToStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const updated = prev.filter((item) => item.productId !== productId);
        saveToStorage(STORAGE_KEYS.CART, updated);
        return updated;
      }
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveToStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveToStorage(STORAGE_KEYS.CART, []);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotalInCents = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.priceInCents * item.quantity,
        0
      ),
    [items]
  );

  // Transparent pricing: 0 additional tax for demo checkout (matches Stripe total exactly)
  const taxInCents = 0;
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
