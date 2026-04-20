"use client";

import { useTranslations } from "next-intl";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.55a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.01z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const tContact = useTranslations("contact");
  const tAbout = useTranslations("about");

  return (
    <footer className="border-t border-foreground/10 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold text-foreground">
              BraidedByMae
            </h3>
            <p className="text-sm text-muted">
              {tAbout("cities")}
            </p>
          </div>

          {/* Social links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {tContact("title")}
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mae_braided/"
                className="text-muted hover:text-primary transition-colors"
                aria-label={tContact("instagram")}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@braidedbymae"
                className="text-muted hover:text-primary transition-colors"
                aria-label={tContact("tiktok")}
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:text-right">
            <div className="flex flex-col gap-1 text-sm text-muted">
              <a href="#" className="hover:text-foreground transition-colors">
                {t("legal")}
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                {t("privacy")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-foreground/10 text-center text-sm text-muted">
          &copy; 2026 BraidedByMae. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
