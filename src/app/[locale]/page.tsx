import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 px-4">
        <p className="font-accent text-xl text-accent">
          {t("tagline")}
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-foreground">
          BraidedByMae
        </h1>
        <p className="text-lg text-muted whitespace-pre-line">
          {t("headline")}
        </p>
        <a
          href="#booking"
          className="inline-block px-8 py-4 rounded-full font-semibold text-white bg-primary transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </a>
      </div>
    </main>
  );
}
