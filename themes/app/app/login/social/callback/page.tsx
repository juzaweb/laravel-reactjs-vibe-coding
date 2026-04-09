"use client";

import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const processedRef = useRef(false);

  useEffect(() => {
    if (!processedRef.current) {
      processedRef.current = true;
      const params = Object.fromEntries(searchParams.entries());
      console.log("Callback params:", params);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Social Login Callback
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Callback received. Check console.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SocialLoginCallbackDemo() {
  return (
    <Suspense fallback={<div>Loading callback...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
