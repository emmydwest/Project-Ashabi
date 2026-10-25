"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import type {
  MangaDexChapterPages,
  MangaDexChapterSummary,
} from "@/lib/mangadex";

interface Props {
  seriesId: number;
  seriesTitle: string;
  category: string;
  currentChapter: MangaDexChapterSummary;
  allChapters: MangaDexChapterSummary[];
  pagesData: MangaDexChapterPages;
}

export function MangaDexVerticalReader({
  seriesId,
  seriesTitle,
  category,
  currentChapter,
  allChapters,
  pagesData,
}: Props) {
  const router = useRouter();
  const [quality, setQuality] = useState<"hd" | "saver">("saver");
  const [wideMode, setWideMode] = useState<boolean>(false);

  const currentIndex = allChapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  const images =
    quality === "hd" ? pagesData.pageUrls : pagesData.dataSaverUrls;

  return (
    <div className="min-h-screen bg-[#030508] text-[var(--text)] pb-24">
      {/* Sticky Liquid Glass Reader Controls */}
      <div className="sticky top-20 z-40 border-b border-white/10 bg-[#05080c]/90 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Series + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/anilist/${seriesId}`}
              className="neu-pill inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--gold-bright)]" />
              <span className="hidden sm:inline">Series Hub</span>
            </Link>

            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--gold)] block">
                {category} · Ch. {currentChapter.chapterNumber}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-[var(--text-strong)] truncate m-0">
                {seriesTitle}
              </h1>
            </div>
          </div>

          {/* Center: Chapter Selector Dropdown */}
          <div className="flex items-center gap-2">
            {prevChapter ? (
              <Link
                href={`/anilist/${seriesId}/read/${prevChapter.id}`}
                aria-label="Previous chapter"
                className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : null}

            <select
              aria-label="Select chapter"
              value={currentChapter.id}
              onChange={(e) =>
                router.push(`/anilist/${seriesId}/read/${e.target.value}`)
              }
              className="neu-inset rounded-full px-4 py-2 text-xs font-bold text-[var(--text-strong)] max-w-[210px] sm:max-w-[260px]"
            >
              {allChapters.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-[#080d12]">
                  Ch. {ch.chapterNumber} — {ch.title}
                </option>
              ))}
            </select>

            {nextChapter ? (
              <Link
                href={`/anilist/${seriesId}/read/${nextChapter.id}`}
                aria-label="Next chapter"
                className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)]"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}
          </div>

          {/* Right: Quality & Width Toggles */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setQuality((q) => (q === "saver" ? "hd" : "saver"))
              }
              className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
              <span>{quality === "hd" ? "HD Pages" : "Fast Saver"}</span>
            </button>

            <button
              type="button"
              onClick={() => setWideMode((w) => !w)}
              className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
            >
              {wideMode ? (
                <Minimize2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              )}
              <span>{wideMode ? "Standard Width" : "Wide View"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Comic / Webtoon Page Strip */}
      <div
        className={
          "mx-auto pt-4 flex flex-col items-center " +
          (wideMode ? "max-w-4xl" : "max-w-[760px]")
        }
      >
        {images.map((url, idx) => (
          <div key={url + idx} className="relative w-full bg-[#06090e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${seriesTitle} Chapter ${currentChapter.chapterNumber} — Page ${idx + 1}`}
              referrerPolicy="no-referrer"
              loading={idx < 3 ? "eager" : "lazy"}
              className="w-full h-auto block select-none"
            />
          </div>
        ))}
      </div>

      {/* End-of-Chapter Liquid Glass Navigation Card */}
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <div className="liquid-glass-gold rounded-[28px] p-6 sm:p-9 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--gold-bright)] bg-white/[0.05]">
            <Layers className="w-3.5 h-3.5" />
            <span>
              Finished Chapter {currentChapter.chapterNumber} ({images.length}{" "}
              Pages)
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
            {currentChapter.title}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {prevChapter ? (
              <Link
                href={`/anilist/${seriesId}/read/${prevChapter.id}`}
                className="neu-pill inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Ch. {prevChapter.chapterNumber}</span>
              </Link>
            ) : null}

            <Link
              href={`/anilist/${seriesId}`}
              className="neu-pill inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)]"
            >
              <span>All Chapters</span>
            </Link>

            {nextChapter ? (
              <Link
                href={`/anilist/${seriesId}/read/${nextChapter.id}`}
                className="neu-pill-active inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold"
              >
                <span>Next: Ch. {nextChapter.chapterNumber}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
