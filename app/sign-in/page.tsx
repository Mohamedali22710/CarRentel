"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = login(email, password);
      if (res.success) {
        setSuccess("Success! Logging you in...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-100 to-slate-200 dark:from-gray-900 dark:to-black px-6 py-24 transition-colors duration-300">
      <div className="relative w-full max-w-md">
        {/* Decorative background blurs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob delay-2000"></div>

        {/* Card */}
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/20 dark:border-gray-800/80 rounded-3xl shadow-2xl p-8 transition-colors">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
              CarRent
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage your bookings and fleet</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-shake">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
                ✅ {success}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform active:scale-98 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Test Accounts Tip */}
          <div className="mt-6 p-4 bg-blue-50/50 dark:bg-gray-800/40 border border-blue-100 dark:border-gray-800 rounded-2xl text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <span className="font-bold text-blue-700 dark:text-blue-400">💡 Quick Test Accounts:</span>
            <div className="flex justify-between">
              <span>Admin: <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded">admin@carrent.com</code></span>
              <span>Pass: <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded">admin123</code></span>
            </div>
            <div className="flex justify-between">
              <span>User: <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded">user@carrent.com</code></span>
              <span>Pass: <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded">user123</code></span>
            </div>
          </div>

          <div className="mt-6 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
