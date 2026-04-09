"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useRef } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    if (!processedRef.current) {
      processedRef.current = true;
      // You can do any side effects here if needed
    }
  }, [searchParams]);

  // Render params directly
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your payment was cancelled or failed.
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Return Parameters:</h3>
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
