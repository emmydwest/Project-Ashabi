import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Feather, Layers, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Creator Studio & Roster — Coming Soon | Project Ashabi",
  description:
    "Ashabi Creator Studio and original African creator onboarding are currently in active development.",
};

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20am%20a%20creator%20interested%20in%20publishing%20on%20Project%20Ashabi.";

export default function CreatorsPage() {
  return (
    <main
      id="main"
      className="max-w-5xl mx-auto px-6 sm:px-10 py-14 pb-28 space-y-16"
    >
      {/* Coming Soon Hero Header */}
      <section className="space-y-6 border-b border-white/10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)] border border-[rgba(245,189,67,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Portal · Coming Soon (In Development)</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.06] m-0">
          Ashabi Creator Studio &amp; Roster
        </h1>

        <p className="text-base sm:text-lg text-[var(--text)] leading-relaxed max-w-2xl m-0">
          Our dedicated Creator Studio, verified African creator roster, and
          direct episode publishing tools are currently under active
          development. We are building a home where African writers,
          illustrators, comic artists, and animators retain clear credit and IP
          pathways.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/welcome"
            className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Read Founder’s Note</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/?explore=1"
            className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
          >
            <span>Return to Hub</span>
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact the Founder on WhatsApp"
            title="Creator Inquiry? Message the Founder on WhatsApp (+234 904 896 4270)"
            className="whatsapp-glass-btn w-9 h-9 rounded-full grid place-items-center"
          >
            <Icon name="whatsapp" size={16} />
          </a>
        </div>
      </section>

      {/* What Is Coming for Creators */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="neu-card rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.25)] grid place-items-center text-[var(--gold-bright)]">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--gold)] block">
            Coming Soon
          </span>
          <h2 className="text-lg font-bold text-[var(--text-strong)] m-0">
            Vertical &amp; Page Publishing
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed m-0">
            Direct episode uploads for vertical scroll webtoons, graphic novels,
            and serialized prose with mobile-first optimization.
          </p>
        </div>

        <div className="neu-card rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.25)] grid place-items-center text-[var(--gold-bright)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--gold)] block">
            Coming Soon
          </span>
          <h2 className="text-lg font-bold text-[var(--text-strong)] m-0">
            Creator Rights &amp; Attribution
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed m-0">
            Transparent rights records ensuring African storytellers keep clear
            credit and ownership of their original worlds.
          </p>
        </div>

        <div className="neu-card rounded-2xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.25)] grid place-items-center text-[var(--gold-bright)]">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--gold)] block">
            Early Onboarding
          </span>
          <h2 className="text-lg font-bold text-[var(--text-strong)] m-0">
            Ashabi Studios Pathway
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed m-0">
            Promising original series will be incubated for future animation,
            film, and global IP partnerships.
          </p>
        </div>
      </section>
    </main>
  );
}
