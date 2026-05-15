import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinLab AI — Enterprise Financial Intelligence",
  description:
    "AI-assisted ratio analysis, risk scoring, and investment-grade dashboards. Built for institutional financial workflows.",
  applicationName: "FinLab AI",
  keywords: [
    "financial analysis",
    "ratios",
    "enterprise",
    "FinLab AI",
    "AI finance",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0f14",
};

import { AuthProvider } from "@/lib/auth-context";
import { PageAnimatePresence } from "@/components/page-animate-presence";
import LabFinStandaloneAgent from "@/components/labfin-standalone-agent";
import 'katex/dist/katex.min.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased selection:bg-sky-500/30">
        <AuthProvider>
          <PageAnimatePresence>
            {children}
          </PageAnimatePresence>
          <LabFinStandaloneAgent />
        </AuthProvider>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </body>
    </html>
  );
}
