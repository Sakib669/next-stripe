"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Order } from "../lib/types";
import { getFromStorage, saveToStorage, STORAGE_KEYS } from "../lib/storage";

interface OrdersContextType {
  orders: Order[];
  saveOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string,
    status: Order["paymentStatus"],
    details?: {
      stripeSessionId?: string;
      stripePaymentIntentId?: string;
      customerEmail?: string;
    }
  ) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    setOrders(stored);
  }, []);

  const saveOrder = useCallback((newOrder: Order) => {
    setOrders((prev) => {
      const existingIndex = prev.findIndex((o) => o.id === newOrder.id);
      let updated: Order[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = newOrder;
      } else {
        updated = [newOrder, ...prev];
      }
      saveToStorage(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback(
    (
      orderId: string,
      status: Order["paymentStatus"],
      details?: {
        stripeSessionId?: string;
        stripePaymentIntentId?: string;
        customerEmail?: string;
      }
    ) => {
      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              paymentStatus: status,
              stripeSessionId: details?.stripeSessionId ?? order.stripeSessionId,
              stripePaymentIntentId:
                details?.stripePaymentIntentId ?? order.stripePaymentIntentId,
              customerEmail: details?.customerEmail ?? order.customerEmail,
            };
          }
          return order;
        });
        saveToStorage(STORAGE_KEYS.ORDERS, updated);
        return updated;
      });
    },
    []
  );

  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      return orders.find((o) => o.id === orderId);
    },
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        saveOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
