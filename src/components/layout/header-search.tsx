"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { AniListMedia } from "@/lib/anilist";

export function HeaderSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AniListMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnClickOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnClickOutside);
    return () =>
      document.removeEventListener("pointerdown", closeOnClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/anilist/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (res.ok) {
          const data = await res.json();
          setResults((data.results ?? []).slice(0, 6));
          setOpen(true);
        }
      } catch {
        // Ignore abort errors
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    setOpen(false);
    if (!trimmed) {
      router.push("/discover");
      return;
    }
    router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(12,18,24,0.9)] pl-3.5 pr-1.5 py-1 focus-within:border-[var(--border-gold)] transition-all"
      >
        <Icon name="search" size={16} className="text-[var(--text-muted)] shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (val.trim().length < 2) {
              setResults([]);
              setOpen(false);
            }
          }}
          onFocus={() => {
            if (results.length > 0 && query.trim().length >= 2) {
              setOpen(true);
            }
          }}
          placeholder="Search Manhwa, Manga, Anime, Genres…"
          aria-label="Search Manhwa, Manga, Anime, or Genres"
          className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none px-1.5 py-1"
        />
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[var(--gold)] text-[#140c02] hover:bg-[var(--gold-bright)] transition-all cursor-pointer shrink-0"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      {/* Instant Live Search Dropdown */}
      {open && query.trim().length >= 2 ? (
        <div className="absolute left-0 right-0 top-full mt-2 z-[90] rounded-[20px] border border-[rgba(245,189,67,0.35)] bg-[#080d13] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] space-y-1.5">
          {results.length > 0 ? (
            <>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/anilist/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-white/[0.05] transition-all"
                >
                  <div className="relative w-10 h-14 rounded-[8px] overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-[var(--gold-bright)]">
                        {item.category}
                      </span>
                      {item.averageScore ? (
                        <span className="text-[10px] font-bold text-[#68e3ab]">
                          · {item.averageScore}%
                        </span>
                      ) : null}
                      {item.trailer ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]">
                          Trailer
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[var(--text-strong)] truncate m-0">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate m-0">
                      {item.genres.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <Icon name="arrow" size={14} className="text-[var(--gold-bright)] shrink-0" />
                </Link>
              ))}
              <Link
                href={`/discover?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-[12px] text-xs font-bold text-[var(--gold-bright)] bg-white/[0.03] hover:bg-white/[0.07]"
              >
                See all results for “{query.trim()}” →
              </Link>
            </>
          ) : !loading ? (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">
              No titles found for “{query.trim()}”. Press Search to browse all
              categories.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
