"use client";

import { useState, useEffect, useMemo } from "react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import Link from "next/link";
import { Clapperboard, Search, X } from "lucide-react";
import {
  ANILIST_GENRES,
  toAniListCard,
  type AniListCard,
  type AniListCategory,
  type AniListTrailer,
} from "@/lib/anilist";
import { searchAniListFromBrowser } from "@/lib/anilist-browser";

interface Props {
  feed: {
    manhwa: AniListCard[];
    manga: AniListCard[];
    anime: AniListCard[];
  };
}

const TABS: {
  id: AniListCategory;
  label: string;
}[] = [
  { id: "MANHWA", label: "Manhwa" },
  { id: "MANGA", label: "Manga" },
  { id: "ANIME", label: "Anime" },
];

export function AniListHub({ feed }: Props) {
  const [activeTab, setActiveTab] = useState<AniListCategory>("MANHWA");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchInput, setSearchInput] = useState<string>("");
  const [submittedSearch, setSubmittedSearch] = useState<string>("");
  const [remoteResults, setRemoteResults] = useState<AniListCard[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTrailer, setActiveTrailer] = useState<{
    title: string;
    trailer: AniListTrailer;
  } | null>(null);

  const baseItemsForTab: AniListCard[] = useMemo(() => {
    if (activeTab === "MANHWA") return feed.manhwa;
    if (activeTab === "MANGA") return feed.manga;
    return feed.anime;
  }, [activeTab, feed]);

  useEffect(() => {
    if (selectedGenre === "All" && !submittedSearch) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function loadFiltered() {
      setLoading(true);
      try {
        const results = await searchAniListFromBrowser(
          {
            category: activeTab,
            genre: selectedGenre,
            query: submittedSearch || undefined,
          },
          controller.signal,
        );
        if (!cancelled) {
          setRemoteResults(results.map((item) => toAniListCard(item)));
        }
      } catch {
        if (!cancelled) {
          const fallback = baseItemsForTab.filter((item) => {
            if (
              selectedGenre !== "All" &&
              !item.genres.includes(selectedGenre)
            ) {
              return false;
            }
            if (
              submittedSearch &&
              !item.title.toLowerCase().includes(submittedSearch.toLowerCase())
            ) {
              return false;
            }
            return true;
          });
          setRemoteResults(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFiltered();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeTab, selectedGenre, submittedSearch, baseItemsForTab]);

  const displayedItems =
    selectedGenre === "All" && !submittedSearch
      ? baseItemsForTab
      : (remoteResults ?? baseItemsForTab);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedSearch(searchInput.trim());
  }

  return (
    <section
      id="anilist-hub-section"
      aria-labelledby="anilist-hub-heading"
      className="space-y-8"
    >
      {/* Clean Header + Tactile Neumorphic Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <p className="eyebrow m-0">Explore By Format &amp; Genre</p>
          <h2
            id="anilist-hub-heading"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight m-0"
          >
            Trending Series Catalog
          </h2>
        </div>

        {/* Neumorphic Segmented Control */}
        <div
          role="tablist"
          aria-label="Media categories"
          className="neu-inset p-1.5 rounded-full inline-flex items-center gap-1.5 self-start"
        >
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={
                  "px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer " +
                  (active
                    ? "neu-pill-active"
                    : "text-[var(--text-muted)] hover:text-[var(--text-strong)]")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liquid Glass Filter & Search Bar */}
      <div className="liquid-glass rounded-[24px] p-4 sm:p-5 space-y-4">
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="flex flex-wrap sm:flex-nowrap items-center gap-3"
        >
          <div className="neu-inset flex-1 min-w-[220px] flex items-center rounded-full px-4 py-2.5 focus-within:border-[var(--border-gold)]">
            <Search className="w-4 h-4 text-[var(--text-muted)] mr-3 shrink-0" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!e.target.value.trim()) {
                  setSubmittedSearch("");
                }
              }}
              placeholder={`Search ${activeTab.toLowerCase()} titles (e.g. Solo Leveling, Omniscient Reader, One Piece)…`}
              aria-label="Search series"
              className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="neu-pill-active inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? "Searching…" : "Search"}</span>
          </button>
          {selectedGenre !== "All" || submittedSearch ? (
            <button
              type="button"
              onClick={() => {
                setSelectedGenre("All");
                setSearchInput("");
                setSubmittedSearch("");
                setRemoteResults(null);
              }}
              className="neu-pill px-5 py-3 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
            >
              Reset
            </button>
          ) : null}
        </form>

        {/* Clean Genre Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {ANILIST_GENRES.map((genre) => {
            const active = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer " +
                  (active
                    ? "neu-pill-active"
                    : "neu-pill text-[var(--text-muted)]")
                }
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean WEBTOON / Comic Republic Style Poster Grid */}
      {displayedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6">
          {displayedItems.slice(0, 12).map((item, index) => (
            <div key={item.id} className="group flex flex-col gap-3">
              <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
                <Link
                  href={`/anilist/${item.id}`}
                  className="block w-full h-full"
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    priority={index < 4}
                    sizes="(max-width:640px) 46vw, (max-width:1024px) 24vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </Link>

                {item.trailer ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTrailer({
                        title: item.title,
                        trailer: item.trailer!,
                      })
                    }
                    className="liquid-glass absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-[var(--gold-bright)] hover:text-white cursor-pointer"
                  >
                    <Clapperboard className="w-3 h-3" />
                    <span>Trailer</span>
                  </button>
                ) : null}
              </div>

              <div className="px-1 space-y-0.5">
                <p className="text-[11px] font-bold text-[var(--gold)] truncate m-0">
                  {item.genres[0] || item.category}
                  {item.averageScore ? ` · ${item.averageScore}%` : ""}
                </p>
                <Link href={`/anilist/${item.id}`}>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-[var(--text-muted)] truncate m-0">
                  {item.authorName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass rounded-[24px] p-10 text-center space-y-3">
          <p className="text-base font-bold text-[var(--text-strong)] m-0">
            No {activeTab.toLowerCase()} titles matched that filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre("All");
              setSearchInput("");
              setSubmittedSearch("");
              setRemoteResults(null);
            }}
            className="neu-pill px-5 py-2.5 rounded-full text-xs font-bold text-[var(--ivory)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

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
    </section>
  );
}
