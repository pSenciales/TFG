import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // params llega como promesa en Next.js
  params: Promise<{ locale: string }>;
}) {
  // Desestructuramos y aguardamos params
  const { locale } = await params;
  // Carga de mensajes de i18n en el Server Component
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className="antialiased min-h-screen flex flex-col">
        <ClientProviders locale={locale} messages={messages}>
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
