"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export default function ClientProviders({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, any>;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Europe/Madrid"
        >
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
      <Toaster richColors closeButton />
    </SessionProvider>
  );
}
