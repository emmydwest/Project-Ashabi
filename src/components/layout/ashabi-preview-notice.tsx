"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

const DISMISSED_KEY = "ashabi:preview-notice-ack:v1";

export function AshabiPreviewNotice() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.sessionStorage.getItem(DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });

  function handleDismiss() {
    setIsOpen(false);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
  }

  return (
    <>
      {/* Persistent Top African Heritage & API Preview Bar */}
      <div
        role="region"
        aria-label="Project Ashabi platform notice"
        className="rounded-[20px] border border-[rgba(245,189,67,0.38)] bg-gradient-to-r from-[#171105] via-[#0c131a] to-[#171105] px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-full bg-[rgba(245,189,67,0.18)] border border-[var(--border-gold)] grid place-items-center text-[var(--gold-bright)] shrink-0">
            <Icon name="sparkles" size={16} />
          </span>
          <p className="text-xs sm:text-sm text-[var(--ivory)] m-0 leading-snug">
            <strong className="text-[var(--gold-bright)] font-extrabold">
              Project Ashabi — African Comic &amp; Storytelling Platform:
            </strong>{" "}
            Built for African comics, graphic novels, and creators. Currently
            populated with live{" "}
            <strong className="text-white">AniList Manhwa, Manga &amp; Anime</strong>{" "}
            data to demonstrate the platform experience while our African catalog
            prepares for launch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-[var(--border-gold)] bg-[rgba(245,189,67,0.14)] text-[var(--gold-bright)] hover:bg-[rgba(245,189,67,0.25)] transition-all cursor-pointer"
          >
            Read Platform Note
          </button>
          <Link
            href="/about"
            className="px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 bg-white/[0.04] text-[var(--ivory)] hover:border-[var(--border-gold)]"
          >
            Our African Mission
          </Link>
        </div>
      </div>

      {/* Full-Screen Pre-Load / Welcome Modal */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ashabi-welcome-title"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-[fadeIn_280ms_ease-out]"
        >
          <div className="relative w-full max-w-2xl rounded-[28px] border-2 border-[rgba(245,189,67,0.45)] bg-gradient-to-b from-[#101822] via-[#090e14] to-[#05070a] p-6 sm:p-9 shadow-[0_32px_90px_rgba(0,0,0,0.9)] space-y-6 overflow-hidden">
            {/* Decorative Gold Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.22),transparent_70%)]"
            />

            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[var(--gold)] text-[#140c02]">
                <Icon name="sparkles" size={14} />
                <span>Welcome to Project Ashabi</span>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close welcome notice"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 grid place-items-center text-[var(--text-muted)] hover:text-white hover:border-[var(--border-gold)] cursor-pointer"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <h2
                id="ashabi-welcome-title"
                className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-strong)] leading-tight m-0"
              >
                An African-Themed Home for Comics, Graphic Novels &amp; Mythic
                Fiction
              </h2>
              <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed m-0">
                <strong className="text-[var(--gold-bright)]">
                  Project Ashabi
                </strong>{" "}
                is crafted from the ground up as a premier digital publishing
                platform for{" "}
                <strong className="text-[var(--ivory)]">
                  African comics, Afrofuturist webtoons, graphic novels, and
                  serialized African storytelling
                </strong>
                .
              </p>
            </div>

            <div className="rounded-[20px] border border-[rgba(245,189,67,0.28)] bg-black/45 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
                <Icon name="flame" size={15} />
                <span>Why You See Global Manhwa, Manga &amp; Anime Today</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed m-0">
                To showcase Ashabi’s comic-first layout, rankings, release
                calendars, and reader flows before our full roster of original
                African series goes live, this preview is{" "}
                <strong className="text-[var(--ivory)]">
                  temporarily propagated with real-time Manhwa, Manga, and Anime
                  data via the AniList API
                </strong>
                . You can also test our built-in vertical comic reader with our
                African launch originals at any time.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                <span className="font-extrabold text-[var(--gold-bright)] block mb-0.5">
                  01 · African Identity
                </span>
                <span className="text-[var(--text-muted)]">
                  Designed for African creators, folklore, and futuristic worlds.
                </span>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                <span className="font-extrabold text-[var(--gold-bright)] block mb-0.5">
                  02 · Live API Demo
                </span>
                <span className="text-[var(--text-muted)]">
                  Populated with live AniList charts to preview full catalog scale.
                </span>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                <span className="font-extrabold text-[var(--gold-bright)] block mb-0.5">
                  03 · 100% Free MVP
                </span>
                <span className="text-[var(--text-muted)]">
                  Zero paywalls—explore series hubs and vertical comic panels freely.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="button primary cursor-pointer"
                >
                  <Icon name="play" size={17} />
                  <span>Enter Live Comic Hub</span>
                </button>
                <Link
                  href="/discover"
                  onClick={handleDismiss}
                  className="button secondary"
                >
                  <Icon name="book" size={16} />
                  <span>View African Launch Originals</span>
                </Link>
              </div>
              <Link
                href="/about"
                onClick={handleDismiss}
                className="text-xs font-bold text-[var(--gold-bright)] hover:underline"
              >
                Learn more about Ashabi →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
