"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EmbedContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          No embed URL provided.
        </p>
      </div>
    );
  }

  // Basic validation to prevent XSS (javascript: URIs)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Invalid embed URL.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white dark:bg-black">
      <iframe
        src={url}
        className="w-full h-full border-none"
        title="Payment Embed"
        allow="payment"
      />
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading payment gateway...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
