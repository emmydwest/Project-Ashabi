"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { AniListMedia } from "@/lib/anilist";
import type { Story } from "@/lib/stories";
import {
  loadReaderState,
  toggleFollowStory,
  toggleSaveStory,
  type ReadingProgressRecord,
} from "@/lib/reader-state";
import { trackEvent } from "@/lib/analytics";

interface Props {
  spotlightItems: AniListMedia[];
  stories: Story[];
}

const SLIDE_DURATION_MS = 6500;

export function HomeComicStage({ spotlightItems, stories }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>(() => {
    const st = loadReaderState();
    return Object.fromEntries(st.followedStories.map((s) => [s, true]));
  });
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(() => {
    const st = loadReaderState();
    return Object.fromEntries(st.savedStories.map((s) => [s, true]));
  });
  const [recentProgress, setRecentProgress] = useState<
    ReadingProgressRecord | undefined
  >(() => {
    const st = loadReaderState();
    const entries = Object.values(st.progress).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return entries[0];
  });

  useEffect(() => {
    const sync = () => {
      const st = loadReaderState();
      setFollowedMap(
        Object.fromEntries(st.followedStories.map((s) => [s, true])),
      );
      setSavedMap(Object.fromEntries(st.savedStories.map((s) => [s, true])));
      const entries = Object.values(st.progress).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setRecentProgress(entries[0]);
    };
    window.addEventListener("ashabi-reader-state-changed", sync);
    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, []);

  function switchSlide(nextIdx: number) {
    if (nextIdx === activeIndex || spotlightItems.length === 0) return;
    setIsTransitioning(true);
    window.setTimeout(() => {
      setActiveIndex(
        ((nextIdx % spotlightItems.length) + spotlightItems.length) %
          spotlightItems.length,
      );
      setIsTransitioning(false);
    }, 180);
  }

  useEffect(() => {
    if (paused || spotlightItems.length <= 1) return;
    const timer = window.setInterval(() => {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % spotlightItems.length);
        setIsTransitioning(false);
      }, 180);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, spotlightItems.length]);

  const active = spotlightItems[activeIndex] ?? spotlightItems[0];
  const storageKey = `anilist-${active?.id ?? 0}`;
  const isFollowed = Boolean(followedMap[storageKey]);
  const isSaved = Boolean(savedMap[storageKey]);

  const resumeStory = recentProgress
    ? stories.find((s) => s.slug === recentProgress.storySlug)
    : undefined;

  if (!active) return null;

  return (
    <div className="space-y-4">
      {/* Spotlight Carousel */}
      <section
        aria-label="Featured Manhwa, Manga, and Anime spotlight"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative overflow-hidden rounded-[28px] border border-[rgba(245,189,67,0.34)] bg-[#060a0e] shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
      >
        {/* Preloaded Crossfading Background Layers (Zero Flicker) */}
        <div className="absolute inset-0">
          {spotlightItems.map((item, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <div
                key={item.id}
                aria-hidden={!isCurrent}
                className={
                  "absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                  (isCurrent
                    ? "opacity-45 scale-105 z-10"
                    : "opacity-0 scale-100 z-0 pointer-events-none")
                }
              >
                <Image
                  src={item.bannerImage || item.coverImage}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            );
          })}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#05070a] via-[#05070a]/92 to-[#05070a]/35" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]/50" />
        </div>

        <div className="relative z-30 grid lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
          {/* Left: Issue Info & Direct Read CTA with Smooth Fade/Translate Transition */}
          <div
            className={
              "lg:col-span-7 space-y-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
              (isTransitioning
                ? "opacity-0 translate-y-2.5"
                : "opacity-100 translate-y-0")
            }
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--gold)] text-[#140c02] shadow-[0_0_24px_rgba(245,189,67,0.4)]">
                <Icon name="flame" size={14} />
                Spotlight #{activeIndex + 1} of {spotlightItems.length}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--border-gold)] bg-black/60 text-[var(--gold-bright)]">
                {active.category} · {active.countryOfOrigin}
              </span>
              {active.averageScore ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-[#48c78e]/40 bg-[#12281e]/85 text-[#68e3ab]">
                  <Icon name="star" size={13} />
                  <span>{active.averageScore}% Score</span>
                </span>
              ) : null}
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 bg-black/50 text-[#9be7c4]">
                {active.chapters
                  ? `${active.chapters} Chapters`
                  : active.episodes
                    ? `${active.episodes} Episodes`
                    : active.status}
              </span>
              {active.popularity ? (
                <span className="text-xs text-[var(--ivory)] opacity-85 font-semibold">
                  {Math.round(active.popularity / 1000)}k Readers
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              {active.nativeTitle ? (
                <p className="text-xs sm:text-sm font-bold tracking-widest text-[var(--gold-bright)] uppercase m-0">
                  {active.nativeTitle}
                </p>
              ) : null}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-strong)] leading-[1.04]">
                {active.title}
              </h1>
              <p className="text-sm sm:text-base font-medium text-[var(--gold-300)] m-0">
                By{" "}
                <strong className="text-[var(--ivory)]">
                  {active.authorName}
                </strong>
                {active.seasonYear ? ` · Released ${active.seasonYear}` : ""} ·{" "}
                <span className="uppercase text-xs tracking-wider text-[var(--gold-bright)]">
                  {active.status}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {active.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 bg-white/[0.06] text-[var(--text-strong)]"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-base text-[var(--text)] max-w-2xl leading-relaxed line-clamp-3">
              {active.description}
            </p>

            {/* Primary Comic Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={`/anilist/${active.id}`}
                onClick={() =>
                  trackEvent({
                    event: "story_opened",
                    story_id: String(active.id),
                    surface: "home_spotlight_anilist",
                  })
                }
                className="button primary"
              >
                <Icon name="play" size={18} />
                <span>Open Series Hub &amp; Links</span>
              </Link>

              <a
                href={active.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="button secondary"
              >
                <Icon name="globe" size={16} />
                <span>Official AniList</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const next = toggleFollowStory(storageKey);
                  setFollowedMap((m) => ({ ...m, [storageKey]: next }));
                }}
                aria-pressed={isFollowed}
                className={
                  "inline-flex items-center gap-2 min-h-[48px] px-4 rounded-full text-xs font-bold border transition-all cursor-pointer " +
                  (isFollowed
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-black/55 text-[var(--text-strong)] hover:border-[var(--border-gold)]")
                }
              >
                <Icon name={isFollowed ? "check" : "bell"} size={16} />
                <span>{isFollowed ? "Subscribed" : "+ Subscribe"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = toggleSaveStory(storageKey);
                  setSavedMap((m) => ({ ...m, [storageKey]: next }));
                }}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from Library" : "Add to Library"}
                className={
                  "inline-grid place-items-center w-12 h-12 rounded-full border transition-all cursor-pointer " +
                  (isSaved
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-black/55 text-[var(--text-strong)] hover:border-[var(--border-gold)]")
                }
              >
                <Icon name="bookmark" size={18} />
              </button>
            </div>
          </div>

          {/* Right: Comic Issue Cover Stack + Prev/Next Controls + Thumbnail Selector Strip */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center gap-5">
            <div className="relative flex items-center gap-3 w-full justify-center">
              {/* Prev Slide Button */}
              <button
                type="button"
                onClick={() => switchSlide(activeIndex - 1)}
                aria-label="Previous spotlight series"
                className="w-10 h-10 rounded-full border border-white/15 bg-black/65 text-[var(--ivory)] hover:border-[var(--border-gold)] hover:text-[var(--gold-bright)] grid place-items-center transition-all cursor-pointer shrink-0"
              >
                <Icon name="arrow-left" size={16} />
              </button>

              {/* Stacked Portrait Cover Card */}
              <Link
                href={`/anilist/${active.id}`}
                className={
                  "group relative w-full max-w-[270px] aspect-[2/3] rounded-[22px] overflow-hidden border-2 border-[rgba(245,189,67,0.55)] shadow-[0_24px_60px_rgba(0,0,0,0.75)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 " +
                  (isTransitioning
                    ? "opacity-30 scale-[0.97]"
                    : "opacity-100 scale-100")
                }
              >
                {spotlightItems.map((item, idx) => (
                  <Image
                    key={item.id}
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="270px"
                    className={
                      "object-cover transition-all duration-700 ease-out group-hover:scale-105 " +
                      (idx === activeIndex ? "opacity-100" : "opacity-0")
                    }
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-[var(--gold-bright)] border border-[var(--border-gold)]">
                    {active.category} #{activeIndex + 1}
                  </span>
                  {active.averageScore ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[rgba(72,199,142,0.25)] border border-[rgba(72,199,142,0.5)] text-[#9be7c4]">
                      {active.averageScore}%
                    </span>
                  ) : null}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[var(--ivory)]">
                  <span className="font-semibold truncate">
                    {active.authorName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--gold-bright)] font-bold shrink-0">
                    Explore <Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>

              {/* Next Slide Button */}
              <button
                type="button"
                onClick={() => switchSlide(activeIndex + 1)}
                aria-label="Next spotlight series"
                className="w-10 h-10 rounded-full border border-white/15 bg-black/65 text-[var(--ivory)] hover:border-[var(--border-gold)] hover:text-[var(--gold-bright)] grid place-items-center transition-all cursor-pointer shrink-0"
              >
                <Icon name="arrow" size={16} />
              </button>
            </div>

            {/* Thumbnail Selector Strip */}
            <div
              role="tablist"
              aria-label="Select spotlight series"
              className="grid grid-cols-6 gap-2 w-full max-w-[360px]"
            >
              {spotlightItems.map((item, idx) => {
                const selected = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Spotlight ${item.title}`}
                    onClick={() => switchSlide(idx)}
                    className={
                      "relative aspect-[2/3] rounded-[10px] overflow-hidden border-2 transition-all duration-300 cursor-pointer " +
                      (selected
                        ? "border-[var(--gold-bright)] scale-105 shadow-[0_0_20px_rgba(245,189,67,0.45)]"
                        : "border-white/15 opacity-55 hover:opacity-90")
                    }
                  >
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Progress Indicator Strip */}
        <div className="relative z-30 h-1 w-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-bright)] transition-all duration-500 ease-out"
            style={{
              width: `${((activeIndex + 1) / spotlightItems.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Instant Continue Reading Bar */}
      {recentProgress && resumeStory ? (
        <section
          aria-label="Continue reading where you left off"
          className="rounded-[20px] border border-[var(--border-gold)] bg-gradient-to-r from-[rgba(245,189,67,0.14)] via-[rgba(12,19,25,0.92)] to-[rgba(12,19,25,0.92)] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-12 h-16 rounded-[10px] overflow-hidden border border-[var(--border-gold)] shrink-0">
              <Image
                src={`/images/${resumeStory.image}.webp`}
                alt={resumeStory.title}
                fill
                sizes="48px"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
                  Continue Reading
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  · {recentProgress.percent}% completed
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-[var(--text-strong)] truncate m-0">
                {resumeStory.title} — Ep. {recentProgress.chapterNumber}:{" "}
                {recentProgress.chapterTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/read/${recentProgress.storySlug}/${recentProgress.chapterSlug}`}
              className="button primary text-xs px-4 py-2.5"
            >
              <Icon name="play" size={15} />
              <span>Resume Episode</span>
            </Link>
            <Link
              href="/library"
              className="text-xs font-semibold text-[var(--gold-bright)] hover:underline"
            >
              My Library
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
