import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Search, ShieldAlert } from "lucide-react";
import { MatureAgeGate } from "@/components/legal/mature-age-gate";
import { getAniListMatureCatalog } from "@/lib/anilist";
import { MatureCatalogGrid } from "@/components/story/mature-catalog-grid";

export const metadata: Metadata = {
  title: "18+ Mature Catalogue — Project Ashabi",
  description:
    "Age-restricted 18+ Manhwa and Manga catalogue on Project Ashabi. Requires 18+ age verification.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    mode?: string;
  }>;
}

export default async function MatureCataloguePage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";
  const category =
    sp.category === "MANHWA" || sp.category === "MANGA" ? sp.category : "ALL";
  const mode = sp.mode === "DARK_SEINEN" ? "DARK_SEINEN" : "ADULT_18";

  const items = await getAniListMatureCatalog({
    query,
    category,
    mode,
  });

  function buildHref(
    nextCategory = category,
    nextMode: "ADULT_18" | "DARK_SEINEN" = mode,
  ) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (nextCategory !== "ALL") params.set("category", nextCategory);
    if (nextMode !== "ADULT_18") params.set("mode", nextMode);
    const qs = params.toString();
    return `/mature${qs ? `?${qs}` : ""}`;
  }

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 pb-24"
    >
      <MatureAgeGate>
        <div className="space-y-10">
          {/* Header & Filters */}
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
                  Browse uncut 18+ adult webtoons, mature romance, and dark
                  seinen graphic fiction. Click any cover to open the in-app
                  chapter reader.
                </p>
              </div>

              {/* Search Bar */}
              <form
                action="/mature"
                method="get"
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

            {/* Category & Rating Mode Pills */}
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
            initialItems={items}
            category={category}
            mode={mode}
            query={query}
          />

        </div>
      </MatureAgeGate>
    </main>
  );
}
