"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Layers,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { AfricanOriginalsReaderNotice } from "@/components/legal/african-originals-reader-notice";
import type {
  MangaDexChapterPages,
  MangaDexChapterSummary,
  MangaDexLanguageOption,
} from "@/lib/mangadex";

interface Props {
  seriesId: number;
  seriesTitle: string;
  category: string;
  currentChapter: MangaDexChapterSummary;
  allChapters: MangaDexChapterSummary[];
  availableLanguages?: MangaDexLanguageOption[];
  pagesData: MangaDexChapterPages;
}

export function MangaDexVerticalReader({
  seriesId,
  seriesTitle,
  category,
  currentChapter,
  allChapters,
  availableLanguages = [],
  pagesData,
}: Props) {
  const router = useRouter();
  const [quality, setQuality] = useState<"hd" | "saver">("saver");
  const [wideMode, setWideMode] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>(
    currentChapter.language || "en",
  );

  // Filter chapters by the currently selected language so Prev/Next stay in the user's chosen language
  const langChapters = allChapters.filter((c) => c.language === selectedLang);
  const activeChapters = langChapters.length > 0 ? langChapters : allChapters;

  const currentIndex = activeChapters.findIndex(
    (c) => c.id === currentChapter.id,
  );
  const prevChapter =
    currentIndex > 0 ? activeChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < activeChapters.length - 1
      ? activeChapters[currentIndex + 1]
      : null;

  const images =
    quality === "hd" ? pagesData.pageUrls : pagesData.dataSaverUrls;

  function handleLanguageSwitch(newLang: string) {
    setSelectedLang(newLang);
    const matchingLangChapters = allChapters.filter(
      (c) => c.language === newLang,
    );
    if (matchingLangChapters.length > 0) {
      // Try to find the same chapter number in the new language, or start at the first chapter of that language
      const sameNum =
        matchingLangChapters.find(
          (c) => c.chapterNumber === currentChapter.chapterNumber,
        ) ?? matchingLangChapters[0];
      if (sameNum) {
        router.push(`/anilist/${seriesId}/read/${sameNum.id}`);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#030508] text-[var(--text)] pb-24">
      <AfricanOriginalsReaderNotice contentType="Manhwa / Manga" />

      {/* Top Reader Controls */}
      <div className="sticky top-20 z-40 border-b border-white/10 bg-[#05080c]/92 backdrop-blur-2xl">
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
                {category} · Ch. {currentChapter.chapterNumber} (
                {currentChapter.language.toUpperCase()})
              </span>
              <h1 className="text-sm sm:text-base font-bold text-[var(--text-strong)] truncate m-0">
                {seriesTitle}
              </h1>
            </div>
          </div>

          {/* Center: Language Selector + Chapter Selector Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {availableLanguages.length > 1 ? (
              <div className="neu-inset rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
                <select
                  aria-label="Choose language"
                  value={selectedLang}
                  onChange={(e) => handleLanguageSwitch(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[var(--text-strong)] border-0 focus:outline-none cursor-pointer"
                >
                  {availableLanguages.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      className="bg-[#080d12] text-[var(--ivory)]"
                    >
                      {l.name} ({l.count})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

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
              className="neu-inset rounded-full px-4 py-2 text-xs font-bold text-[var(--text-strong)] max-w-[190px] sm:max-w-[230px]"
            >
              {activeChapters.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-[#080d12]">
                  Ch. {ch.chapterNumber} ({ch.language.toUpperCase()}) —{" "}
                  {ch.title}
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
          <div className="hidden lg:flex items-center gap-2">
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
              decoding="async"
              loading={idx < 3 ? "eager" : "lazy"}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.dataset.fallbackApplied) return;
                target.dataset.fallbackApplied = "1";
                const rawParam = url.split("url=")[1];
                if (rawParam) {
                  target.src = decodeURIComponent(rawParam);
                } else {
                  target.src = "/images/story-neon-lagos.webp";
                }
              }}
              className="w-full h-auto block select-none"
            />
          </div>
        ))}
      </div>

      {/* End-of-Chapter Navigation Card */}
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
                className="neu-pill inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Ch. {prevChapter.chapterNumber}</span>
              </Link>
            ) : null}

            <Link
              href={`/anilist/${seriesId}`}
              className="neu-pill inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)]"
            >
              <span>All Chapters</span>
            </Link>

            {nextChapter ? (
              <Link
                href={`/anilist/${seriesId}/read/${nextChapter.id}`}
                className="neu-pill-active inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold"
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
