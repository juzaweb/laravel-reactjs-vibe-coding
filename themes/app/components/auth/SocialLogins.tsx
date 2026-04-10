"use client";

import { useState, useEffect } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";

export default function SocialLogins() {
  const globalSettings = useAppSelector((state) => state.settings.data);
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (globalSettings?.social_login_providers) {
      setProviders(globalSettings.social_login_providers);
    } else {
      setProviders(["github", "google", "facebook"]); // Fallback
    }
  }, [globalSettings]);

  const handleLogin = async (driver: string) => {
    try {
      setLoading(driver);
      const res = await axiosClient.post(`/v1/auth/user/social/${driver}/redirect`);
      if (res.data?.data?.redirect_url) {
        window.location.href = res.data.data.redirect_url;
      }
    } catch (error) {
      console.error("Failed to get redirect url", error);
      toast.error("Failed to get redirect URL. Is the driver configured correctly?");
    } finally {
      setLoading(null);
    }
  };

  if (providers.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {providers.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleLogin(provider)}
            disabled={loading === provider}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 capitalize"
          >
            {loading === provider ? "Loading..." : provider}
          </button>
        ))}
      </div>
    </div>
  );
}
