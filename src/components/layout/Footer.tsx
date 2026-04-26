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
    <footer className="bg-secondary text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-accent text-2xl text-accent tracking-tight">
              BraidedByMae
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {tAbout("cities")}
            </p>
          </div>

          {/* Social links */}
          <div className="space-y-3 flex flex-col items-center text-center">
            <h4 className="text-sm font-semibold text-accent">
              {tContact("title")}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/mae_braided/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2.5 text-white/50 hover:text-primary hover:bg-white/5 transition-all duration-200 cursor-pointer"
                aria-label={tContact("instagram")}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@braidedbymae"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2.5 text-white/50 hover:text-primary hover:bg-white/5 transition-all duration-200 cursor-pointer"
                aria-label={tContact("tiktok")}
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:text-right">
            <div className="flex flex-col gap-1.5 text-sm text-white/50">
              <a href="#" className="hover:text-accent transition-colors duration-200 cursor-pointer">
                {t("legal")}
              </a>
              <a href="#" className="hover:text-accent transition-colors duration-200 cursor-pointer">
                {t("privacy")}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; 2026 BraidedByMae. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
