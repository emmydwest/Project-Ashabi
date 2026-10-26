import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Feather,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import { BookChapterReader } from "@/components/reader/book-chapter-reader";
import { getPublicBookById, getFeaturedBooks } from "@/lib/books";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "Book Not Found" };
  const data = await getPublicBookById(numericId);
  if (!data) return { title: "Book Not Found" };
  const ogImage = data.book.coverImage || "/images/story-between-two-suns.webp";
  return {
    title: `${data.book.title} — by ${data.book.author}`,
    description: data.book.summary.slice(0, 160),
    openGraph: {
      title: `${data.book.title} — by ${data.book.author} | Project Ashabi`,
      description: data.book.summary.slice(0, 160),
      images: [{ url: ogImage, alt: data.book.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.book.title} — by ${data.book.author}`,
      description: data.book.summary.slice(0, 160),
      images: [ogImage],
    },
  };
}

export default async function BookReaderPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [data, moreBooks] = await Promise.all([
    getPublicBookById(numericId),
    getFeaturedBooks("science fiction"),
  ]);

  if (!data) notFound();
  const { book, chapters } = data;

  return (
    <main
      id="main"
      className="max-w-6xl mx-auto px-4 sm:px-8 py-10 pb-24 space-y-14"
    >
      {/* Top Back Navigation */}
      <nav
        data-hide-in-reader-mode="true"
        aria-label="Breadcrumb"
        className="flex items-center justify-between"
      >
        <Link
          href="/books"
          className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--gold-bright)]" />
          <span>Back to Books &amp; Novels Catalogue</span>
        </Link>
        <span className="text-xs text-[var(--text-muted)]">
          Open-Book Spread Reader · {chapters.length} Complete Chapters
        </span>
      </nav>

      {/* Book Hero Card */}
      <section
        data-hide-in-reader-mode="true"
        className="liquid-glass-gold rounded-[32px] p-6 sm:p-10 lg:p-12 grid md:grid-cols-12 gap-8 items-center"
      >
        <div className="md:col-span-4 lg:col-span-3 flex justify-center">
          <div className="relative w-48 sm:w-56 aspect-[2/3] rounded-[20px] overflow-hidden border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              priority
              sizes="224px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="neu-pill-active px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Complete Novel · In-App Reader
            </span>
            <span className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--gold-bright)]">
              <Layers className="w-3.5 h-3.5" />
              <span>{chapters.length} Chapters Available</span>
            </span>
            <span className="neu-pill px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--ivory)]">
              {book.downloadCount.toLocaleString()} Readers
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-strong)] leading-tight m-0">
              {book.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--gold-bright)] font-semibold flex items-center gap-2 m-0">
              <Feather className="w-4 h-4" />
              <span>{book.author}</span>
            </p>
          </div>

          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed max-w-3xl m-0">
            {book.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {book.subjects.map((subject) => (
              <span
                key={subject}
                className="neu-inset px-3 py-1 rounded-full text-xs text-[var(--ivory)]"
              >
                {subject}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#chapter-reader"
              className="neu-pill-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Full Novel Below ({chapters.length} Chapters)</span>
            </a>
            <span className="neu-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[var(--ivory)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
              <span>Third-Party Public-Domain Archive</span>
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Multi-Chapter Novel Reader */}
      <BookChapterReader
        bookTitle={book.title}
        bookAuthor={book.author}
        chapters={chapters}
      />

      {/* More Books Shelf */}
      <section data-hide-in-reader-mode="true" className="space-y-6">
        <h2 className="text-2xl font-extrabold m-0">
          More Free Novels &amp; Books
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {moreBooks
            .filter((b) => b.id !== book.id)
            .slice(0, 6)
            .map((item) => (
              <Link
                key={item.id}
                href={`/books/${item.id}`}
                className="group space-y-2.5"
              >
                <div className="neu-card relative aspect-[2/3] w-full rounded-[18px] overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] line-clamp-1 m-0">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] truncate m-0">
                    {item.author}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
