"use client";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  );
}