"use client";

import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from 'next-intl';
import { use } from 'react';

import "./globals.css";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
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
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Use React.use() to unwrap the params Promise
  const { locale } = use(params);
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {/* Wrap components with NextIntlClientProvider */}
            <NextIntlClientProvider locale={locale} messages={use(import(`../../messages/${locale}.json`))}>
              <NavBar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </NextIntlClientProvider>
          </QueryClientProvider>
        </SessionProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}