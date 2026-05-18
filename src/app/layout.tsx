import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthLinks from "@/app/components/AuthLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Menu Manager",
  description:
    "Manage cafe menu items with clear pricing, availability, and seasonal tags.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50 text-amber-950">
        <header className="border-b border-amber-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
                Cafe Menu Manager
              </p>
              <p className="text-lg font-semibold text-amber-950">
                Daily menu control
              </p>
            </div>
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm font-semibold text-amber-800">
                <Link className="hover:text-amber-950" href="/">
                  Overview
                </Link>
                <Link className="hover:text-amber-950" href="/menu-items">
                  Menu items
                </Link>
              </div>
              <AuthLinks />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-amber-100 bg-white/80">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <span>Built by Rajat Chakraborty</span>
            <div className="flex flex-wrap gap-3">
              <a
                className="font-semibold text-amber-800 hover:text-amber-950"
                href="https://github.com/rajat-k-27"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="font-semibold text-amber-800 hover:text-amber-950"
                href="https://www.linkedin.com/in/rajat-chakraborty-b72aa8219/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
