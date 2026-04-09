"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { axiosClient } from "@/utils/axiosClient";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      const id = searchParams.get("id");
      const hash = searchParams.get("hash");

      if (!id || !hash) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await axiosClient.post(`/v1/auth/user/email/verify/${id}/${hash}`);
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully.");
      } catch (err: unknown) {
        console.error("Verification failed", err);
        setStatus("error");
        setMessage((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8">
          {status === "loading" && (
            <div className="text-indigo-600 animate-pulse">
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md">
              <p className="font-medium">{message}</p>
              <div className="mt-4">
                <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Go to Login
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              <p className="font-medium">{message}</p>
              <div className="mt-4 flex flex-col space-y-2">
                <Link href="/resend-verification" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                  Resend Verification Email
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
