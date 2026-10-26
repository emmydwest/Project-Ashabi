import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Database, ShieldCheck } from "lucide-react";
import { CookieResetButton } from "@/components/legal/cookie-reset-button";

export const metadata: Metadata = {
  title: "Cookie & Local Storage Consent Policy",
  description:
    "Detailed Cookie and Browser Local Storage Policy for Project Ashabi, including every local key used for age verification, language selection, and consent.",
};

export default function CookiesPolicyPage() {
  return (
    <main
      id="main"
      className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-12 pb-28 space-y-12"
    >
      {/* Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.3)] text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--gold-bright)]">
          <Cookie className="w-3.5 h-3.5" />
          <span>ePrivacy · NDPR · GDPR Cookie Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ivory)] m-0">
          Cookie &amp; Local Storage Policy
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed m-0">
          Effective Date: October 2026. Project Ashabi uses{" "}
          <strong className="text-[var(--ivory)]">
            strictly necessary browser storage
          </strong>{" "}
          to remember your legal consent choices, 18+ age verification status,
          and preferred reading language. We do not use invasive cross-site
          advertising cookies or behavioral tracking pixels.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link
            href="/terms"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--ivory)] hover:border-[var(--border-gold)] transition-colors"
          >
            Terms &amp; DMCA Policy
          </Link>
          <Link
            href="/privacy"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--ivory)] hover:border-[var(--border-gold)] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </header>

      {/* Transparency Table of Keys */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
          <Database className="w-4 h-4" />
          <span>Complete Inventory of Browser Storage Keys</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/12 bg-white/[0.02]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[var(--ivory)]">
                <th className="p-4 font-bold">Key Name</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Purpose</th>
                <th className="p-4 font-bold">Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[var(--ivory)]/80">
              <tr>
                <td className="p-4 font-mono text-[var(--gold-bright)]">
                  ashabi_cookie_consent_v1
                </td>
                <td className="p-4">Strictly Necessary</td>
                <td className="p-4">
                  Records your acknowledgment of our Cookie, Privacy, and
                  Third-Party Content Terms banner.
                </td>
                <td className="p-4">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-[var(--gold-bright)]">
                  ashabi_mature_verified_18
                </td>
                <td className="p-4">Legal Compliance</td>
                <td className="p-4">
                  Stores your confirmation that you are 18+ years old before
                  displaying the Mature 18+ Hub.
                </td>
                <td className="p-4">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-[var(--gold-bright)]">
                  ashabi_african_platform_notice_seen_v2
                </td>
                <td className="p-4">Functional</td>
                <td className="p-4">
                  Remembers that you have seen the African Originals transition
                  notice inside the chapter reader.
                </td>
                <td className="p-4">Until cleared by user</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-[var(--gold-bright)]">
                  ashabi_preferred_lang
                </td>
                <td className="p-4">Functional</td>
                <td className="p-4">
                  Saves your chosen reading language (e.g., English, French,
                  Spanish, Arabic) across chapters.
                </td>
                <td className="p-4">Until cleared by user</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Instant Reset Section */}
      <section className="rounded-2xl border border-white/12 bg-white/[0.025] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
          <ShieldCheck className="w-4 h-4" />
          <span>Manage or Withdraw Consent Instantly</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[var(--ivory)] m-0">
          One-Click Local Storage &amp; Consent Reset
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed m-0">
          You can clear all Project Ashabi consent flags, 18+ age verification
          tokens, and language preferences stored in your browser at any time
          using the button below:
        </p>
        <CookieResetButton />
      </section>
    </main>
  );
}
