"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { Icon } from "@/components/icons";

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20am%20a%20creator%20or%20partner%20interested%20in%20Project%20Ashabi%20Originals.";

interface Props {
  contentType?: "Manhwa / Manga" | "Novel / Book";
}

export function AfricanOriginalsReaderNotice({
  contentType = "Manhwa / Manga",
}: Props) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="african-originals-notice-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="liquid-glass-gold max-w-lg w-full rounded-[28px] p-6 sm:p-8 space-y-5 shadow-[0_32px_90px_rgba(0,0,0,0.9)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)] border border-[rgba(245,189,67,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ashabi Originals Vision Notice</span>
        </div>

        <h2
          id="african-originals-notice-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] leading-tight m-0"
        >
          Built for Original African Stories
        </h2>

        <div className="space-y-3.5 text-sm sm:text-base text-[var(--text)] leading-relaxed">
          <p className="m-0">
            <strong className="text-[var(--ivory)]">Project Ashabi</strong> is
            designed to be the home of original African comics, webtoons,
            graphic novels, and fiction.
          </p>
          <p className="m-0">
            The third-party {contentType} catalogue you are about to read is
            temporary preview content integrated to demonstrate our reading
            experience.{" "}
            <strong className="text-[var(--gold-bright)]">
              Little by little, third-party titles will be phased out and
              replaced exclusively by Ashabi Originals
            </strong>{" "}
            created by African writers, illustrators, and storytellers.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="neu-pill-active inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer"
            >
              <span>I Understand — Continue Reading</span>
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Creator or Partner? Message the Founder on WhatsApp"
              className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center shrink-0"
            >
              <Icon name="whatsapp" size={18} />
            </a>
          </div>

          <Link
            href="/?explore=1"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-bright)] hover:underline"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore African Originals</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
