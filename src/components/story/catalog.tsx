"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryCard } from "./story-card";
import {
  contentFormats,
  filterStories,
  genres,
  releaseStatuses,
} from "@/lib/stories";
import { trackEvent } from "@/lib/analytics";

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const selectedGenre = params.get("genre") ?? "All";
  const selectedFormat = params.get("format") ?? "All";
  const selectedStatus = params.get("status") ?? "All";
  const selectedSort = (params.get("sort") ?? "featured") as
    | "featured"
    | "recent"
    | "title";

  const genre = genres.includes(selectedGenre) ? selectedGenre : "All";
  const format = (contentFormats as readonly string[]).includes(selectedFormat)
    ? selectedFormat
    : "All";
  const status = (releaseStatuses as readonly string[]).includes(selectedStatus)
    ? selectedStatus
    : "All";
  const sort = ["featured", "recent", "title"].includes(selectedSort)
    ? selectedSort
    : "featured";

  const results = filterStories(query, genre, { format, status, sort });

  function buildUrl(overrides: {
    q?: string;
    genre?: string;
    format?: string;
    status?: string;
    sort?: string;
  }) {
    const p = new URLSearchParams();
    const nextQ = overrides.q !== undefined ? overrides.q : query;
    const nextGenre = overrides.genre !== undefined ? overrides.genre : genre;
    const nextFormat =
      overrides.format !== undefined ? overrides.format : format;
    const nextStatus =
      overrides.status !== undefined ? overrides.status : status;
    const nextSort = overrides.sort !== undefined ? overrides.sort : sort;

    if (nextQ) p.set("q", nextQ);
    if (nextGenre !== "All") p.set("genre", nextGenre);
    if (nextFormat !== "All") p.set("format", nextFormat);
    if (nextStatus !== "All") p.set("status", nextStatus);
    if (nextSort !== "featured") p.set("sort", nextSort);
    return "/discover" + (p.size ? "?" + p.toString() : "");
  }

  return (
    <>
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const q = String(data.get("q") ?? "").trim();
          trackEvent({
            event: "search_performed",
            properties: {
              query_length: q.length,
              genre,
              format,
              status,
            },
          });
          router.push(buildUrl({ q }), { scroll: false });
        }}
      >
        <div className="search-field">
          <Icon name="search" />
          <label className="sr-only" htmlFor="story-search">
            Search stories, creators, or genres
          </label>
          <input
            key={query}
            id="story-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search titles, creators, worlds, or genres"
            maxLength={150}
          />
        </div>
        <button type="submit" className="button primary">
          Search
        </button>
      </form>

      <nav className="filter-list" aria-label="Filter by genre">
        {genres.map((g) => (
          <Link
            key={g}
            href={buildUrl({ genre: g })}
            scroll={false}
            aria-current={genre === g ? "true" : undefined}
          >
            {g}
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4 my-4 pb-4 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by format">
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] mr-1">
            Format:
          </span>
          {contentFormats.map((f) => {
            const active = format === f;
            return (
              <Link
                key={f}
                href={buildUrl({ format: f })}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                  (active
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-white/[0.03] text-[var(--text-muted)] hover:text-[var(--text-strong)]")
                }
              >
                {f}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5" role="group" aria-label="Release status">
            {releaseStatuses.map((s) => {
              const active = status === s;
              return (
                <Link
                  key={s}
                  href={buildUrl({ status: s })}
                  scroll={false}
                  className={
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                    (active
                      ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)]"
                      : "border-[var(--border)] bg-white/[0.03] text-[var(--text-muted)] hover:text-[var(--text-strong)]")
                  }
                >
                  {s}
                </Link>
              );
            })}
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>Sort:</span>
            <select
              value={sort}
              onChange={(e) =>
                router.push(buildUrl({ sort: e.target.value }), {
                  scroll: false,
                })
              }
              className="rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-xs text-[var(--text-strong)]"
            >
              <option value="featured">Curated order</option>
              <option value="recent">Recently updated</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </label>
        </div>
      </div>

      <p className="result-count" role="status">
        {results.length} free {results.length === 1 ? "story" : "stories"}
        {genre !== "All" ? " · " + genre : ""}
        {format !== "All" ? " · " + format : ""}
        {status !== "All" ? " · " + status : ""}
        {query ? " matching “" + query + "”" : ""}
      </p>

      {results.length ? (
        <div className="story-grid">
          {results.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h2>No matching stories found</h2>
          <p>
            No published titles match your current search or filter combination.
            Try clearing a filter or exploring another genre.
          </p>
          <Link href="/discover" className="button secondary">
            Reset all filters
          </Link>
        </div>
      )}

      <p className="demo-note">
        All published stories on Ashabi are free to read during our beta
        validation period—no subscription or account required to start reading.
      </p>
    </>
  );
}
