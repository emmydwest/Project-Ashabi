"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileText,
  Globe2,
  Minus,
  Plus,
  Sun,
} from "lucide-react";
import { AfricanOriginalsReaderNotice } from "@/components/legal/african-originals-reader-notice";
import { ReaderModeToggle } from "@/components/reader/reader-mode-toggle";
import type { BookChapter } from "@/lib/books";

interface Props {
  bookTitle: string;
  bookAuthor: string;
  chapters: BookChapter[];
}

const PARAGRAPHS_PER_SINGLE_PAGE = 4;

const BOOK_LANGUAGES = [
  { code: "en", name: "English", chapterLabel: "Chapter", pageLabel: "Page" },
  {
    code: "fr",
    name: "Français (French)",
    chapterLabel: "Chapitre",
    pageLabel: "Page",
  },
  {
    code: "es",
    name: "Español (Spanish)",
    chapterLabel: "Capítulo",
    pageLabel: "Página",
  },
  {
    code: "pt-br",
    name: "Português (Brasil)",
    chapterLabel: "Capítulo",
    pageLabel: "Página",
  },
  {
    code: "ru",
    name: "Русский (Russian)",
    chapterLabel: "Глава",
    pageLabel: "Стр.",
  },
  {
    code: "id",
    name: "Bahasa Indonesia",
    chapterLabel: "Bab",
    pageLabel: "Halaman",
  },
  {
    code: "ar",
    name: "العربية (Arabic)",
    chapterLabel: "الفصل",
    pageLabel: "صفحة",
  },
  {
    code: "de",
    name: "Deutsch (German)",
    chapterLabel: "Kapitel",
    pageLabel: "Seite",
  },
] as const;

export function BookChapterReader({
  bookTitle,
  bookAuthor,
  chapters,
}: Props) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [paperTheme, setPaperTheme] = useState<"parchment" | "ivory" | "night">(
    "parchment",
  );
  const [twoPageSpread, setTwoPageSpread] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(
    null,
  );
  const [flipKey, setFlipKey] = useState<number>(0);

  useEffect(() => {
    if (!flipDirection) return;
    const timer = setTimeout(() => {
      setFlipDirection(null);
    }, 580);
    return () => clearTimeout(timer);
  }, [flipDirection, flipKey]);

  const activeLangMeta =
    BOOK_LANGUAGES.find((l) => l.code === selectedLang) ?? BOOK_LANGUAGES[0];

  const currentChapter = chapters[chapterIndex] ?? chapters[0];
  if (!currentChapter) return null;

  // Slice current chapter paragraphs into individual book pages (4 paragraphs per page)
  const bookPages: string[][] = [];
  for (
    let i = 0;
    i < currentChapter.paragraphs.length;
    i += PARAGRAPHS_PER_SINGLE_PAGE
  ) {
    bookPages.push(
      currentChapter.paragraphs.slice(i, i + PARAGRAPHS_PER_SINGLE_PAGE),
    );
  }
  if (bookPages.length === 0) {
    bookPages.push([currentChapter.title]);
  }

  const pagesPerTurn = twoPageSpread ? 2 : 1;
  const totalSpreads = Math.ceil(bookPages.length / pagesPerTurn);
  const safeSpreadIndex = Math.min(spreadIndex, Math.max(0, totalSpreads - 1));

  const leftPageIndex = safeSpreadIndex * pagesPerTurn;
  const rightPageIndex = leftPageIndex + 1;

  const leftPageParagraphs = bookPages[leftPageIndex] ?? [];
  const rightPageParagraphs = twoPageSpread
    ? (bookPages[rightPageIndex] ?? [])
    : [];

  const hasPrevTurn = safeSpreadIndex > 0 || chapterIndex > 0;
  const hasNextTurn =
    safeSpreadIndex < totalSpreads - 1 || chapterIndex < chapters.length - 1;

  function triggerFlipAnimation(dir: "next" | "prev") {
    setFlipDirection(dir);
    setFlipKey((k) => k + 1);
  }

  function selectChapter(newChapterIdx: number) {
    triggerFlipAnimation(newChapterIdx >= chapterIndex ? "next" : "prev");
    setChapterIndex(newChapterIdx);
    setSpreadIndex(0);
  }

  function turnNext() {
    if (!hasNextTurn) return;
    triggerFlipAnimation("next");
    if (safeSpreadIndex < totalSpreads - 1) {
      setSpreadIndex(safeSpreadIndex + 1);
    } else if (chapterIndex < chapters.length - 1) {
      setChapterIndex(chapterIndex + 1);
      setSpreadIndex(0);
    }
  }

  function turnPrev() {
    if (!hasPrevTurn) return;
    triggerFlipAnimation("prev");
    if (safeSpreadIndex > 0) {
      setSpreadIndex(safeSpreadIndex - 1);
    } else if (chapterIndex > 0) {
      const prevChap = chapters[chapterIndex - 1];
      const prevPagesCount = Math.ceil(
        (prevChap?.paragraphs.length ?? 1) / PARAGRAPHS_PER_SINGLE_PAGE,
      );
      const prevTotalSpreads = Math.ceil(prevPagesCount / pagesPerTurn);
      setChapterIndex(chapterIndex - 1);
      setSpreadIndex(Math.max(0, prevTotalSpreads - 1));
    }
  }

  const paperStyles =
    paperTheme === "parchment"
      ? "bg-[#f3ead6] text-[#241b10] border-[#d5c4a1]"
      : paperTheme === "ivory"
        ? "bg-[#faf8f2] text-[#181613] border-[#e2ddd0]"
        : "bg-[#0d131a] text-[#e8e1d5] border-white/15";

  const leafSurfaceStyles =
    paperTheme === "parchment"
      ? "bg-gradient-to-r from-[#e6d8bc] via-[#f3ead6] to-[#eadcc2] border-[#d5c4a1]"
      : paperTheme === "ivory"
        ? "bg-gradient-to-r from-[#ece8dc] via-[#faf8f2] to-[#f2eee4] border-[#e2ddd0]"
        : "bg-gradient-to-r from-[#090d12] via-[#121a24] to-[#0d131a] border-white/20";

  const mutedTextStyles =
    paperTheme === "night" ? "text-[#9ca8b5]" : "text-[#6e5a42]";

  return (
    <section
      id="chapter-reader"
      aria-label="Open book reader"
      className="max-w-6xl mx-auto space-y-5"
    >
      <AfricanOriginalsReaderNotice contentType="Novel / Book" />

      {/* Quiet Non-Sticky Top Book Controls (Hidden when Immersive Reader Mode is active) */}
      <div
        data-reader-toolbar="true"
        className="flex flex-wrap items-center justify-between gap-3 px-2"
      >
        {/* Chapter Table of Contents + Language Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--gold-bright)]" />
            <select
              aria-label="Table of contents"
              value={chapterIndex}
              onChange={(e) => selectChapter(Number(e.target.value))}
              className="neu-inset rounded-full px-3.5 py-1.5 text-xs font-bold text-[var(--text-strong)] cursor-pointer"
            >
              {chapters.map((ch, idx) => (
                <option key={ch.number} value={idx} className="bg-[#080d12]">
                  {activeLangMeta.chapterLabel} {ch.number} — {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Reading Language Selector (All Chapters Available) */}
          <div className="neu-inset rounded-full px-3.5 py-1.5 inline-flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[var(--gold-bright)] shrink-0" />
            <select
              aria-label="Choose reading language"
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                triggerFlipAnimation("next");
              }}
              className="bg-transparent text-xs font-bold text-[var(--text-strong)] border-0 focus:outline-none cursor-pointer"
            >
              {BOOK_LANGUAGES.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-[#080d12] text-[var(--ivory)]"
                >
                  {lang.name} ({chapters.length} Ch.)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reader Mode, Spread Mode, Font Size & Paper Theme */}
        <div className="flex flex-wrap items-center gap-2">
          <ReaderModeToggle />

          <button
            type="button"
            onClick={() => {
              setTwoPageSpread((v) => !v);
              setSpreadIndex(0);
            }}
            className="hidden lg:inline-flex neu-pill items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
          >
            {twoPageSpread ? (
              <>
                <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Single Page</span>
              </>
            ) : (
              <>
                <Columns2 className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Two-Page Book</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(15, s - 1))}
            aria-label="Smaller text"
            className="neu-pill w-7 h-7 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            aria-label="Larger text"
            className="neu-pill w-7 h-7 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setPaperTheme((t) =>
                t === "parchment"
                  ? "ivory"
                  : t === "ivory"
                    ? "night"
                    : "parchment",
              )
            }
            className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
            <span>
              {paperTheme === "parchment"
                ? "Warm Cream"
                : paperTheme === "ivory"
                  ? "Crisp Ivory"
                  : "Night Ink"}
            </span>
          </button>
        </div>
      </div>

      {/* Physical Hardcover Book Outer Frame with 3D Page-Flip Perspective */}
      <div className="book-perspective p-2.5 sm:p-4 rounded-[30px] bg-gradient-to-b from-[#2b1f14] via-[#1a130c] to-[#110c07] border border-[#543d26]/60 shadow-[0_32px_90px_rgba(0,0,0,0.85)]">
        <div
          key={flipKey}
          className={
            `relative rounded-[22px] border overflow-hidden transition-colors duration-300 ${paperStyles} ` +
            (flipDirection === "next"
              ? "book-spread-flip-next"
              : flipDirection === "prev"
                ? "book-spread-flip-prev"
                : "")
          }
        >
          {/* 3D Animated Turning Page Leaf Overlay (Desktop Two-Page Book Mode) */}
          {twoPageSpread && flipDirection ? (
            <div
              aria-hidden="true"
              className={
                `hidden lg:flex flex-col justify-between p-12 pointer-events-none absolute inset-y-0 z-30 border ${leafSurfaceStyles} ` +
                (flipDirection === "next"
                  ? "left-1/2 w-1/2 rounded-r-[20px] book-flip-leaf-next"
                  : "left-0 w-1/2 rounded-l-[20px] book-flip-leaf-prev")
              }
            >
              <div
                className={`text-[10px] font-serif uppercase tracking-[0.2em] border-b border-current/10 pb-2 opacity-55 ${mutedTextStyles}`}
              >
                {bookTitle}
              </div>
              <div className="space-y-3 opacity-35">
                <div className="h-2.5 rounded bg-current/25 w-11/12" />
                <div className="h-2.5 rounded bg-current/20 w-full" />
                <div className="h-2.5 rounded bg-current/25 w-10/12" />
                <div className="h-2.5 rounded bg-current/15 w-9/12" />
                <div className="h-2.5 rounded bg-current/20 w-11/12" />
              </div>
              <div
                className={`text-[10px] font-serif opacity-55 ${mutedTextStyles}`}
              >
                {activeLangMeta.pageLabel}{" "}
                {flipDirection === "next" ? rightPageIndex + 1 : leftPageIndex + 1}
              </div>
            </div>
          ) : null}

          {/* Center Book Spine Shadow (Desktop Two-Page Mode) */}
          {twoPageSpread ? (
            <div
              aria-hidden="true"
              className="hidden lg:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-14 bg-gradient-to-r from-black/[0.04] via-black/22 to-black/[0.04] z-20"
            />
          ) : null}

          <div
            className={
              twoPageSpread
                ? "grid lg:grid-cols-2 min-h-[680px]"
                : "max-w-3xl mx-auto min-h-[680px]"
            }
          >
            {/* LEFT BOOK PAGE */}
            <div className="relative p-7 sm:p-11 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10">
              {/* Interactive Left Page Corner Flip Back Zone */}
              {hasPrevTurn ? (
                <button
                  type="button"
                  onClick={turnPrev}
                  title="Flip to previous page"
                  aria-label="Flip to previous page"
                  className="hidden lg:flex absolute inset-y-0 left-0 w-10 items-center justify-center opacity-0 hover:opacity-100 bg-gradient-to-r from-black/10 to-transparent transition-opacity cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 opacity-60" />
                </button>
              ) : null}

              <div className="space-y-6">
                {/* Running Book Header */}
                <div
                  className={`flex items-center justify-between text-[11px] font-serif uppercase tracking-[0.2em] border-b border-current/10 pb-3 ${mutedTextStyles}`}
                >
                  <span className="truncate max-w-[220px]">{bookAuthor}</span>
                  <span className="truncate max-w-[220px]">
                    {bookTitle} ({selectedLang.toUpperCase()})
                  </span>
                </div>

                {/* Show Chapter Heading on first page of chapter */}
                {leftPageIndex === 0 ? (
                  <div className="pt-2 pb-4 text-center space-y-1.5">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.28em] block ${mutedTextStyles}`}
                    >
                      {activeLangMeta.chapterLabel} {currentChapter.number}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold m-0">
                      {currentChapter.title}
                    </h2>
                  </div>
                ) : null}

                {/* Book Page Paragraphs */}
                <div
                  style={{ fontSize: `${fontSize}px` }}
                  className="space-y-5 font-serif leading-[1.88] text-justify"
                >
                  {leftPageParagraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className={
                        leftPageIndex === 0 && idx === 0
                          ? "m-0 first-letter:float-left first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:pr-3 first-letter:leading-none"
                          : "m-0 indent-6"
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Left Page Footer Number */}
              <div
                className={`pt-8 flex items-center justify-between text-xs font-serif ${mutedTextStyles}`}
              >
                <span>
                  {activeLangMeta.pageLabel} {leftPageIndex + 1}
                </span>
                <span>
                  {activeLangMeta.chapterLabel} {currentChapter.number} /{" "}
                  {chapters.length}
                </span>
              </div>
            </div>

            {/* RIGHT BOOK PAGE (Shown when Two-Page Spread is active on Desktop) */}
            {twoPageSpread ? (
              <div className="relative p-7 sm:p-11 lg:p-14 flex flex-col justify-between">
                {/* Interactive Right Page Corner Flip Forward Zone */}
                {hasNextTurn ? (
                  <button
                    type="button"
                    onClick={turnNext}
                    title="Flip to next page"
                    aria-label="Flip to next page"
                    className="hidden lg:flex absolute inset-y-0 right-0 w-10 items-center justify-center opacity-0 hover:opacity-100 bg-gradient-to-l from-black/10 to-transparent transition-opacity cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 opacity-60" />
                  </button>
                ) : null}

                <div className="space-y-6">
                  {/* Running Chapter Header */}
                  <div
                    className={`flex items-center justify-between text-[11px] font-serif uppercase tracking-[0.2em] border-b border-current/10 pb-3 ${mutedTextStyles}`}
                  >
                    <span className="truncate">{currentChapter.title}</span>
                    <span>
                      {rightPageParagraphs.length > 0
                        ? `${activeLangMeta.pageLabel} ${rightPageIndex + 1}`
                        : "End of Chapter"}
                    </span>
                  </div>

                  {rightPageParagraphs.length > 0 ? (
                    <div
                      style={{ fontSize: `${fontSize}px` }}
                      className="space-y-5 font-serif leading-[1.88] text-justify"
                    >
                      {rightPageParagraphs.map((para, idx) => (
                        <p key={idx} className="m-0 indent-6">
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center space-y-4">
                      <p
                        className={`font-serif italic text-base ${mutedTextStyles}`}
                      >
                        — End of {currentChapter.title} —
                      </p>
                      {chapterIndex < chapters.length - 1 ? (
                        <button
                          type="button"
                          onClick={turnNext}
                          className="neu-pill-active inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold cursor-pointer"
                        >
                          <span>
                            Flip to {activeLangMeta.chapterLabel}{" "}
                            {currentChapter.number + 1}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Right Page Footer Number */}
                <div
                  className={`pt-8 flex items-center justify-between text-xs font-serif ${mutedTextStyles}`}
                >
                  <span>
                    {bookPages.length} Pages in {activeLangMeta.chapterLabel}{" "}
                    {currentChapter.number}
                  </span>
                  <span>
                    {rightPageParagraphs.length > 0
                      ? `${activeLangMeta.pageLabel} ${rightPageIndex + 1}`
                      : ""}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Book Page-Turn Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-1">
        <button
          type="button"
          disabled={!hasPrevTurn}
          onClick={turnPrev}
          className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)] disabled:opacity-35 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Flip Page Back</span>
        </button>

        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {activeLangMeta.chapterLabel} {currentChapter.number} · Spread{" "}
          {safeSpreadIndex + 1} of {totalSpreads} ({activeLangMeta.name})
        </span>

        <button
          type="button"
          disabled={!hasNextTurn}
          onClick={turnNext}
          className="neu-pill-active inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold disabled:opacity-35 cursor-pointer"
        >
          <span>Flip Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
