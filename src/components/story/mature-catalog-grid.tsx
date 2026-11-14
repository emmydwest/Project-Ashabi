"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import { searchAniListMatureFromBrowser } from "@/lib/anilist-browser";
import type { AniListMedia } from "@/lib/anilist";

export function MatureCatalogGrid({
  initialItems,
  category,
  mode,
  query,
}: {
  initialItems: AniListMedia[];
  category: "ALL" | "MANHWA" | "MANGA";
  mode: "ADULT_18" | "DARK_SEINEN";
  query: string;
}) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
    const controller = new AbortController();
    let cancelled = false;

    searchAniListMatureFromBrowser(
      { query: query || undefined, category, mode },
      controller.signal,
    )
      .then((results) => {
        if (!cancelled && results.length > 0) setItems(results);
      })
      .catch(() => {
        // Keep the server-rendered snapshot if the browser cannot reach AniList.
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [initialItems, category, mode, query]);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/anilist/${item.id}`}
          className="group flex flex-col space-y-3"
        >
          <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#7a1616]/90 text-[#ffcccc] border border-[#ff6b6b]/40">
              18+
            </span>

            {item.averageScore ? (
              <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-black/80 text-[#68e3ab]">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>{item.averageScore}%</span>
              </span>
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-bright)]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Chapters</span>
              </span>
            </div>
          </div>

          <div className="space-y-1 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9494] block truncate">
              {item.category} · {item.genres[0] ?? "Mature"}
            </span>
            <h2 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] line-clamp-1 m-0">
              {item.title}
            </h2>
          </div>
        </Link>
      ))}
    </section>
  );
}
