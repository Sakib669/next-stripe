"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StripeConfig } from "../lib/types";
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from "../lib/storage";

interface StripeConfigContextType {
  config: StripeConfig;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  saveConfig: (publishableKey: string, secretKey: string) => void;
  clearConfig: () => void;
  hasValidKeys: boolean;
  serverFallbackAvailable: boolean;
  serverPublishableKey: string | null;
}

const DEFAULT_CONFIG: StripeConfig = {
  publishableKey: "",
  secretKey: "",
  isConfigured: false,
  updatedAt: null,
};

const StripeConfigContext = createContext<StripeConfigContextType | undefined>(undefined);

export function StripeConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StripeConfig>(DEFAULT_CONFIG);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [serverFallbackAvailable, setServerFallbackAvailable] = useState(false);
  const [serverPublishableKey, setServerPublishableKey] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getFromStorage<StripeConfig>(STORAGE_KEYS.STRIPE_CONFIG, DEFAULT_CONFIG);
    setConfig(loaded);
    setIsHydrated(true);

    // Check if server side environment fallback is configured
    fetch("/api/checkout/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.serverConfigured) {
          setServerFallbackAvailable(true);
          if (data.publishableKey) {
            setServerPublishableKey(data.publishableKey);
          }
        }
      })
      .catch(() => {
        // Status endpoint is optional
      });
  }, []);

  const saveConfig = (publishableKey: string, secretKey: string) => {
    const trimmedPub = publishableKey.trim();
    const trimmedSec = secretKey.trim();
    const updated: StripeConfig = {
      publishableKey: trimmedPub,
      secretKey: trimmedSec,
      isConfigured: Boolean(trimmedPub && trimmedSec),
      updatedAt: new Date().toISOString(),
    };
    setConfig(updated);
    saveToStorage(STORAGE_KEYS.STRIPE_CONFIG, updated);
  };

  const clearConfig = () => {
    setConfig(DEFAULT_CONFIG);
    removeFromStorage(STORAGE_KEYS.STRIPE_CONFIG);
  };

  const hasValidKeys =
    serverFallbackAvailable ||
    Boolean(config.isConfigured && config.secretKey.startsWith("sk_test_"));

  return (
    <StripeConfigContext.Provider
      value={{
        config,
        isDrawerOpen,
        setIsDrawerOpen,
        saveConfig,
        clearConfig,
        hasValidKeys,
        serverFallbackAvailable,
        serverPublishableKey,
      }}
    >
      {children}
    </StripeConfigContext.Provider>
  );
}

export function useStripeConfig() {
  const context = useContext(StripeConfigContext);
  if (!context) {
    throw new Error("useStripeConfig must be used within a StripeConfigProvider");
  }
  return context;
}
