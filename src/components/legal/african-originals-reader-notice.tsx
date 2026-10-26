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
      <div className="liquid-glass-gold max-w-md w-full rounded-2xl p-6 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)] border border-[rgba(245,189,67,0.3)]">
          <Sparkles className="w-3 h-3" />
          <span>Ashabi Originals Notice</span>
        </div>

        <h2
          id="african-originals-notice-title"
          className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-strong)] leading-tight m-0"
        >
          Built for Original African Stories
        </h2>

        <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text)] leading-relaxed">
          <p className="m-0">
            <strong className="text-[var(--ivory)]">Project Ashabi</strong> is
            being built as the home of original African comics, webtoons,
            graphic novels, and fiction.
          </p>
          <p className="m-0">
            This third-party {contentType} title is temporary preview content.{" "}
            <strong className="text-[var(--gold-bright)]">
              Step by step, third-party titles will be phased out and replaced
              exclusively by Ashabi Originals
            </strong>{" "}
            created by African writers and artists.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="neu-pill-active px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer"
            >
              Continue to Read
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Message the Founder on WhatsApp"
              className="whatsapp-glass-btn w-8 h-8 rounded-full grid place-items-center shrink-0"
            >
              <Icon name="whatsapp" size={15} />
            </a>
          </div>

          <Link
            href="/welcome"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--gold-bright)] hover:underline"
          >
            <Compass className="w-3 h-3" />
            <span>Founder’s Vision</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
