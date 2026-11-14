"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Globe2, Layers, Loader2 } from "lucide-react";
import type {
  MangaDexChapterSummary,
  MangaDexLanguageOption,
} from "@/lib/mangadex";

interface Props {
  seriesId: number;
  seriesTitle?: string;
  nativeTitle?: string | null;
  expectedChapters?: number | null;
  seriesStatus?: string;
  chapters?: MangaDexChapterSummary[];
  availableLanguages?: MangaDexLanguageOption[];
  defaultLanguage?: string;
}

export function SeriesChaptersBrowser({
  seriesId,
  seriesTitle,
  nativeTitle,
  seriesStatus = "RELEASING",
  chapters: initialChapters = [],
  availableLanguages: initialLanguages = [],
  defaultLanguage = "en",
}: Props) {
  const [chapters, setChapters] = useState<MangaDexChapterSummary[]>(initialChapters);
  const [availableLanguages, setAvailableLanguages] =
    useState<MangaDexLanguageOption[]>(initialLanguages);
  const [selectedLang, setSelectedLang] = useState<string>(defaultLanguage);
  const [loading, setLoading] = useState(initialChapters.length === 0);

  useEffect(() => {
    if (initialChapters.length > 0) return;
    const params = new URLSearchParams();
    if (seriesTitle) params.set("title", seriesTitle);
    if (nativeTitle) params.set("native", nativeTitle);
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/series/${seriesId}/chapters?${params.toString()}`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          chapters?: MangaDexChapterSummary[];
          availableLanguages?: MangaDexLanguageOption[];
          defaultLanguage?: string;
        };
        setChapters(data.chapters ?? []);
        setAvailableLanguages(data.availableLanguages ?? []);
        if (data.defaultLanguage) setSelectedLang(data.defaultLanguage);
      } catch {
        // Leave the empty state if the chapter feed cannot be reached.
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [initialChapters.length, nativeTitle, seriesId, seriesTitle]);

  const filteredChapters =
    selectedLang === "all"
      ? chapters
      : chapters.filter((c) => c.language === selectedLang);

  const displayChapters =
    filteredChapters.length > 0 ? filteredChapters : chapters;
  const firstChapter = displayChapters[0];
  const isFinished = seriesStatus.toUpperCase().includes("FINISH");

  return (
    <section
      id="playable-chapters"
      aria-labelledby="chapters-heading"
      className="liquid-glass rounded-[30px] p-6 sm:p-10 space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isFinished
                ? `Completed Series · All ${displayChapters.length} Chapters Available`
                : `Ongoing Series (${seriesStatus}) · All ${displayChapters.length} Released Chapters Available`}
            </span>
          </span>
          <h2
            id="chapters-heading"
            className="text-2xl sm:text-3xl font-extrabold m-0"
          >
            Read Complete Chapters on Ashabi (Ch. 1 – Ch.{" "}
            {displayChapters.length})
          </h2>
        </div>

        {/* Language Picker + Start Reading CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 neu-inset px-3.5 py-2 rounded-full">
            <Globe2 className="w-4 h-4 text-[var(--gold-bright)] shrink-0" />
            <label htmlFor="series-lang-select" className="sr-only">
              Choose reading language
            </label>
            <select
              id="series-lang-select"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-[var(--text-strong)] border-0 focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-[#080d12] text-[var(--ivory)]"
                >
                  {lang.name} ({lang.count} Ch.)
                </option>
              ))}
              {availableLanguages.length > 1 ? (
                <option value="all" className="bg-[#080d12] text-[var(--ivory)]">
                  All Languages ({chapters.length} Ch.)
                </option>
              ) : null}
            </select>
          </div>

          {firstChapter ? (
            <Link
              href={`/anilist/${seriesId}/read/${firstChapter.id}`}
              className="neu-pill-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                Start Ch. {firstChapter.chapterNumber} (
                {firstChapter.language.toUpperCase()})
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Language Quick Pills when multiple languages exist */}
      {availableLanguages.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-muted)] mr-1">
            Reading Language:
          </span>
          {availableLanguages.map((lang) => {
            const active = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer " +
                  (active
                    ? "neu-pill-active"
                    : "neu-pill text-[var(--ivory)]")
                }
              >
                {lang.name} ({lang.count})
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Chapters Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-[var(--gold-bright)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading chapters…
        </div>
      ) : displayChapters.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-muted)] m-0">
          Chapters for this title are still being linked. Please try again shortly.
        </p>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[540px] overflow-y-auto pr-1">
        {displayChapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/anilist/${seriesId}/read/${chapter.id}`}
            className="neu-card group rounded-[18px] p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
                  Chapter {chapter.chapterNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-[var(--ivory)]">
                  {chapter.language}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  · {chapter.pages}p
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                {chapter.title}
              </h3>
              {chapter.scanlationGroup ? (
                <p className="text-[11px] text-[var(--text-muted)] truncate m-0">
                  {chapter.scanlationGroup}
                </p>
              ) : null}
            </div>

            <span className="neu-pill w-9 h-9 rounded-full grid place-items-center text-[var(--ivory)] group-hover:text-[var(--gold-bright)] shrink-0">
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}
