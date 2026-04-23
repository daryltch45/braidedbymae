import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden flex items-center justify-center px-4">
      <Image
        src="/images/404/1_404page_not_found.jpg"
        alt=""
        fill
        priority
        aria-hidden
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-background/10 dark:bg-background/55" />

      <div className="relative z-10 text-center max-w-xl">
        <h1 className="font-display font-bold leading-none text-foreground text-[clamp(8rem,22vw,16rem)] drop-shadow-lg">
          404
        </h1>
        <p className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-2">
          {t("title")}
        </p>
        <p className="text-muted text-base md:text-lg mt-4 max-w-md mx-auto">
          {t("description")}
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
