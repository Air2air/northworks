import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/ui/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Northworks - Cross-Domain Content Platform",
  description: "Unified platform for classical music content and professional portfolio data with cross-domain search capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">
              Northworks - Demonstrating cross-domain content architecture and unified search
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
