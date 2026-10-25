"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileText,
  Minus,
  Plus,
  Sun,
} from "lucide-react";
import { AfricanOriginalsReaderNotice } from "@/components/legal/african-originals-reader-notice";
import type { BookChapter } from "@/lib/books";

interface Props {
  bookTitle: string;
  bookAuthor: string;
  chapters: BookChapter[];
}

const PARAGRAPHS_PER_SINGLE_PAGE = 4;

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

  function scrollToBookTop() {
    const el = document.getElementById("chapter-reader");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function selectChapter(newChapterIdx: number) {
    setChapterIndex(newChapterIdx);
    setSpreadIndex(0);
    scrollToBookTop();
  }

  function turnNext() {
    if (safeSpreadIndex < totalSpreads - 1) {
      setSpreadIndex(safeSpreadIndex + 1);
      scrollToBookTop();
    } else if (chapterIndex < chapters.length - 1) {
      setChapterIndex(chapterIndex + 1);
      setSpreadIndex(0);
      scrollToBookTop();
    }
  }

  function turnPrev() {
    if (safeSpreadIndex > 0) {
      setSpreadIndex(safeSpreadIndex - 1);
      scrollToBookTop();
    } else if (chapterIndex > 0) {
      const prevChap = chapters[chapterIndex - 1];
      const prevPagesCount = Math.ceil(
        (prevChap?.paragraphs.length ?? 1) / PARAGRAPHS_PER_SINGLE_PAGE,
      );
      const prevTotalSpreads = Math.ceil(prevPagesCount / pagesPerTurn);
      setChapterIndex(chapterIndex - 1);
      setSpreadIndex(Math.max(0, prevTotalSpreads - 1));
      scrollToBookTop();
    }
  }

  const paperStyles =
    paperTheme === "parchment"
      ? "bg-[#f3ead6] text-[#241b10] border-[#d5c4a1]"
      : paperTheme === "ivory"
        ? "bg-[#faf8f2] text-[#181613] border-[#e2ddd0]"
        : "bg-[#0d131a] text-[#e8e1d5] border-white/15";

  const mutedTextStyles =
    paperTheme === "night" ? "text-[#9ca8b5]" : "text-[#6e5a42]";

  return (
    <section
      id="chapter-reader"
      aria-label="Open book reader"
      className="max-w-6xl mx-auto space-y-5"
    >
      <AfricanOriginalsReaderNotice contentType="Novel / Book" />

      {/* Quiet Non-Sticky Top Book Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Chapter Table of Contents Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--gold-bright)]" />
          <select
            aria-label="Table of contents"
            value={chapterIndex}
            onChange={(e) => selectChapter(Number(e.target.value))}
            className="neu-inset rounded-full px-4 py-2 text-xs font-bold text-[var(--text-strong)] cursor-pointer"
          >
            {chapters.map((ch, idx) => (
              <option key={ch.number} value={idx} className="bg-[#080d12]">
                {ch.title}
              </option>
            ))}
          </select>
        </div>

        {/* Spread Mode, Font Size & Paper Theme */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTwoPageSpread((v) => !v);
              setSpreadIndex(0);
            }}
            className="hidden lg:inline-flex neu-pill items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
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
            className="neu-pill w-8 h-8 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            aria-label="Larger text"
            className="neu-pill w-8 h-8 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
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
            className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
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

      {/* Physical Hardcover Book Outer Frame */}
      <div className="p-2.5 sm:p-4 rounded-[30px] bg-gradient-to-b from-[#2b1f14] via-[#1a130c] to-[#110c07] border border-[#543d26]/60 shadow-[0_32px_90px_rgba(0,0,0,0.85)]">
        <div
          className={`relative rounded-[22px] border overflow-hidden transition-colors duration-300 ${paperStyles}`}
        >
          {/* Center Book Spine Shadow (Desktop Two-Page Mode) */}
          {twoPageSpread ? (
            <div
              aria-hidden="true"
              className="hidden lg:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-black/18 to-transparent z-10"
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
            <div className="p-7 sm:p-11 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10">
              <div className="space-y-6">
                {/* Running Book Header */}
                <div
                  className={`flex items-center justify-between text-[11px] font-serif uppercase tracking-[0.2em] border-b border-current/10 pb-3 ${mutedTextStyles}`}
                >
                  <span className="truncate max-w-[240px]">{bookAuthor}</span>
                  <span className="truncate max-w-[240px]">{bookTitle}</span>
                </div>

                {/* Show Chapter Heading on first page of chapter */}
                {leftPageIndex === 0 ? (
                  <div className="pt-2 pb-4 text-center space-y-1.5">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.28em] block ${mutedTextStyles}`}
                    >
                      Chapter {currentChapter.number}
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
                <span>Page {leftPageIndex + 1}</span>
                <span>
                  Ch. {currentChapter.number} of {chapters.length}
                </span>
              </div>
            </div>

            {/* RIGHT BOOK PAGE (Shown when Two-Page Spread is active on Desktop) */}
            {twoPageSpread ? (
              <div className="p-7 sm:p-11 lg:p-14 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Running Chapter Header */}
                  <div
                    className={`flex items-center justify-between text-[11px] font-serif uppercase tracking-[0.2em] border-b border-current/10 pb-3 ${mutedTextStyles}`}
                  >
                    <span className="truncate">{currentChapter.title}</span>
                    <span>
                      {rightPageParagraphs.length > 0
                        ? `Page ${rightPageIndex + 1}`
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
                          className="neu-pill-active inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold cursor-pointer"
                        >
                          <span>
                            Continue to Chapter {currentChapter.number + 1}
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
                    {bookPages.length} Pages in Chapter {currentChapter.number}
                  </span>
                  <span>
                    {rightPageParagraphs.length > 0
                      ? `Page ${rightPageIndex + 1}`
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
          className="neu-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)] disabled:opacity-35 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Turn Page Back</span>
        </button>

        <span className="text-xs font-semibold text-[var(--text-muted)]">
          Chapter {currentChapter.number} · Spread {safeSpreadIndex + 1} of{" "}
          {totalSpreads}
        </span>

        <button
          type="button"
          disabled={!hasNextTurn}
          onClick={turnNext}
          className="neu-pill-active inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold disabled:opacity-35 cursor-pointer"
        >
          <span>Turn Page Forward</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
