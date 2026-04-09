"use client";

import { useState } from "react";
import { axiosClient } from "@/utils/axiosClient";

export default function SocialLoginDemo() {
  const [providers] = useState(["github", "google", "facebook"]);
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (driver: string) => {
    try {
      setLoading(driver);
      const res = await axiosClient.post(`/v1/auth/user/social/${driver}/redirect`);
      if (res.data?.data?.redirect_url) {
        window.location.href = res.data.data.redirect_url;
      }
    } catch (error) {
      console.error("Failed to get redirect url", error);
      alert("Failed to get redirect URL. Is the driver configured correctly?");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or sign in with a social provider
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => handleLogin(provider)}
                disabled={loading === provider}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 capitalize"
              >
                {loading === provider ? "Loading..." : `Sign in with ${provider}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
