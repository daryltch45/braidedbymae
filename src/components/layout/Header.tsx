"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "services", href: "#services" },
  { key: "portfolio", href: "#portfolio" },
  { key: "booking", href: "#booking" },
  { key: "reviews", href: "#reviews" },
] as const;

const locales = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLocale = pathname.split("/")[1] || "fr";

  function switchLocale(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href={`/${currentLocale}`} className="font-display text-xl font-bold text-foreground">
              BraidedByMae
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
                  aria-label="Switch language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{currentLocale}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 rounded-lg bg-surface shadow-lg border border-foreground/10 py-1 min-w-[80px]">
                    {locales.map((locale) => (
                      <button
                        key={locale.code}
                        onClick={() => switchLocale(locale.code)}
                        className={cn(
                          "block w-full px-4 py-2 text-left text-sm transition-colors",
                          locale.code === currentLocale
                            ? "text-primary font-medium"
                            : "text-muted hover:text-foreground"
                        )}
                      >
                        {locale.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full p-2 text-muted hover:text-foreground transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden rounded-full p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-xl font-bold text-foreground">
              BraidedByMae
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 text-muted hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-display font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
            {/* Mobile locale switcher */}
            <div className="flex gap-4 mt-8">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => {
                    switchLocale(locale.code);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "text-lg font-medium transition-colors",
                    locale.code === currentLocale
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {locale.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
