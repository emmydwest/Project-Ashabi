"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

const DISMISSED_KEY = "ashabi:preview-notice-ack:v2";

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
      // Ignore storage errors
    }
  }

  return (
    <>
      {/* Sleek Compact Single-Row Top Bar (Does not crowd the Hero) */}
      <div
        role="region"
        aria-label="Project Ashabi platform brief"
        className="rounded-full border border-[rgba(245,189,67,0.32)] bg-[#0b1117]/90 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[var(--gold)] text-[#140c02] shrink-0">
            African Comic Platform
          </span>
          <span className="text-[var(--ivory)] truncate">
            <strong className="text-[var(--gold-bright)]">Project Ashabi</strong>{" "}
            is built for African comics &amp; folklore — currently previewing live{" "}
            <strong className="text-white">AniList Manhwa, Manga &amp; Anime</strong>{" "}
            charts &amp; trailers while our African originals finalize for launch.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border border-[var(--border-gold)] bg-[rgba(245,189,67,0.14)] text-[var(--gold-bright)] hover:bg-[rgba(245,189,67,0.25)] transition-all cursor-pointer shrink-0"
        >
          <Icon name="sparkles" size={12} />
          <span>{isOpen ? "Hide Brief" : "Platform Brief"}</span>
        </button>
      </div>

      {/* Compact, Well-Detailed Floating Card (Bottom-Right Corner — Never Blocks the Whole Page) */}
      {isOpen ? (
        <aside
          role="dialog"
          aria-modal="false"
          aria-labelledby="ashabi-welcome-title"
          className="fixed bottom-5 right-5 z-[110] w-[calc(100vw-2.5rem)] max-w-[430px] rounded-[22px] border border-[rgba(245,189,67,0.5)] bg-gradient-to-b from-[#101822]/98 via-[#090e14]/98 to-[#05070a]/98 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.88)] backdrop-blur-md space-y-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[var(--gold)] text-[#140c02]">
              <Icon name="sparkles" size={12} />
              <span>Project Ashabi · Live Preview Brief</span>
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss platform brief"
              className="w-7 h-7 rounded-full border border-white/15 bg-white/5 grid place-items-center text-[var(--text-muted)] hover:text-white hover:border-[var(--border-gold)] cursor-pointer"
            >
              <Icon name="close" size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            <h2
              id="ashabi-welcome-title"
              className="font-serif text-xl font-bold text-[var(--text-strong)] leading-snug m-0"
            >
              Africa’s Digital Home for Comics, Webtoons &amp; Mythic Fiction
            </h2>
            <p className="text-xs text-[var(--text)] leading-relaxed m-0">
              <strong className="text-[var(--gold-bright)]">Ashabi</strong> is an
              African-themed digital publishing ecosystem created for{" "}
              <strong className="text-[var(--ivory)]">
                African comic creators, Afrofuturist illustrators, graphic
                novelists, and folklore storytellers
              </strong>{" "}
              across Nigeria, Africa, and the diaspora.
            </p>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-black/50 p-3 space-y-2 text-[11px] leading-relaxed text-[var(--text-muted)]">
            <div>
              <strong className="text-[var(--gold-bright)] uppercase tracking-wider block text-[10px]">
                1. Why AniList Data Is Propagated Right Now
              </strong>
              While our first wave of original African comic episodes undergoes
              final studio lettering, this preview is connected to the live{" "}
              <strong className="text-[var(--ivory)]">AniList GraphQL API</strong>{" "}
              (Manhwa, Manga &amp; Anime) to demonstrate full-scale discovery,
              genre filtering, search, and official trailers.
            </div>
            <div className="pt-1.5 border-t border-white/10">
              <strong className="text-[var(--gold-bright)] uppercase tracking-wider block text-[10px]">
                2. What You Can Explore &amp; Test
              </strong>
              Use the top <strong className="text-[var(--ivory)]">Search</strong>{" "}
              bar, filter by genres (<em className="text-[var(--ivory)]">Sci-Fi, Fantasy, Action, Romance</em>),
              watch embedded <strong className="text-[var(--ivory)]">Manhwa &amp; Anime Trailers</strong>,
              or test our vertical comic reader.
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2 rounded-full text-xs font-extrabold bg-[var(--gold)] text-[#140c02] hover:bg-[var(--gold-bright)] transition-all cursor-pointer"
            >
              Got It, Explore Hub
            </button>
            <div className="flex items-center gap-3 text-xs">
              <Link
                href="/read/neon-lagos/rain-on-the-third-mainland"
                onClick={handleDismiss}
                className="font-bold text-[var(--gold-bright)] hover:underline"
              >
                African Reader Demo
              </Link>
              <Link
                href="/about"
                onClick={handleDismiss}
                className="text-[var(--text-muted)] hover:text-white"
              >
                Our Mission →
              </Link>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
