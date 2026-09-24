"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryCard } from "./story-card";
import { filterStories, genres } from "@/lib/stories";
export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const selected = params.get("genre") ?? "All";
  const genre = genres.includes(selected) ? selected : "All";
  const results = filterStories(query, genre);
  function filterUrl(nextGenre: string) {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (nextGenre !== "All") p.set("genre", nextGenre);
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
          const p = new URLSearchParams();
          const q = String(data.get("q") ?? "").trim();
          if (q) p.set("q", q);
          if (genre !== "All") p.set("genre", genre);
          router.push("/discover" + (p.size ? "?" + p.toString() : ""), {
            scroll: false,
          });
        }}
      >
        <div className="search-field">
          <Icon name="search" />
          <label className="sr-only" htmlFor="story-search">
            Search stories
          </label>
          <input
            key={query}
            id="story-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search titles, worlds, or genres"
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
            href={filterUrl(g)}
            scroll={false}
            aria-current={genre === g ? "true" : undefined}
          >
            {g}
          </Link>
        ))}
      </nav>
      <p className="result-count" role="status">
        {results.length} concept {results.length === 1 ? "story" : "stories"}
        {genre !== "All" ? " · " + genre : ""}
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
          <h2>No stories found</h2>
          <p>Try a different title or explore another genre.</p>
          <Link href="/discover" className="button secondary">
            Clear all filters
          </Link>
        </div>
      )}
      <p className="demo-note">
        Sample titles and concept artwork. Chapters and reader accounts are not
        available in this first look.
      </p>
    </>
  );
}
