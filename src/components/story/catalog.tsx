"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SafeImage as Image } from "@/components/ui/safe-image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  ANILIST_GENRES,
  type AniListCategory,
  type AniListMedia,
  type AniListTrailer,
} from "@/lib/anilist";
import { searchAniListFromBrowser } from "@/lib/anilist-browser";
import { trackEvent } from "@/lib/analytics";

type DiscoverCategory = "ALL" | AniListCategory | "ORIGINALS";

export function Catalog({
  initialItems = [],
}: {
  initialItems?: AniListMedia[];
}) {
  const params = useSearchParams();
  const router = useRouter();

  const urlQuery = params.get("q") ?? "";
  const urlGenre = params.get("genre") ?? "All";
  const urlCategory = (
    params.get("category") ?? "ALL"
  ).toUpperCase() as DiscoverCategory;
  const urlSort = (params.get("sort") ?? "TRENDING").toUpperCase() as
    | "TRENDING"
    | "POPULARITY"
    | "SCORE";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [items, setItems] = useState<AniListMedia[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(initialItems.length === 0);
  const [activeTrailer, setActiveTrailer] = useState<{
    title: string;
    trailer: AniListTrailer;
  } | null>(null);

  const validGenre = (ANILIST_GENRES as readonly string[]).includes(urlGenre)
    ? urlGenre
    : "All";
  const validCategory: DiscoverCategory = [
    "ALL",
    "MANHWA",
    "MANGA",
    "ANIME",
    "ORIGINALS",
  ].includes(urlCategory)
    ? urlCategory
    : "ALL";
  const validSort = ["TRENDING", "POPULARITY", "SCORE"].includes(urlSort)
    ? urlSort
    : "TRENDING";

  useEffect(() => {
    if (validCategory === "ORIGINALS") {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function fetchCatalog() {
      setLoading(true);
      try {
        const results = await searchAniListFromBrowser(
          {
            query: urlQuery || undefined,
            category: validCategory === "ORIGINALS" ? "ALL" : validCategory,
            genre: validGenre,
            sort: validSort,
          },
          controller.signal,
        );
        if (!cancelled) {
          setItems(results);
        }
      } catch {
        // Keep current items on abort/network error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCatalog();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [urlQuery, validCategory, validGenre, validSort]);

  function buildUrl(overrides: {
    q?: string;
    genre?: string;
    category?: DiscoverCategory;
    sort?: string;
  }) {
    const p = new URLSearchParams();
    const nextQ = overrides.q !== undefined ? overrides.q : urlQuery;
    const nextGenre =
      overrides.genre !== undefined ? overrides.genre : validGenre;
    const nextCategory =
      overrides.category !== undefined ? overrides.category : validCategory;
    const nextSort = overrides.sort !== undefined ? overrides.sort : validSort;

    if (nextQ) p.set("q", nextQ);
    if (nextGenre !== "All") p.set("genre", nextGenre);
    if (nextCategory !== "ALL") p.set("category", nextCategory);
    if (nextSort !== "TRENDING") p.set("sort", nextSort);
    return "/discover" + (p.size ? "?" + p.toString() : "");
  }

  return (
    <div className="space-y-6">
      {/* Search Bar with Search Button */}
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const q = searchInput.trim();
          trackEvent({
            event: "search_performed",
            properties: {
              query_length: q.length,
              genre: validGenre,
              category: validCategory,
            },
          });
          router.push(buildUrl({ q }), { scroll: false });
        }}
      >
        <div className="search-field">
          <Icon name="search" />
          <label className="sr-only" htmlFor="story-search">
            Search Manhwa, Manga, Anime, or Genres
          </label>
          <input
            key={urlQuery}
            id="story-search"
            name="q"
            type="search"
            defaultValue={urlQuery}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Manhwa, Manga, Anime, creators, or genres (e.g. Solo Leveling, Sci-Fi, Fantasy)…"
            maxLength={150}
          />
        </div>
        <button type="submit" className="button primary cursor-pointer">
          <Icon name="search" size={16} />
          <span>{loading ? "Searching…" : "Search"}</span>
        </button>
      </form>

      {/* Category Switcher (All / Manhwa / Manga / Anime / African Originals) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div
          role="tablist"
          aria-label="Catalog categories"
          className="flex flex-wrap items-center gap-2"
        >
          {(
            [
              { id: "ALL", label: "All Global Series" },
              { id: "MANHWA", label: "Manhwa (KR Webtoons)" },
              { id: "MANGA", label: "Manga (JP)" },
              { id: "ANIME", label: "Anime (TV & Film)" },
              { id: "ORIGINALS", label: "African Launch Originals · Soon" },
            ] as const
          ).map((cat) => {
            const active = validCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={buildUrl({ category: cat.id })}
                scroll={false}
                className={
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold border transition-all " +
                  (active
                    ? "border-[var(--border-gold)] bg-[var(--gold)] text-[#140c02] shadow-[var(--gold-glow)]"
                    : "border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] hover:border-[var(--border-gold)]")
                }
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {validCategory !== "ORIGINALS" ? (
          <label className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>Sort by:</span>
            <select
              value={validSort}
              onChange={(e) =>
                router.push(buildUrl({ sort: e.target.value }), {
                  scroll: false,
                })
              }
              className="rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-3.5 py-1.5 text-xs font-bold text-[var(--text-strong)]"
            >
              <option value="TRENDING">Trending Now</option>
              <option value="POPULARITY">Most Popular</option>
              <option value="SCORE">Highest Rated</option>
            </select>
          </label>
        ) : null}
      </div>

      {/* Genre Tabs (Action, Adventure, Fantasy, Sci-Fi, Romance, Drama, Mystery, Supernatural, Comedy, Thriller) */}
      {validCategory !== "ORIGINALS" ? (
        <nav
          aria-label="Filter by genre"
          className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          {ANILIST_GENRES.map((g) => {
            const active = validGenre === g;
            return (
              <Link
                key={g}
                href={buildUrl({ genre: g })}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all " +
                  (active
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.2)] text-[var(--gold-bright)] shadow-[var(--gold-glow)]"
                    : "border-[var(--border)] bg-white/[0.03] text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:border-[var(--border-gold)]")
                }
              >
                {g}
              </Link>
            );
          })}
        </nav>
      ) : null}

      {/* Results Header */}
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <span role="status">
          {validCategory === "ORIGINALS" ? (
            <span className="text-[var(--gold-bright)] font-bold">
              Ashabi Originals · In Active Development (Coming Soon)
            </span>
          ) : loading ? (
            <span className="text-[var(--gold-bright)] font-bold">
              Fetching live {validGenre !== "All" ? `${validGenre} ` : ""}
              series from AniList…
            </span>
          ) : (
            <>
              Showing <strong className="text-[var(--ivory)]">{items.length}</strong>{" "}
              {validGenre !== "All" ? `${validGenre} ` : ""}
              {validCategory === "ALL" ? "series" : validCategory.toLowerCase()}
              {urlQuery ? ` matching “${urlQuery}”` : ""}
            </>
          )}
        </span>

        {(validGenre !== "All" || urlQuery || validCategory !== "ALL") ? (
          <Link
            href="/discover"
            className="text-[var(--gold-bright)] font-bold hover:underline"
          >
            Reset all filters
          </Link>
        ) : null}
      </div>

      {/* Results Grid */}
      {validCategory === "ORIGINALS" ? (
        <section className="liquid-glass-gold rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-[var(--gold-bright)] bg-[rgba(245,189,67,0.12)] border border-[rgba(245,189,67,0.3)]">
            In Active Development · Coming Soon
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-strong)] m-0">
            Ashabi African Launch Originals
          </h2>

          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed max-w-xl mx-auto m-0">
            Our flagship slate of original African comics, webtoons, graphic
            novels, and illustrated universes is currently in active production.
            As Ashabi Originals launch, third-party preview titles will
            gradually be phased out.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/welcome"
              className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold"
            >
              <span>Read Founder’s Vision</span>
            </Link>

            <Link
              href="/discover?category=MANHWA"
              className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
            >
              <span>Explore Preview Catalogue</span>
            </Link>

            <a
              href="https://wa.me/2349048964270?text=Hello%2C%20I%20am%20interested%20in%20Ashabi%20African%20Launch%20Originals."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Message the Founder on WhatsApp"
              className="whatsapp-glass-btn w-9 h-9 rounded-full grid place-items-center"
            >
              <Icon name="whatsapp" size={16} />
            </a>
          </div>
        </section>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-[20px] overflow-hidden border border-[var(--border)] bg-[#070c12] flex flex-col justify-between transition-all hover:-translate-y-1.5 hover:border-[var(--border-gold)]"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Link href={`/anilist/${item.id}`} className="block w-full h-full">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width:640px) 48vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070c12] via-transparent to-black/35" />
                </Link>

                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[var(--gold)] text-[#140c02]">
                  {item.category}
                </span>

                {item.averageScore ? (
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#12281e]/90 text-[#68e3ab]">
                    <Icon name="star" size={11} />
                    <span>{item.averageScore}%</span>
                  </span>
                ) : null}

                {item.trailer ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTrailer({
                        title: item.title,
                        trailer: item.trailer!,
                      })
                    }
                    className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/85 text-[var(--gold-bright)] border border-[var(--border-gold)] hover:bg-[var(--gold)] hover:text-[#140c02] cursor-pointer"
                  >
                    <Icon name="play" size={10} />
                    <span>Trailer</span>
                  </button>
                ) : null}
              </div>

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
          ))}
        </div>
      ) : !loading ? (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h2>No matching titles found</h2>
          <p>
            Try another search keyword or reset your active genre/category
            filters.
          </p>
          <Link href="/discover" className="button secondary">
            Reset all filters
          </Link>
        </div>
      ) : null}

      {/* Trailer Lightbox Modal */}
      {activeTrailer ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeTrailer.title} Official Trailer`}
          className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveTrailer(null)}
        >
          <div
            className="w-full max-w-4xl rounded-[24px] border border-[var(--border-gold)] bg-[#070b10] overflow-hidden shadow-[0_32px_90px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[var(--gold)] text-[#140c02]">
                  Official Trailer
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-strong)] truncate m-0">
                  {activeTrailer.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrailer(null)}
                aria-label="Close trailer"
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 grid place-items-center text-[var(--ivory)] hover:border-[var(--border-gold)] cursor-pointer"
              >
                <Icon name="close" size={15} />
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
