import localFont from "next/font/local";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  // Carga de mensajes de i18n en el Server Component
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Envolvemos todo lo que necesite hooks/imports dinámicos */}
        <ClientProviders locale={locale} messages={messages}>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
