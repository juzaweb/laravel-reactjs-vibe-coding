"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import axios from "axios";

interface PaymentMethod {
  name: string;
  label: string;
  configs?: Record<string, unknown>;
}

export default function PaymentDemo() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [module, setModule] = useState("");
  const [method, setMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<unknown>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/v1/payment-methods/drivers");
      setMethods(res.data.data || []);
      if (res.data.data && res.data.data.length > 0) {
        setMethod(res.data.data[0].name);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.message || "Failed to load payment methods");
      } else {
        setError("Failed to load payment methods");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);
    setError(null);

    try {
      // 1. Checkout to create order and get order_id
      const checkoutRes = await axiosClient.post(`/payment/${module}`, {
        method: method,
      });

      const generatedOrderId = checkoutRes.data.data?.order_id;

      if (!generatedOrderId) {
        throw new Error("Failed to create order: no order_id returned");
      }

      // 2. Purchase with generated order_id
      const response = await axiosClient.post(`/payment/${module}/purchase`, {
        order_id: generatedOrderId,
        method: method,
        return_url: `${window.location.origin}/payment/return`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      });

      setSubmitResult(response.data);

      if (response.data.data?.payment_history_id) {
        sessionStorage.setItem("payment_history_id", response.data.data.payment_history_id);
      }
      sessionStorage.setItem("payment_module", module);

      if (response.data.data?.redirect) {
        window.location.href = response.data.data.redirect;
      } else if (response.data.data?.type === "embed" && response.data.data.embed_url) {
        window.location.href = `/payment/embed?url=${encodeURIComponent(response.data.data.embed_url)}`;
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || "An error occurred");
        }
      } else {
        setError("An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-6">
          Payment Demo
        </h1>

        {loading ? (
          <div className="text-center text-zinc-500">Loading payment methods...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="module" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Module
              </label>
              <input
                id="module"
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="method" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Payment Method
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              >
                {methods.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.label} ({m.name})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {submitResult !== null && !error && (
              <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm break-words">
                Success: {JSON.stringify((submitResult as Record<string, unknown>).message || submitResult)}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              {submitting ? "Processing..." : "Pay Now"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
