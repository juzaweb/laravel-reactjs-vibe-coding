import Link from "next/link";

export default function LoginOptions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in
          </h2>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/login/email"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign in with Email
          </Link>
          <Link
            href="/login/social"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sign in with Social Providers
          </Link>
        </div>
        <div className="mt-4 text-center">
            <Link href="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Don&apos;t have an account? Register here.
            </Link>
        </div>
      </div>
    </div>
  );
}
