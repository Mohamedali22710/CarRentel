"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, logout } = useApp();

  // Prevents hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full absolute z-10">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <Link href="/" className="flex justify-center items-center">
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            CarRent
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {/* Dynamic Action Group */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/sign-in"
                className="text-gray-900 dark:text-gray-100 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-blue-600 text-white rounded-full py-2 px-5 font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {user?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="relative inline-flex items-center justify-center px-4 py-2 font-bold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-500 focus:outline-none ring-2 ring-purple-600 ring-offset-2 overflow-hidden group shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                >
                  Admin Dashboard
                </Link>
              )}
              {user?.role !== "admin" && (
                <Link
                  href="/garage"
                  className="text-gray-900 dark:text-gray-100 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  My Garage
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 text-white rounded-full py-2 px-5 font-semibold hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;