import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms of Service, Third-Party Disclaimer & DMCA Policy",
  description:
    "Comprehensive Terms of Service, Third-Party Content Non-Ownership Disclaimer, DMCA Safe Harbor Takedown Policy, and 18+ Age-Verification Governance for Project Ashabi.",
};

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20am%20contacting%20Project%20Ashabi%20regarding%20Terms%20of%20Service%20or%20Rights%20Compliance.";

export default function TermsPage() {
  return (
    <main
      id="main"
      className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-12 pb-28 space-y-12"
    >
      {/* Header Banner */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.3)] text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--gold-bright)]">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Governance · Safe Harbor &amp; Platform Terms</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ivory)] m-0">
          Terms of Service &amp; DMCA Safe Harbor Policy
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed m-0">
          Effective Date: October 2026 · Last Updated: October 2026. Please read
          these Terms of Service carefully before accessing or using{" "}
          <strong className="text-[var(--ivory)]">Project Ashabi</strong>{" "}
          (ashabi.cloud). By accessing or using any part of the platform, you
          acknowledge and agree to be bound by these terms.
        </p>

        {/* Quick Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link
            href="/privacy"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/12 bg-white/[0.03] text-[var(--ivory)] hover:border-[var(--border-gold)] transition-colors"
          >
            Privacy Policy
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

      {/* Critical Legal Protection Notice */}
      <section className="rounded-2xl border border-[rgba(245,189,67,0.3)] bg-[rgba(245,189,67,0.06)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            Important Notice Regarding Third-Party Syndicated Content
          </span>
        </div>
        <p className="text-sm sm:text-base text-[var(--ivory)]/90 leading-relaxed m-0">
          Project Ashabi is an African-founded digital publishing technology
          platform built to champion African comics, graphic novels, and
          original serialized stories. While our in-house{" "}
          <strong>African Launch Originals</strong> are in active production,
          certain global manga, manhwa, comics, and public-domain literary works
          displayed on the platform are indexed dynamically in real time via
          automated third-party APIs and public-domain archives solely to
          demonstrate the platform’s multi-language reader architecture.{" "}
          <strong>
            Project Ashabi claims no ownership or copyright over third-party
            syndicated works.
          </strong>
        </p>
      </section>

      {/* Clauses Grid */}
      <div className="space-y-10 text-sm sm:text-base text-[var(--ivory)]/85 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <FileText className="w-4 h-4" />
            <span>Section 01</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            1. Platform Nature &amp; Third-Party Content Disclaimer
          </h2>
          <p className="m-0">
            Project Ashabi operates as a hybrid digital reading interface and
            publishing showcase. Content accessible through the platform falls
            into three distinct legal categories:
          </p>
          <ul className="space-y-2.5 pl-5 list-disc text-[var(--ivory)]/80">
            <li>
              <strong className="text-[var(--ivory)]">
                Ashabi Original Concept Previews &amp; African Originals:
              </strong>{" "}
              Original intellectual property, artwork, worldbuilding, and prose
              created by or licensed directly to Project Ashabi and its African
              creator collective.
            </li>
            <li>
              <strong className="text-[var(--ivory)]">
                Public-Domain Literary Works (Books &amp; Novels):
              </strong>{" "}
              Classic literature and full-text novels sourced from public-domain
              digital repositories (including Project Gutenberg) where copyright
              has expired in applicable jurisdictions.
            </li>
            <li>
              <strong className="text-[var(--ivory)]">
                Third-Party Syndicated Demonstration Content:
              </strong>{" "}
              Global manga, manhwa, manhua, and comic series metadata, trailers,
              and chapter feeds retrieved dynamically via automated public third
              party indexing APIs. Project Ashabi does not claim ownership over
              any third-party titles, characters, trademarks, or scanlations. All
              trademarks, artwork, and copyrights belong exclusively to their
              respective creators, studios, and original rightsholders.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <ShieldAlert className="w-4 h-4" />
            <span>Section 02</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            2. DMCA Safe Harbor &amp; 24-Hour Copyright Takedown Protocol
          </h2>
          <p className="m-0">
            Project Ashabi respects the intellectual property rights of all
            authors, illustrators, publishers, and licensing studios worldwide
            and complies with the Digital Millennium Copyright Act (17 U.S.C. §
            512), the Nigerian Copyright Act, and international copyright
            treaties.
          </p>
          <p className="m-0">
            Because third-party catalog entries are surfaced via automated API
            queries during our technical demonstration phase, Project Ashabi
            acts strictly as a passive conduit/index for those third-party feeds
            and does not claim ownership of them. If you are a copyright owner
            or an authorized agent and believe that any material indexed or
            displayed on Project Ashabi infringes upon your copyright, you may
            submit a formal takedown notice containing:
          </p>
          <ol className="space-y-2 pl-5 list-decimal text-[var(--ivory)]/80">
            <li>
              Identification of the copyrighted work claimed to have been
              infringed, or a representative list of such works.
            </li>
            <li>
              The specific URL or series identifier on Project Ashabi where the
              material is indexed so we can locate it immediately.
            </li>
            <li>
              Your contact information (name, organization, email address, or
              phone/WhatsApp number).
            </li>
            <li>
              A statement that you have a good-faith belief that use of the
              material in the manner complained of is not authorized by the
              copyright owner, its agent, or the law.
            </li>
          </ol>
          <p className="m-0 font-semibold text-[var(--gold-bright)]">
            Commitment to Rapid Removal: Upon receipt of a valid rights or
            takedown request via our direct Founder governance channel below, we
            will permanently block, delist, and remove the requested title or
            chapter feed within 24 hours.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff8a8a]">
            <AlertTriangle className="w-4 h-4" />
            <span>Section 03</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            3. Age-Restricted Content (18+ Mature Hub) &amp; Viewer
            Responsibility
          </h2>
          <p className="m-0">
            Project Ashabi maintains a segregated{" "}
            <strong className="text-[var(--ivory)]">18+ Mature Hub</strong>{" "}
            protected by a mandatory age-verification gate. By clicking{" "}
            <em>“I am 18 or older”</em> on any mature content verification
            prompt, you affirmatively represent and warrant under penalty of
            applicable law that:
          </p>
          <ul className="space-y-2 pl-5 list-disc text-[var(--ivory)]/80">
            <li>
              You are at least eighteen (18) years of age (or have reached the
              legal age of majority in your jurisdiction, whichever is higher).
            </li>
            <li>
              Accessing mature artistic, dramatic, or adult-rated comic
              literature is legal in your local community and jurisdiction.
            </li>
            <li>
              You will not permit any minor under the age of 18 to view or
              access the 18+ section from your device or browser session.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Section 04</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            4. Acceptable Use, Anti-Scraping &amp; Platform Security
          </h2>
          <p className="m-0">
            You are granted a personal, non-exclusive, non-transferable,
            revocable license to access Project Ashabi strictly for personal,
            non-commercial reading and evaluation. You agree not to:
          </p>
          <ul className="space-y-2 pl-5 list-disc text-[var(--ivory)]/80">
            <li>
              Deploy automated bots, spiders, crawlers, or bulk-downloading
              scripts that bypass our rate limiters or burden platform
              infrastructure.
            </li>
            <li>
              Reproduce, sell, commercialize, or redistribute any Ashabi
              Original artwork, branding, UI code, or third-party syndicated
              content.
            </li>
            <li>
              Attempt to probe, scan, or test the vulnerability of any server,
              proxy, or API route operated by Project Ashabi.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <Scale className="w-4 h-4" />
            <span>Section 05</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            5. Disclaimer of Warranties &amp; Limitation of Liability
          </h2>
          <p className="m-0">
            Project Ashabi is provided on an{" "}
            <strong className="text-[var(--ivory)]">
              “AS IS” and “AS AVAILABLE”
            </strong>{" "}
            basis during its public beta and African Originals transition phase.
            To the fullest extent permitted by applicable law, Project Ashabi,
            its founder, contributors, and affiliates disclaim all warranties,
            express or implied, including without limitation implied warranties
            of merchantability, fitness for a particular purpose, title, and
            non-infringement.
          </p>
          <p className="m-0">
            In no event shall Project Ashabi or its founder be liable for any
            indirect, incidental, special, consequential, or punitive damages,
            or any loss of data, goodwill, or profits arising out of or related
            to your use of—or inability to use—the platform or any third-party
            syndicated content displayed therein.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ivory)] m-0">
            6. Governing Law &amp; Direct Rights Contact
          </h2>
          <p className="m-0">
            These Terms shall be governed by and construed in accordance with
            the laws of the Federal Republic of Nigeria and applicable
            international digital publishing standards. For any copyright
            inquiries, DMCA takedown requests, partnership proposals, or legal
            notices, contact the Founder directly:
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
              Direct Founder Governance Line · Response within 24 hours
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
