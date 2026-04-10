"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { axiosClient } from "@/utils/axiosClient";
import SocialLogins from "@/components/auth/SocialLogins";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axiosClient.post("/v1/auth/login", data);
      console.log("Login success", res.data);
      // Here you would typically store the token and redirect
      // e.g., localStorage.setItem('token', res.data.access_token);
      window.location.href = "/";
    } catch (err: unknown) {
      console.error("Login failed", err);
      setErrorMsg((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {errorMsg}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message as string}</span>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message as string}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <SocialLogins />

        <div className="text-center mt-6">
            <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Don&apos;t have an account? Register here.
            </Link>
        </div>
      </div>
    </div>
  );
}
