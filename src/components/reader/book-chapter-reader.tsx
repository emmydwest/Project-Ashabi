"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Library,
  Minus,
  Plus,
  Sun,
} from "lucide-react";
import type { BookChapter } from "@/lib/books";

interface Props {
  bookTitle: string;
  bookAuthor: string;
  chapters: BookChapter[];
}

export function BookChapterReader({
  bookTitle,
  bookAuthor,
  chapters,
}: Props) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<number>(20);
  const [sepiaMode, setSepiaMode] = useState<boolean>(false);

  const currentChapter = chapters[chapterIndex] ?? chapters[0];
  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < chapters.length - 1;

  function goToChapter(index: number) {
    setChapterIndex(index);
    const readerEl = document.getElementById("chapter-reader");
    if (readerEl) {
      readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (!currentChapter) return null;

  return (
    <section
      id="chapter-reader"
      aria-label="Full in-app book reader"
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Sticky Liquid Glass Reader Controls */}
      <div className="liquid-glass sticky top-24 z-30 rounded-[24px] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Library className="w-4 h-4 text-[var(--gold-bright)] shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--gold)] block">
              Full In-App Novel Reader · {chapters.length} Chapters
            </span>
            <p className="text-xs sm:text-sm font-bold text-[var(--text-strong)] m-0">
              {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Chapter Dropdown & Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => goToChapter(chapterIndex - 1)}
            aria-label="Previous chapter"
            className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)] disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            aria-label="Select book chapter"
            value={chapterIndex}
            onChange={(e) => goToChapter(Number(e.target.value))}
            className="neu-inset rounded-full px-4 py-2 text-xs font-bold text-[var(--text-strong)] max-w-[200px] sm:max-w-[240px]"
          >
            {chapters.map((ch, idx) => (
              <option key={ch.number} value={idx} className="bg-[#080d12]">
                Ch. {ch.number} — {ch.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() => goToChapter(chapterIndex + 1)}
            aria-label="Next chapter"
            className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)] disabled:opacity-35 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Typography & Surface Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(16, s - 2))}
            aria-label="Decrease font size"
            className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-[var(--ivory)] min-w-[38px] text-center">
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(28, s + 2))}
            aria-label="Increase font size"
            className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setSepiaMode((m) => !m)}
            className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer ml-1"
          >
            <Sun className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
            <span>{sepiaMode ? "Dark Glass" : "Sepia Page"}</span>
          </button>
        </div>
      </div>

      {/* Reading Canvas */}
      <article
        className={
          "rounded-[32px] p-6 sm:p-12 lg:p-16 space-y-6 transition-colors duration-300 " +
          (sepiaMode
            ? "bg-[#f4ecd8] text-[#231b10] border border-[#d8c8a8] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            : "liquid-glass text-[var(--cream)]")
        }
      >
        <header className="border-b border-current/15 pb-6 space-y-2">
          <span
            className={
              "text-xs font-extrabold uppercase tracking-[0.2em] block " +
              (sepiaMode ? "text-[#8c5812]" : "text-[var(--gold-bright)]")
            }
          >
            {bookTitle} · {bookAuthor}
          </span>
          <h2
            className={
              "font-serif text-2xl sm:text-4xl font-bold m-0 " +
              (sepiaMode ? "text-[#161008]" : "text-[var(--text-strong)]")
            }
          >
            {currentChapter.title}
          </h2>
        </header>

        <div
          style={{ fontSize: `${fontSize}px` }}
          className="space-y-6 font-serif leading-[1.85]"
        >
          {currentChapter.paragraphs.map((paragraph, idx) => (
            <p key={idx} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom Chapter Pagination Bar */}
        <footer className="pt-8 border-t border-current/15 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => goToChapter(chapterIndex - 1)}
            className="neu-pill inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)] disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span
            className={
              "text-xs font-bold " +
              (sepiaMode ? "text-[#5c4930]" : "text-[var(--text-muted)]")
            }
          >
            Chapter {currentChapter.number} of {chapters.length}
          </span>

          {hasNext ? (
            <button
              type="button"
              onClick={() => goToChapter(chapterIndex + 1)}
              className="neu-pill-active inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Next: Chapter {currentChapter.number + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
              End of Book
            </span>
          )}
        </footer>
      </article>
    </section>
  );
}
