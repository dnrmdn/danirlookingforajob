import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerVault - Premium Tracking",
  description: "Track your job applications with a premium, productive interface.",
};

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-on-surface selection:bg-primary/30 selection:text-primary">
        {/* WebGL Background Accent */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-30 mix-blend-screen">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[80px]"></div>
        </div>
        <AuthProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
