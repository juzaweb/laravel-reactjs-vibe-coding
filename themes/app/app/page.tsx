import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">
          Demo Pages
        </h1>

        <ul className="w-full space-y-4">
          <li>
            <Link
              href="/payment"
              className="block w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Payment Demo
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Test the payment flow integration
                  </p>
                </div>
                <div className="text-zinc-400 group-hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="block w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Auth Demo
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Test the authentication flow (Login, Register, Forgot Password, Verify Email)
                  </p>
                </div>
                <div className="text-zinc-400 group-hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </li>
          {/* Add more demo pages here in the future */}
        </ul>
      </main>
    </div>
  );
}
