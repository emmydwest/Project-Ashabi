"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type {
  AniListCategory,
  AniListHomeFeed,
  AniListMedia,
} from "@/lib/anilist";

interface Props {
  feed: AniListHomeFeed;
}

const TABS: {
  id: AniListCategory;
  label: string;
  sublabel: string;
  badge: string;
}[] = [
  {
    id: "MANHWA",
    label: "Trending Manhwa",
    sublabel: "Korean Vertical Webtoons",
    badge: "KR · WEBTOON",
  },
  {
    id: "MANGA",
    label: "Trending Manga",
    sublabel: "Serialized Japanese Manga",
    badge: "JP · MANGA",
  },
  {
    id: "ANIME",
    label: "Trending Anime",
    sublabel: "Top Airing & Popular Series",
    badge: "TV · ANIME",
  },
];

export function AniListHub({ feed }: Props) {
  const [activeTab, setActiveTab] = useState<AniListCategory>("MANHWA");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  const itemsForTab: AniListMedia[] = useMemo(() => {
    if (activeTab === "MANHWA") return feed.manhwa;
    if (activeTab === "MANGA") return feed.manga;
    return feed.anime;
  }, [activeTab, feed]);

  const availableGenres = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const item of itemsForTab) {
      for (const g of item.genres) {
        set.add(g);
      }
    }
    return Array.from(set).slice(0, 8);
  }, [itemsForTab]);

  const filteredItems = useMemo(() => {
    if (selectedGenre === "All") return itemsForTab;
    return itemsForTab.filter((item) => item.genres.includes(selectedGenre));
  }, [itemsForTab, selectedGenre]);

  const safeSpotlightIndex =
    spotlightIndex < filteredItems.length ? spotlightIndex : 0;
  const spotlight = filteredItems[safeSpotlightIndex] ?? itemsForTab[0];

  function handleTabChange(nextTab: AniListCategory) {
    setActiveTab(nextTab);
    setSelectedGenre("All");
    setSpotlightIndex(0);
  }

  return (
    <section
      aria-labelledby="anilist-hub-heading"
      className="rounded-[30px] border border-[rgba(245,189,67,0.3)] bg-gradient-to-b from-[#0b131b] via-[#070b10] to-[#05070a] p-5 sm:p-8 lg:p-10 space-y-8 shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
    >
      {/* Top Header + Category Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[var(--border)] pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[var(--gold)] text-[#140c02]">
              <Icon name="flame" size={13} />
              <span>Live AniList Pulse</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/[0.06] text-[var(--ivory)] border border-white/10">
              {feed.source === "live"
                ? "Synced with AniList GraphQL"
                : "Offline Snapshot"}
            </span>
          </div>
          <h2
            id="anilist-hub-heading"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight m-0"
          >
            Global Manhwa, Manga &amp; Anime Charts
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl m-0">
            Explore real-time trending South Korean manhwa webtoons, Japanese
            manga, and anime series powered by AniList. Click any series for
            character rosters, official reading links, and recommendations.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="AniList media categories"
          className="grid grid-cols-3 gap-2 bg-[#05080c] p-1.5 rounded-[18px] border border-[var(--border)] shrink-0"
        >
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab.id)}
                className={
                  "px-3.5 sm:px-5 py-2.5 rounded-[14px] text-left transition-all cursor-pointer " +
                  (active
                    ? "bg-gradient-to-br from-[#f5bd43] to-[#d99116] text-[#140c02] shadow-[var(--gold-glow)]"
                    : "bg-transparent text-[var(--text)] hover:bg-white/[0.04]")
                }
              >
                <span
                  className={
                    "block text-[10px] font-extrabold uppercase tracking-wider " +
                    (active ? "text-[#140c02]/80" : "text-[var(--gold-bright)]")
                  }
                >
                  {tab.badge}
                </span>
                <span className="block text-xs sm:text-sm font-extrabold whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre Sub-Filter Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {availableGenres.map((genre) => {
            const active = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => {
                  setSelectedGenre(genre);
                  setSpotlightIndex(0);
                }}
                className={
                  "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer " +
                  (active
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-white/[0.02] text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:border-white/20")
                }
              >
                {genre}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[var(--text-muted)]">
          Showing <strong className="text-[var(--ivory)]">{filteredItems.length}</strong>{" "}
          trending {activeTab.toLowerCase()} titles
        </span>
      </div>

      {/* Featured Spotlight Banner for Selected Category */}
      {spotlight ? (
        <div className="relative rounded-[24px] overflow-hidden border border-[rgba(245,189,67,0.32)] bg-[#060a0e]">
          {/* Banner Backdrop */}
          <div className="absolute inset-0">
            <Image
              src={spotlight.bannerImage || spotlight.coverImage}
              alt={spotlight.title}
              fill
              sizes="(max-width:1280px) 100vw, 1400px"
              className="object-cover opacity-30 scale-105 blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/90 to-[#05070a]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/40" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-6 p-5 sm:p-7 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[var(--gold)] text-[#140c02]">
                  #{safeSpotlightIndex + 1} in {activeTab}
                </span>
                {spotlight.averageScore ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#48c78e]/20 text-[#68e3ab] border border-[#48c78e]/40">
                    <Icon name="star" size={13} />
                    <span>{spotlight.averageScore}% Score</span>
                  </span>
                ) : null}
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 text-[var(--ivory)]">
                  {spotlight.status}
                </span>
                {spotlight.chapters ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-[var(--text-muted)]">
                    {spotlight.chapters} Chapters
                  </span>
                ) : null}
                {spotlight.episodes ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-[var(--text-muted)]">
                    {spotlight.episodes} Episodes
                  </span>
                ) : null}
              </div>

              <div>
                {spotlight.nativeTitle ? (
                  <p className="text-xs font-bold tracking-widest text-[var(--gold-bright)] uppercase mb-1">
                    {spotlight.nativeTitle}
                  </p>
                ) : null}
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text-strong)] leading-tight m-0">
                  {spotlight.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-0">
                  Creator / Studio:{" "}
                  <strong className="text-[var(--ivory)]">
                    {spotlight.authorName}
                  </strong>{" "}
                  {spotlight.seasonYear ? `· ${spotlight.seasonYear}` : ""}
                </p>
              </div>

              <p className="text-sm text-[var(--text)] line-clamp-3 max-w-2xl m-0">
                {spotlight.description}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {spotlight.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/[0.06] border border-white/10 text-[var(--ivory)]"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/anilist/${spotlight.id}`}
                  className="button primary"
                >
                  <Icon name="book" size={17} />
                  <span>Open Series Hub &amp; Links</span>
                </Link>
                <a
                  href={spotlight.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button secondary"
                >
                  <Icon name="globe" size={16} />
                  <span>View on AniList</span>
                </a>
              </div>
            </div>

            {/* Right Cover Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href={`/anilist/${spotlight.id}`}
                className="group relative w-44 sm:w-52 aspect-[2/3] rounded-[18px] overflow-hidden border-2 border-[rgba(245,189,67,0.45)] shadow-[0_20px_50px_rgba(0,0,0,0.75)] transition-transform hover:-translate-y-1"
              >
                <Image
                  src={spotlight.coverImage}
                  alt={spotlight.title}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[11px] font-bold text-[var(--ivory)]">
                  <span className="px-2 py-0.5 rounded bg-black/75 border border-white/15">
                    {spotlight.countryOfOrigin === "KR"
                      ? "KR Manhwa"
                      : spotlight.category}
                  </span>
                  {spotlight.popularity ? (
                    <span className="px-2 py-0.5 rounded bg-[var(--gold)] text-[#140c02] font-extrabold">
                      {Math.round(spotlight.popularity / 1000)}k fans
                    </span>
                  ) : null}
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* 10-Series Comic Poster Shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {filteredItems.map((item, idx) => {
          const isHighlighted = item.id === spotlight?.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setSpotlightIndex(idx)}
              className={
                "group rounded-[20px] overflow-hidden border bg-[#070c12] flex flex-col justify-between transition-all hover:-translate-y-1.5 " +
                (isHighlighted
                  ? "border-[var(--gold)] shadow-[0_14px_34px_rgba(245,189,67,0.18)]"
                  : "border-[var(--border)] hover:border-[var(--border-gold)]")
              }
            >
              <Link
                href={`/anilist/${item.id}`}
                className="relative aspect-[2/3] w-full overflow-hidden block"
              >
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width:640px) 48vw, (max-width:1024px) 24vw, 19vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c12] via-transparent to-black/35" />

                {/* Top Left Rank Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-black/80 text-[var(--gold-bright)] border border-[rgba(245,189,67,0.4)] backdrop-blur-sm">
                  #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>

                {/* Top Right Score */}
                {item.averageScore ? (
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#12281e]/90 text-[#68e3ab] border border-[#48c78e]/40">
                    <Icon name="star" size={11} />
                    <span>{item.averageScore}%</span>
                  </span>
                ) : null}

                {/* Bottom Overlay Metadata */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-[var(--gold)] text-[#140c02] uppercase">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/75 text-[var(--ivory)] border border-white/10 truncate">
                    {item.chapters
                      ? `${item.chapters} Ch`
                      : item.episodes
                        ? `${item.episodes} Ep`
                        : item.status}
                  </span>
                </div>
              </Link>

              <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] truncate">
                    {item.genres.slice(0, 2).join(" · ") || item.category}
                  </div>
                  <Link href={`/anilist/${item.id}`}>
                    <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] line-clamp-1 m-0">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 m-0">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-[var(--text-muted)] truncate">
                    {item.authorName}
                  </span>
                  <Link
                    href={`/anilist/${item.id}`}
                    className="inline-flex items-center gap-1 font-bold text-[var(--gold-bright)] shrink-0"
                  >
                    <span>Explore</span>
                    <Icon name="arrow" size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
