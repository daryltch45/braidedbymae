"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "services", hash: "services" },
  { key: "reviews", hash: "reviews" },
  { key: "portfolio", hash: null }, // separate page
  { key: "booking", hash: null }, // separate page
  { key: "about", hash: null }, // separate page
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
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to hash after navigation (handles cross-page hash navigation)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // Small delay to let the page render
      const timeout = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  // Close lang dropdown on outside click or Escape
  useEffect(() => {
    if (!langOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [langOpen]);

  const currentLocale = pathname.split("/")[1] || "fr";

  function switchLocale(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  // Check if we're on the home page (locale root)
  const isHomePage = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  function getNavHref(link: (typeof navLinks)[number]) {
    if (link.hash === null) return `/${currentLocale}/${link.key}`;
    return `/${currentLocale}#${link.hash}`;
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[number]) {
    if (link.hash === null) return; // booking link — let normal navigation happen

    e.preventDefault();

    if (isHomePage) {
      // Already on home page — just scroll to the section
      const el = document.getElementById(link.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home page, then scroll after page loads
      router.push(`/${currentLocale}#${link.hash}`);
    }
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
            <a href={`/${currentLocale}`} className="font-display text-xl font-bold text-foreground cursor-pointer transition-colors duration-200 hover:text-primary">
              BraidedByMae
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={getNavHref(link)}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Social links */}
              <div className="hidden md:flex items-center gap-1 mr-2">
                <a
                  href="https://www.instagram.com/mae_braided/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@braidedbymae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.55a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.01z" />
                  </svg>
                </a>
              </div>

              {/* Language switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                  aria-label="Switch language"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{currentLocale}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 rounded-xl bg-surface shadow-[var(--shadow-elevated)] border border-foreground/10 py-1 min-w-[80px]">
                    {locales.map((locale) => (
                      <button
                        key={locale.code}
                        onClick={() => switchLocale(locale.code)}
                        className={cn(
                          "block w-full px-4 py-2 text-left text-sm transition-colors duration-200 cursor-pointer",
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
                  className="rounded-full p-2 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
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
                className="md:hidden rounded-full p-2 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
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
                href={getNavHref(link)}
                onClick={(e) => {
                  handleNavClick(e, link);
                  setMobileOpen(false);
                }}
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
