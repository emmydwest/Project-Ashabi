import type { Metadata } from "next";
import Link from "next/link";
import { EyeOff, Globe, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection (NDPR / GDPR / CCPA)",
  description:
    "How Project Ashabi protects reader privacy, minimizes data collection, and complies with the Nigeria Data Protection Regulation (NDPR), GDPR, and CCPA.",
};

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20have%20a%20question%20regarding%20Privacy%20and%20Data%20Protection%20on%20Project%20Ashabi.";

export default function PrivacyPage() {
  return (
    <main
      id="main"
      className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-12 pb-28 space-y-12"
    >
      {/* Header Banner */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.3)] text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--gold-bright)]">
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy by Design · NDPR · GDPR · CCPA Compliant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ivory)] m-0">
          Privacy &amp; Data Protection Policy
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed m-0">
          Effective Date: October 2026 · Last Updated: October 2026. Project
          Ashabi is built on a{" "}
          <strong className="text-[var(--ivory)]">
            Zero-Account, Privacy-First
          </strong>{" "}
          architecture. You can read comics, manhwa, manga, and novels on
          Project Ashabi without registering an account, providing a password,
          or submitting financial details.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link
            href="/terms"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--ivory)] hover:border-[var(--border-gold)] transition-colors"
          >
            Terms &amp; DMCA Policy
          </Link>
          <Link
            href="/cookies"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--ivory)] hover:border-[var(--border-gold)] transition-colors"
          >
            Cookie &amp; Consent Policy
          </Link>
          <Link
            href="/welcome"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--gold-bright)] hover:border-[var(--border-gold)] transition-colors"
          >
            Founder’s Note
          </Link>
        </div>
      </header>

      {/* Core Privacy Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <EyeOff className="w-5 h-5 text-[var(--gold-bright)]" />
          <h2 className="text-base font-bold text-[var(--ivory)] m-0">
            No Sale of Personal Data
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
            We never sell, rent, broker, or trade reader personal data to third
            party advertisers or data brokers under any circumstances.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <ShieldCheck className="w-5 h-5 text-[var(--gold-bright)]" />
          <h2 className="text-base font-bold text-[var(--ivory)] m-0">
            Local Browser Storage First
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
            Reading preferences, preferred chapter language, 18+ age
            confirmation, and consent choices are stored locally in your own
            browser (`localStorage`).
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <Globe className="w-5 h-5 text-[var(--gold-bright)]" />
          <h2 className="text-base font-bold text-[var(--ivory)] m-0">
            Server-Side API Shielding
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
            Catalog metadata requests are cached and rate-limited server-side so
            your personal identity is not sold or exposed across external networks.
          </p>
        </div>
      </section>

      {/* Detailed Sections */}
      <div className="space-y-10 text-sm sm:text-base text-[var(--ivory)]/85 leading-relaxed">
        <section className="space-y-3 border-b border-white/10 pb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            1. Information We Collect &amp; How It Is Stored
          </h2>
          <p className="m-0">
            We practice strict data minimization in compliance with the Nigeria
            Data Protection Regulation (NDPR), the EU General Data Protection
            Regulation (GDPR), and the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="space-y-2.5 pl-5 list-disc text-[var(--ivory)]/80">
            <li>
              <strong className="text-[var(--ivory)]">
                Device-Local Preferences (`localStorage` &amp; Session Storage):
              </strong>{" "}
              To deliver a seamless reading experience without requiring an
              account, your browser stores local keys for your chosen reading
              language, book reader theme (Parchment, Sepia, Night), 18+ age
              gate verification, African Platform notice acknowledgment, and
              cookie consent banner status. This data remains on your device and
              can be cleared at any time in your browser settings.
            </li>
            <li>
              <strong className="text-[var(--ivory)]">
                Standard Server &amp; Edge Logs:
              </strong>{" "}
              Like all web applications, our hosting provider processes standard
              HTTP request headers (such as anonymized IP address, browser
              user-agent, and requested URL path) strictly for rate limiting, DDoS
              mitigation, and security diagnostics.
            </li>
            <li>
              <strong className="text-[var(--ivory)]">
                Voluntary Direct Communications:
              </strong>{" "}
              If you voluntarily contact the Founder via WhatsApp or submit a
              rights/content report, we use the information you provide solely to
              respond to your inquiry.
            </li>
          </ul>
        </section>

        <section className="space-y-3 border-b border-white/10 pb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            2. Third-Party Content Delivery Networks (CDNs)
          </h2>
          <p className="m-0">
            When you view cover art, chapter panels, or embedded video trailers
            for third-party demonstration titles or public-domain books, your
            browser may fetch media assets from verified public content delivery
            networks (such as Project Gutenberg, AniList, MangaDex, or
            YouTube’s privacy-enhanced `youtube-nocookie.com` embed player).
            These external CDNs receive standard HTTP asset requests necessary
            to deliver the image or video stream to your screen.
          </p>
        </section>

        <section className="space-y-3 border-b border-white/10 pb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            3. Children’s Privacy &amp; 18+ Age Protection
          </h2>
          <p className="m-0">
            Project Ashabi does not knowingly collect personal identifiable
            information from children under the age of 13. Furthermore, our{" "}
            <strong className="text-[var(--ivory)]">18+ Mature Hub</strong> is
            strictly segregated behind a mandatory age-verification confirmation
            screen and is prohibited for anyone under eighteen (18) years of
            age.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <UserCheck className="w-4 h-4" />
            <span>Your Data Rights</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            4. Your Rights Under NDPR, GDPR &amp; CCPA
          </h2>
          <p className="m-0">
            You have the right to inspect, clear, or reset all local reading and
            consent data stored by Project Ashabi at any time. You can clear
            your site data directly through your browser or via the reset button
            on our{" "}
            <Link
              href="/cookies"
              className="text-[var(--gold-bright)] underline font-semibold"
            >
              Cookie &amp; Consent Policy
            </Link>{" "}
            page. For any privacy questions, contact the Founder directly:
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Contact the Founder on WhatsApp (+234 904 896 4270)"
              className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center shrink-0"
            >
              <Icon name="whatsapp" size={18} />
            </a>
            <span className="text-xs text-[var(--text-muted)]">
              Direct Privacy &amp; Data Protection Contact
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
