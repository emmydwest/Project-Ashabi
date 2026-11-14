"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Search, ShieldAlert } from "lucide-react";
import { MatureCatalogGrid } from "@/components/story/mature-catalog-grid";
import type { AniListCard } from "@/lib/anilist";

export function MatureCatalogue({
  adultItems,
  darkItems,
}: {
  adultItems: AniListCard[];
  darkItems: AniListCard[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q")?.trim() ?? "";
  const category =
    params.get("category") === "MANHWA" || params.get("category") === "MANGA"
      ? (params.get("category") as "MANHWA" | "MANGA")
      : "ALL";
  const mode = params.get("mode") === "DARK_SEINEN" ? "DARK_SEINEN" : "ADULT_18";

  const source = mode === "DARK_SEINEN" ? darkItems : adultItems;
  const initialItems = useMemo(() => {
    const q = query.toLowerCase();
    return source.filter((item) => {
      if (category !== "ALL" && item.category !== category) return false;
      if (q && !item.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [source, category, query]);

  function buildHref(
    nextCategory = category,
    nextMode: "ADULT_18" | "DARK_SEINEN" = mode,
    nextQuery = query,
  ) {
    const next = new URLSearchParams();
    if (nextQuery) next.set("q", nextQuery);
    if (nextCategory !== "ALL") next.set("category", nextCategory);
    if (nextMode !== "ADULT_18") next.set("mode", nextMode);
    const qs = next.toString();
    return `/mature${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#ff8a8a] bg-[#ff6b6b]/15 border border-[#ff6b6b]/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>18+ Verified Adult &amp; Mature Hub</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-strong)] m-0">
              18+ Mature Manhwa &amp; Manga
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl m-0">
              Browse uncut 18+ adult webtoons, mature romance, and dark seinen
              graphic fiction. Click any cover to open the in-app chapter
              reader.
            </p>
          </div>

          <form
            action="/mature"
            method="get"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const nextQuery = String(form.get("q") ?? "").trim();
              router.push(buildHref(category, mode, nextQuery));
            }}
            className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto"
          >
            {category !== "ALL" ? (
              <input type="hidden" name="category" value={category} />
            ) : null}
            {mode !== "ADULT_18" ? (
              <input type="hidden" name="mode" value={mode} />
            ) : null}

            <div className="neu-inset flex items-center gap-2.5 px-4 py-2.5 rounded-full min-w-[260px] flex-1">
              <Search className="w-4 h-4 text-[#ff8a8a] shrink-0" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search 18+ Manhwa or Manga..."
                className="bg-transparent border-0 text-xs sm:text-sm text-[var(--text-strong)] placeholder:text-[var(--text-dim)] focus:outline-none w-full"
              />
            </div>

            <button
              type="submit"
              className="neu-pill-active px-5 py-2.5 rounded-full text-xs font-extrabold cursor-pointer"
            >
              Search 18+
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { label: "All 18+ Series", value: "ALL" },
                { label: "18+ Korean Manhwa", value: "MANHWA" },
                { label: "18+ Japanese Manga", value: "MANGA" },
              ] as const
            ).map((tab) => {
              const active = category === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={buildHref(tab.value, mode)}
                  className={
                    "px-4 py-2 rounded-full text-xs font-bold transition-all " +
                    (active
                      ? "neu-pill-active"
                      : "neu-pill text-[var(--ivory)]")
                  }
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildHref(category, "ADULT_18")}
              className={
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all " +
                (mode === "ADULT_18"
                  ? "bg-[#ff6b6b]/25 text-[#ffb4b4] border border-[#ff6b6b]/50"
                  : "neu-pill text-[var(--ivory)]")
              }
            >
              <Flame className="w-3.5 h-3.5 text-[#ff6b6b]" />
              <span>Explicit 18+ (Uncut)</span>
            </Link>

            <Link
              href={buildHref(category, "DARK_SEINEN")}
              className={
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all " +
                (mode === "DARK_SEINEN"
                  ? "neu-pill-active"
                  : "neu-pill text-[var(--ivory)]")
              }
            >
              <span>Dark Seinen &amp; Mature</span>
            </Link>
          </div>
        </div>
      </section>

      <MatureCatalogGrid
        initialItems={initialItems}
        category={category}
        mode={mode}
        query={query}
      />
    </div>
  );
}
