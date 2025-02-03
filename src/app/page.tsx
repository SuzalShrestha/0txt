'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            0txt
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
            The safest site on the web for storing your text!
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter any URL (e.g., 0txt.com/anything) - If you find it, it&apos;s yours!
          </p>
        </div>

        {/* URL Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
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
                    className="w-full pl-24 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Notes
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">🔒 End-to-End Encryption</h3>
            <p className="text-gray-600 dark:text-gray-400">Your notes are encrypted in the browser before being stored.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">🌐 Access Anywhere</h3>
            <p className="text-gray-600 dark:text-gray-400">Access your notes from any device, anywhere in the world.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">🚫 No Registration</h3>
            <p className="text-gray-600 dark:text-gray-400">No account needed. Just choose your URL and start writing.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>Your privacy is our priority. All notes are encrypted.</p>
      </footer>
    </div>
  );
}
