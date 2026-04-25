import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Dancing_Script } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { CustomThemeProvider } from "@/components/providers/ThemeProvider";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SmoothScroll from "@/components/providers/SmoothScroll";
import PageRemount from "@/components/providers/PageRemount";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://braidedbymae.de";
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", de: "/de" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "BraidedByMae",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmSans.variable} ${dancingScript.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:font-semibold"
        >
          Skip to content
        </a>
        <CustomThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SmoothScroll>
              <Header />
              <PageRemount>
                <div id="main-content" className="flex-1">{children}</div>
              </PageRemount>
              <Footer />
            </SmoothScroll>
          </NextIntlClientProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
