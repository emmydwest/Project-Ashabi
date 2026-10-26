"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const CONSENT_STORAGE_KEY = "ashabi_cookie_consent_v1";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  function acceptConsent(mode: "all" | "essential") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie, privacy, and legal consent notice"
      data-hide-in-reader-mode="true"
      className="fixed bottom-16 md:bottom-4 inset-x-3 sm:inset-x-6 z-50 max-w-4xl mx-auto rounded-2xl border border-[rgba(245,189,67,0.3)] bg-[#070b10]/95 backdrop-blur-2xl px-4 py-3.5 sm:px-6 sm:py-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="space-y-1 text-xs text-[var(--ivory)]/85 leading-relaxed">
          <div className="inline-flex items-center gap-1.5 font-extrabold uppercase tracking-[0.16em] text-[10px] text-[var(--gold-bright)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Consent, Privacy &amp; Third-Party Content Notice</span>
          </div>
          <p className="m-0">
            We use strictly necessary browser storage for language preferences
            and age verification. Third-party comics, manga, and novels are
            syndicated via public APIs for reader demonstration without claim of
            ownership. By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[var(--gold-bright)] underline font-semibold"
            >
              Terms &amp; DMCA Policy
            </Link>
            ,{" "}
            <Link
              href="/privacy"
              className="text-[var(--gold-bright)] underline font-semibold"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/cookies"
              className="text-[var(--gold-bright)] underline font-semibold"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => acceptConsent("essential")}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/15 bg-white/[0.04] text-[var(--ivory)] hover:border-white/30 transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => acceptConsent("all")}
            className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[var(--gold-bright)] text-[#070a0f] hover:bg-[#ffd26a] transition-colors cursor-pointer"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </aside>
  );
}
