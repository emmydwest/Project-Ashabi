import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Library,
  Search,
} from "lucide-react";
import { BOOK_CATALOGUE_TOPICS, browseBookCatalogue } from "@/lib/books";

export const metadata: Metadata = {
  title: "Books & Novels Catalogue — Project Ashabi",
  description:
    "Explore and read over 70,000 full-text novels, epics, fantasy worlds, science fiction, and classic literature directly on Project Ashabi.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    topic?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BooksCataloguePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";
  const topic = sp.topic?.trim() ?? "All";
  const sort =
    sp.sort === "ascending" || sp.sort === "descending" ? sp.sort : "popular";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const catalogue = await browseBookCatalogue({
    query,
    topic,
    sort,
    page,
  });

  function buildPageHref(nextPage: number, nextTopic = topic) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (nextTopic && nextTopic !== "All") params.set("topic", nextTopic);
    if (sort !== "popular") params.set("sort", sort);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return `/books${qs ? `?${qs}` : ""}`;
  }

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 pb-24 space-y-12"
    >
      {/* Header & Search Controls */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              <Library className="w-4 h-4" />
              <span>Full Literary Archive · Rate-Limited &amp; Cached</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-strong)] m-0">
              Books &amp; Novels Catalogue
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl m-0">
              Browse {catalogue.totalCount.toLocaleString()} complete novels,
              mythologies, sci-fi classics, and epics. Open any book to read in
              our realistic two-page book spread reader.
            </p>
          </div>

          {/* Search Form */}
          <form
            action="/books"
            method="get"
            className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto"
          >
            {topic !== "All" ? (
              <input type="hidden" name="topic" value={topic} />
            ) : null}
            <div className="neu-inset flex items-center gap-2.5 px-4 py-2.5 rounded-full min-w-[260px] sm:min-w-[320px] flex-1">
              <Search className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search 70,000+ books or authors..."
                className="bg-transparent border-0 text-xs sm:text-sm text-[var(--text-strong)] placeholder:text-[var(--text-dim)] focus:outline-none w-full"
              />
            </div>

            <select
              name="sort"
              defaultValue={sort}
              aria-label="Sort books"
              className="neu-inset rounded-full px-4 py-2.5 text-xs font-bold text-[var(--text-strong)] cursor-pointer"
            >
              <option value="popular" className="bg-[#080d12]">
                Most Popular
              </option>
              <option value="ascending" className="bg-[#080d12]">
                Title (A–Z)
              </option>
              <option value="descending" className="bg-[#080d12]">
                Title (Z–A)
              </option>
            </select>

            <button
              type="submit"
              className="neu-pill-active px-5 py-2.5 rounded-full text-xs font-extrabold cursor-pointer"
            >
              Search Books
            </button>
          </form>
        </div>

        {/* Genre / Topic Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {BOOK_CATALOGUE_TOPICS.map((item) => {
            const active = topic.toLowerCase() === item.value.toLowerCase();
            return (
              <Link
                key={item.value}
                href={buildPageHref(1, item.value)}
                className={
                  "px-4 py-2 rounded-full text-xs font-bold transition-all " +
                  (active
                    ? "neu-pill-active"
                    : "neu-pill text-[var(--ivory)] hover:text-[var(--gold-bright)]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Books Poster Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-b border-white/10 pb-3">
          <span>
            Showing Page <strong className="text-[var(--ivory)]">{page}</strong>{" "}
            · {catalogue.totalCount.toLocaleString()} Books Found
          </span>
          {query ? (
            <Link
              href="/books"
              className="text-[var(--gold-bright)] font-bold hover:underline"
            >
              Clear Search (&ldquo;{query}&rdquo;)
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {catalogue.books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group flex flex-col space-y-3"
            >
              <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-bright)]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Book Reader</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)] block truncate">
                  {book.subjects[0] ?? "Novel"}
                </span>
                <h2 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] transition-colors line-clamp-1 m-0">
                  {book.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] truncate m-0">
                  {book.author}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Catalogue Pagination */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          {catalogue.hasPrevPage ? (
            <Link
              href={buildPageHref(page - 1)}
              className="neu-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page ({page - 1})</span>
            </Link>
          ) : (
            <span />
          )}

          <span className="text-xs font-bold text-[var(--text-muted)]">
            Page {page}
          </span>

          {catalogue.hasNextPage ? (
            <Link
              href={buildPageHref(page + 1)}
              className="neu-pill-active inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold"
            >
              <span>Next Page ({page + 1})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </main>
  );
}
