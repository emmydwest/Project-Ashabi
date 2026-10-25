"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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
        className="neu-inset flex items-center gap-1.5 rounded-full pl-3.5 pr-1.5 py-1 focus-within:border-[var(--border-gold)] transition-all"
      >
        <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
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
          placeholder="Search comics, manhwa, books…"
          aria-label="Search comics, manhwa, manga, anime, or books"
          className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none px-1.5 py-1"
        />
        <button
          type="submit"
          className="neu-pill-active px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer shrink-0"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      {/* Instant Liquid Glass Dropdown */}
      {open && query.trim().length >= 2 ? (
        <div className="liquid-glass absolute left-0 right-0 top-full mt-2.5 z-[90] rounded-[22px] p-2.5 space-y-1.5">
          {results.length > 0 ? (
            <>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/anilist/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-[14px] hover:bg-white/[0.06] transition-all"
                >
                  <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-[var(--gold)] block">
                      {item.category}
                      {item.averageScore ? ` · ${item.averageScore}%` : ""}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[var(--text-strong)] truncate m-0">
                      {item.title}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--gold-bright)] shrink-0" />
                </Link>
              ))}
              <Link
                href={`/discover?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl text-xs font-bold text-[var(--gold-bright)] bg-white/[0.04] hover:bg-white/[0.08]"
              >
                See all results for “{query.trim()}” →
              </Link>
            </>
          ) : !loading ? (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">
              No titles found for “{query.trim()}”. Press Search to browse all.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
