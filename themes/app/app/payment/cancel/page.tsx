"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import axiosClient from "../../../utils/axiosClient";
import axios from "axios";

function CancelContent() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Cancelling your payment...");
  const [resultParams, setResultParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!processedRef.current) {
      processedRef.current = true;

      const processCancel = async () => {
        // Collect URL parameters
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        setResultParams(params);

        const module = sessionStorage.getItem("payment_module") || searchParams.get("module");
        const transactionId = sessionStorage.getItem("payment_history_id") || searchParams.get("transactionId") || searchParams.get("paymentHistoryId");

        if (!module || !transactionId) {
          setStatus("error");
          setMessage("Missing payment module or transaction ID context.");
          return;
        }

        try {
          let res;
          if (module === "subscription") {
            // Subscription module uses GET for cancel
            res = await axiosClient.get(`/v1/subscription/${module}/cancel/${transactionId}`, {
              params,
            });
          } else {
            // General payment module uses POST for cancel
            res = await axiosClient.post(`/v1/payment/${module}/cancel/${transactionId}`, params);
          }

          if (res.data?.success || res.data?.status === "success" || res.status === 200 || res.status === 400) {
            // Payment cancel api might return 400 with a message "Payment has been cancelled!"
            setStatus("success");
            setMessage(res.data?.message || "Payment cancelled successfully.");
          } else {
            setStatus("error");
            setMessage(res.data?.message || "Payment cancellation failed.");
          }
        } catch (err: unknown) {
          setStatus("error");
          // If the backend returns 400 intentionally for cancel (e.g. PaymentController::cancel)
          if (axios.isAxiosError(err) && err.response?.status === 400) {
            setStatus("success");
            setMessage(err.response.data?.message || "Payment has been cancelled.");
          } else if (axios.isAxiosError(err) && err.response?.data?.message) {
            setMessage(err.response.data.message);
          } else {
            setMessage("An error occurred while cancelling the payment.");
          }
        }
      };

      processCancel();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${
            status === "success" || status === "error" ? "text-red-600 dark:text-red-400" :
            "text-blue-600 dark:text-blue-400"
          }`}>
            {status !== "loading" ? "Payment Cancelled" : "Processing Cancel"}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {message}
          </p>
        </div>

        {Object.keys(resultParams).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Gateway Parameters:</h3>
            <pre className="mt-4 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(resultParams, null, 2)}
            </pre>
          </div>
        )}

        {status !== "loading" && (
          <div className="mt-6 text-center">
             <a href="/" className="text-blue-600 hover:underline dark:text-blue-400">
               Return to Home
             </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
