"use client";

import React, { useState, useEffect } from "react";
import { useStripeConfig } from "../context/StripeConfigContext";
import {
  Key,
  ShieldCheck,
  AlertTriangle,
  X,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  CreditCard,
} from "lucide-react";

export function CredentialsDrawer() {
  const {
    config,
    isDrawerOpen,
    setIsDrawerOpen,
    saveConfig,
    clearConfig,
    serverFallbackAvailable,
  } = useStripeConfig();

  const [pubKey, setPubKey] = useState(config.publishableKey);
  const [secKey, setSecKey] = useState(config.secretKey);
  const [copiedCard, setCopiedCard] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showOverride, setShowOverride] = useState(false);

  useEffect(() => {
    setPubKey(config.publishableKey);
    setSecKey(config.secretKey);
  }, [config]);

  if (!isDrawerOpen) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(pubKey, secKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyTestCard = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText("4242424242424242")
        .then(() => {
          setCopiedCard(true);
          setTimeout(() => setCopiedCard(false), 2000);
        })
        .catch((err) => {
          console.warn("Failed to copy card to clipboard:", err);
        });
    }
  };

  const isPubValid = pubKey.startsWith("pk_test_");
  const isSecValid = secKey.startsWith("sk_test_");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-16 sm:pt-20 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-light text-cobalt">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                Stripe Sandbox Configuration
              </h2>
              <p className="text-xs text-zinc-500">
                Payment environment and test credentials status
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="mt-4">
          {serverFallbackAvailable ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 space-y-1">
                <p className="font-semibold text-sm">Loaded from .env file</p>
                <p className="text-emerald-800">
                  Your Stripe test credentials are active directly from the server environment. No frontend entry is required.
                </p>
              </div>
            </div>
          ) : config.isConfigured ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 space-y-1">
                <p className="font-semibold text-sm">Browser storage keys active</p>
                <p className="text-emerald-800">
                  Using custom credentials saved in your local browser storage.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <p className="font-semibold text-sm">No sandbox keys detected</p>
                <p className="text-amber-800">
                  Please add SECRET_KEY in your .env file or enter test keys below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Test Card Helper */}
        <div className="mt-4 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700">
                Stripe Test Card:
              </span>
              <code className="text-xs font-mono font-medium text-zinc-900 bg-zinc-200/60 px-2 py-0.5 rounded">
                4242 4242 4242 4242
              </code>
            </div>
            <button
              type="button"
              onClick={copyTestCard}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 border border-zinc-200 hover:bg-zinc-50 shadow-xs transition"
            >
              {copiedCard ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
            Use any date in the future and any 3 digits for CVC during test checkout.
          </p>
        </div>

        {/* Optional Manual Override Toggle */}
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={() => setShowOverride(!showOverride)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1"
          >
            <span>{showOverride ? "Hide manual override" : "Custom browser keys override (optional)"}</span>
          </button>

          {showOverride && (
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Stripe Publishable Key
                </label>
                <input
                  type="text"
                  placeholder="pk_test_51..."
                  value={pubKey}
                  onChange={(e) => setPubKey(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt transition"
                />
                {pubKey && !isPubValid && (
                  <p className="mt-1 text-xs text-amber-600">
                    Notice: Sandbox publishable keys typically begin with &apos;pk_test_&apos;
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                  Stripe Secret Key
                </label>
                <input
                  type="password"
                  placeholder="sk_test_51..."
                  value={secKey}
                  onChange={(e) => setSecKey(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt transition"
                />
                {secKey && !isSecValid && (
                  <p className="mt-1 text-xs text-amber-600">
                    Notice: Sandbox secret keys must begin with &apos;sk_test_&apos;
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-cobalt px-5 py-2.5 text-sm font-medium text-white hover:bg-cobalt-hover shadow-sm transition active:scale-[0.98]"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" /> Saved Successfully
                    </>
                  ) : (
                    "Save Override"
                  )}
                </button>

                {config.isConfigured && (
                  <button
                    type="button"
                    onClick={clearConfig}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear Override
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Stripe link */}
        <div className="mt-4 flex justify-end">
          <a
            href="https://dashboard.stripe.com/test/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cobalt hover:underline"
          >
            Find keys in your Stripe Dashboard <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
