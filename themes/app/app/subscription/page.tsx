"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Plan {
  uuid: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
  module: string;
}

interface PaymentMethod {
  name: string;
  label: string;
}

export default function SubscriptionDemo() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch plans and methods in parallel
      const [plansRes, methodsRes] = await Promise.all([
        axiosClient.get("/v1/app/subscription/plans"),
        axiosClient.get("/v1/app/subscription/methods")
      ]);

      setPlans(plansRes.data.data || []);
      setMethods(methodsRes.data.data || []);

      if (plansRes.data.data?.length > 0) {
        setSelectedPlan(plansRes.data.data[0].uuid);
      }
      if (methodsRes.data.data?.length > 0) {
        setSelectedMethod(methodsRes.data.data[0].name);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
            router.push("/login?redirect=/subscription");
            return;
        }
        setError(err.message || "Failed to load data");
      } else {
        setError("Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const plan = plans.find(p => p.uuid === selectedPlan);
    if (!plan) return;

    try {
      const res = await axiosClient.post(`/v1/app/subscription/${plan.module}/subscribe`, {
        plan_id: selectedPlan,
        method: selectedMethod,
        return_url: `${window.location.origin}/subscription/return`,
        cancel_url: `${window.location.origin}/subscription/cancel`,
      });

      if (res.data.data?.transaction_id) {
        sessionStorage.setItem("subscription_transaction_id", res.data.data.transaction_id);
      }
      sessionStorage.setItem("subscription_module", plan.module);

      if (res.data.data?.redirect) {
        window.location.href = res.data.data.redirect;
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-10">
          Choose a Subscription Plan
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.uuid}
                className={`relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.uuid
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
                onClick={() => setSelectedPlan(plan.uuid)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedPlan === plan.uuid ? 'border-blue-500 bg-blue-500' : 'border-zinc-300 dark:border-zinc-600'
                  }`}>
                    {selectedPlan === plan.uuid && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">${plan.price}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">/month</span>
                </div>

                {plan.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    {plan.description}
                  </p>
                )}

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Payment Method</h3>
            <div className="space-y-4">
              {methods.map((method) => (
                <label key={method.name} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.name}
                    checked={selectedMethod === method.name}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
                  />
                  <span className="text-zinc-900 dark:text-white font-medium">{method.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedPlan || !selectedMethod}
              className="mt-6 w-full py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              {submitting ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
