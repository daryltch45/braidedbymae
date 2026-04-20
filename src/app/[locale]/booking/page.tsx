import { useTranslations } from "next-intl";

export default function BookingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-accent text-lg text-accent mb-4">BraidedByMae</p>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
        Réservation
      </h1>
      <p className="text-muted text-lg">
        La page de réservation arrive bientôt. 🌿
      </p>
      <a
        href="/"
        className="mt-8 inline-block px-8 py-4 rounded-full font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
      >
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
