"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { axiosClient } from "@/utils/axiosClient";

function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const password = watch("password");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setErrorMsg("Invalid or missing reset token.");
    }
  }, [token, email]);

  const onSubmit = async (data: Record<string, string>) => {
    if (!token || !email) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axiosClient.post("/v1/auth/reset-password", {
        ...data,
        token,
        email
      });
      setSuccessMsg(res.data?.message || "Password has been reset successfully.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      console.error("Reset password failed", err);
      setErrorMsg((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center mb-4">
                    Invalid or missing reset token. Please request a new password reset link.
                </div>
                <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                    Go to Forgot Password
                </Link>
            </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded text-sm text-center">
              {successMsg}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message as string}</span>}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                {...register("password_confirmation", {
                    required: "Please confirm your password",
                    validate: value => value === password || "The passwords do not match"
                })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.password_confirmation && <span className="text-red-500 text-xs mt-1">{errors.password_confirmation.message as string}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
