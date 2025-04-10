"use client";

import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./globals.css";
import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </QueryClientProvider>
        </SessionProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
