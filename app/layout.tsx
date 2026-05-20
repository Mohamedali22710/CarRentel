import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import Footer from "@/components/Footer";
// تأكد من إنشاء هذا الملف كما شرحنا

// إعداد الخطوط
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// معلومات الموقع (SEO)
export const metadata: Metadata = {
  title: "Car Rental | Modern Fleet",
  description: "Find, book, or rent a car — quickly and easily!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 
       1. أضفنا suppressHydrationWarning عشان next-themes ميعملش Warning في الكونسول
       2. أضفنا متغيرات الخطوط في الـ html
    */
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white dark:bg-black-100 transition-colors duration-300">
        {/* 
           تغليف الـ children بالـ Providers يضمن وصول حالة الـ Dark Mode 
           لكل المكونات داخل المشروع
        */}
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}