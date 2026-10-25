"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Flame,
  Play,
  X,
} from "lucide-react";
import type { AniListMedia, AniListTrailer } from "@/lib/anilist";
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

const SLIDE_DURATION_MS = 7000;

export function HomeComicStage({ spotlightItems, stories }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<{
    title: string;
    trailer: AniListTrailer;
  } | null>(null);
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
    if (paused || activeTrailer || spotlightItems.length <= 1) return;
    const timer = window.setInterval(() => {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % spotlightItems.length);
        setIsTransitioning(false);
      }, 180);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, activeTrailer, spotlightItems.length]);

  const active = spotlightItems[activeIndex] ?? spotlightItems[0];
  const storageKey = `anilist-${active?.id ?? 0}`;
  const isFollowed = Boolean(followedMap[storageKey]);
  const isSaved = Boolean(savedMap[storageKey]);

  const resumeStory = recentProgress
    ? stories.find((s) => s.slug === recentProgress.storySlug)
    : undefined;

  if (!active) return null;

  return (
    <div className="space-y-5">
      {/* Liquid Glass Hero Stage */}
      <section
        aria-label="Featured series spotlight"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="liquid-glass relative overflow-hidden rounded-[32px]"
      >
        {/* Crossfading Atmospheric Backdrops */}
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
                    ? "opacity-40 scale-105 z-10"
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
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#05070a] via-[#05070a]/90 to-[#05070a]/30" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#05070a] via-transparent to-black/30" />
        </div>

        <div className="relative z-30 grid lg:grid-cols-12 gap-10 p-7 sm:p-12 lg:p-14 items-center">
          {/* Left: Editorial Copy & Actions */}
          <div
            className={
              "lg:col-span-7 space-y-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
              (isTransitioning
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0")
            }
          >
            {/* Clean 2-Pill Eyebrow */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="neu-pill-active inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>
                  {active.category} · #{activeIndex + 1}
                </span>
              </span>
              <span className="text-xs font-semibold text-[var(--gold-300)] tracking-wide">
                {active.genres.slice(0, 3).join(" · ")}
                {active.averageScore ? ` · ${active.averageScore}% Rated` : ""}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-strong)] leading-[1.04] m-0">
                {active.title}
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-muted)] m-0">
                By{" "}
                <strong className="text-[var(--ivory)]">
                  {active.authorName}
                </strong>
                {active.chapters ? ` · ${active.chapters} Chapters` : ""}
                {active.episodes ? ` · ${active.episodes} Episodes` : ""}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[var(--text)] max-w-2xl leading-relaxed line-clamp-3 m-0">
              {active.description}
            </p>

            {/* Tactile Neumorphic & Liquid Glass Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={`/anilist/${active.id}`}
                onClick={() =>
                  trackEvent({
                    event: "story_opened",
                    story_id: String(active.id),
                    surface: "home_spotlight_anilist",
                  })
                }
                className="neu-pill-active inline-flex items-center gap-2.5 min-h-[50px] px-7 rounded-full text-xs sm:text-sm font-extrabold"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Read Info &amp; Chapters</span>
              </Link>

              {active.trailer ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTrailer({
                      title: active.title,
                      trailer: active.trailer!,
                    })
                  }
                  className="neu-pill inline-flex items-center gap-2 min-h-[50px] px-5 rounded-full text-xs sm:text-sm font-bold text-[var(--text-strong)] cursor-pointer"
                >
                  <Clapperboard className="w-4 h-4 text-[var(--gold-bright)]" />
                  <span>Watch Trailer</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  const next = toggleFollowStory(storageKey);
                  setFollowedMap((m) => ({ ...m, [storageKey]: next }));
                }}
                aria-pressed={isFollowed}
                className={
                  "neu-pill inline-flex items-center gap-2 min-h-[50px] px-5 rounded-full text-xs font-bold cursor-pointer " +
                  (isFollowed
                    ? "text-[var(--gold-bright)] border-[var(--border-gold)]"
                    : "text-[var(--text)]")
                }
              >
                {isFollowed ? (
                  <Check className="w-4 h-4 text-[var(--gold-bright)]" />
                ) : (
                  <Bell className="w-4 h-4 text-[var(--gold)]" />
                )}
                <span>{isFollowed ? "Subscribed" : "Subscribe"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = toggleSaveStory(storageKey);
                  setSavedMap((m) => ({ ...m, [storageKey]: next }));
                }}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from Library" : "Save to Library"}
                className={
                  "neu-pill inline-grid place-items-center w-[50px] h-[50px] rounded-full cursor-pointer " +
                  (isSaved
                    ? "text-[var(--gold-bright)] border-[var(--border-gold)]"
                    : "text-[var(--text)]")
                }
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isSaved ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {/* Right: Clean Poster Cover + Minimalist Selector */}
          <div className="lg:col-span-5 flex flex-col items-center gap-5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => switchSlide(activeIndex - 1)}
                aria-label="Previous spotlight series"
                className="neu-pill w-11 h-11 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <Link
                href={`/anilist/${active.id}`}
                className={
                  "neu-card group relative w-56 sm:w-64 aspect-[2/3] rounded-[24px] overflow-hidden transition-all duration-500 " +
                  (isTransitioning
                    ? "opacity-40 scale-[0.97]"
                    : "opacity-100 scale-100")
                }
              >
                {spotlightItems.map((item, idx) => (
                  <Image
                    key={item.id}
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="256px"
                    className={
                      "object-cover transition-all duration-700 ease-out group-hover:scale-105 " +
                      (idx === activeIndex ? "opacity-100" : "opacity-0")
                    }
                  />
                ))}
              </Link>

              <button
                type="button"
                onClick={() => switchSlide(activeIndex + 1)}
                aria-label="Next spotlight series"
                className="neu-pill w-11 h-11 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Dot & Thumbnail Strip */}
            <div
              role="tablist"
              aria-label="Select spotlight series"
              className="neu-inset p-1.5 rounded-2xl grid grid-cols-6 gap-2 w-full max-w-[330px]"
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
                      "relative aspect-[2/3] rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer " +
                      (selected
                        ? "border-[var(--gold-bright)] scale-105 shadow-[0_0_16px_rgba(245,189,67,0.4)]"
                        : "border-transparent opacity-45 hover:opacity-85")
                    }
                  >
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="52px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Instant Continue Reading Bar */}
      {recentProgress && resumeStory ? (
        <section
          aria-label="Continue reading where you left off"
          className="liquid-glass-gold rounded-[22px] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-11 h-15 rounded-xl overflow-hidden border border-white/15 shrink-0">
              <Image
                src={`/images/${resumeStory.image}.webp`}
                alt={resumeStory.title}
                fill
                sizes="44px"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block">
                Continue Reading · {recentProgress.percent}%
              </span>
              <p className="text-sm sm:text-base font-bold text-[var(--text-strong)] truncate m-0">
                {resumeStory.title} — Ep. {recentProgress.chapterNumber}:{" "}
                {recentProgress.chapterTitle}
              </p>
            </div>
          </div>

          <Link
            href={`/read/${recentProgress.storySlug}/${recentProgress.chapterSlug}`}
            className="neu-pill-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </Link>
        </section>
      ) : null}

      {/* Trailer Modal */}
      {activeTrailer ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeTrailer.title} Official Trailer`}
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveTrailer(null)}
        >
          <div
            className="liquid-glass-gold w-full max-w-4xl rounded-[28px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Clapperboard className="w-4 h-4 text-[var(--gold-bright)]" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-strong)] truncate m-0">
                  {activeTrailer.title} — Official Trailer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrailer(null)}
                aria-label="Close trailer"
                className="neu-pill w-8 h-8 rounded-full grid place-items-center text-[var(--ivory)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeTrailer.trailer.embedUrl}
                title={`${activeTrailer.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
