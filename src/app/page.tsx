'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [urlPath, setUrlPath] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlPath) {
      router.push(`/${urlPath}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto max-w-4xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-400">
            0txt
          </h1>
          <p className="mb-4 text-2xl text-gray-700 dark:text-gray-300">
            The safest site on the web for storing your text!
          </p>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Enter any URL (e.g., 0txt.com/anything) - If you find it, it&apos;s yours!
          </p>
        </div>

        {/* URL Input Section */}
        <div className="mb-12 rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    0txt.com/
                  </span>
                  <input
                    type="text"
                    value={urlPath}
                    onChange={(e) => setUrlPath(e.target.value)}
                    placeholder="your-secret-notes"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-24 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Go to Notes
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              🔒 End-to-End Encryption
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your notes are encrypted in the browser before being stored.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              🌐 Access Anywhere
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access your notes from any device, anywhere in the world.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              🚫 No Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No account needed. Just choose your URL and start writing.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
        <p>Your privacy is our priority. All notes are encrypted.</p>
      </footer>
    </div>
  );
}
