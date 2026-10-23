"use client";

export const STORAGE_KEYS = {
  CART: "stripe_demo_cart_items",
  ORDERS: "stripe_demo_past_orders",
  STRIPE_CONFIG: "stripe_demo_credentials_config",
} as const;

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("local-storage-change"));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new Event("local-storage-change"));
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}
