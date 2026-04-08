"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReturnContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("Processing payment...");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Collect all query params to display them
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setData(params);
    setStatus("Payment completed or redirected back.");
  }, [searchParams]);

  return (
    <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Return</h1>
      <p className="text-zinc-700 dark:text-zinc-300 mb-6">{status}</p>

      {data && Object.keys(data).length > 0 && (
        <div className="text-left bg-zinc-100 dark:bg-black p-4 rounded-lg overflow-auto">
          <pre className="text-xs text-zinc-800 dark:text-zinc-400">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <a href="/payment" className="mt-6 inline-block py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors">
        Back to Demo
      </a>
    </div>
  );
}

export default function PaymentReturn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}
