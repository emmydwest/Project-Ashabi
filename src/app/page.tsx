import Link from "next/link";
import { SafeImage as Image } from "@/components/ui/safe-image";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Feather,
  Flame,
  Layers,
  Trophy,
} from "lucide-react";
import { Icon } from "@/components/icons";
import { HomeComicStage } from "@/components/story/home-comic-stage";
import { AniListHub } from "@/components/story/anilist-hub";
import { getAniListHomeFeed } from "@/lib/anilist";
import { getFeaturedBooks } from "@/lib/books";
import { getPublicStories } from "@/lib/stories";

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20just%20visited%20Project%20Ashabi%20and%20would%20love%20to%20connect.";

export default async function Home() {
  const [publicStories, aniListFeed, featuredBooks] = await Promise.all([
    Promise.resolve(getPublicStories()),
    getAniListHomeFeed(),
    getFeaturedBooks("fantasy"),
  ]);

  const neonLagos =
    publicStories.find((s) => s.slug === "neon-lagos") ?? publicStories[1];

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-28 space-y-20"
    >
      {/* 1. Liquid Glass Hero Spotlight */}
      <HomeComicStage
        spotlightItems={aniListFeed.spotlight}
        stories={publicStories}
      />

      {/* 2. Interactive Manhwa, Manga & Anime Catalog (Search + Genre Filter + Posters) */}
      <AniListHub feed={aniListFeed} />

      {/* 3. Clean Two-Column Hub: Weekly Drops (Left 8 cols) + Top 5 Ranked Chart (Right 4 cols) */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Left: New Serialization Drops */}
        <section
          aria-labelledby="latest-drops-heading"
          className="lg:col-span-8 space-y-6"
        >
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="eyebrow m-0 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Ongoing Serialization</span>
              </p>
              <h2
                id="latest-drops-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0"
              >
                New Chapter &amp; Episode Drops
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-bright)] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {aniListFeed.recentDrops.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={`/anilist/${item.id}`}
                className="neu-card group rounded-[22px] p-4 flex gap-4 items-center"
              >
                <div className="relative w-20 h-28 rounded-[14px] overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] block truncate">
                    {item.category} · {item.genres[0] || "Serialized"}
                  </span>

                  <h3 className="text-base font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] truncate m-0">
                    {item.authorName}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-[var(--ivory)] font-semibold">
                      {item.chapters
                        ? `${item.chapters} Chapters`
                        : item.episodes
                          ? `${item.episodes} Episodes`
                          : "Ongoing"}
                    </span>
                    {item.averageScore ? (
                      <span className="text-[#68e3ab] font-bold">
                        {item.averageScore}%
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right: Clean Top 5 Leaderboard */}
        <aside
          aria-labelledby="top-series-heading"
          className="lg:col-span-4 liquid-glass rounded-[28px] p-6 sm:p-7 space-y-6"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="neu-inset w-10 h-10 rounded-xl grid place-items-center text-[var(--gold-bright)]">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h2
                  id="top-series-heading"
                  className="text-lg font-extrabold m-0"
                >
                  Top Ranked Series
                </h2>
                <p className="text-xs text-[var(--text-muted)] m-0">
                  Most Read Globally
                </p>
              </div>
            </div>
            <Link
              href="/discover?sort=POPULARITY"
              className="text-xs font-bold text-[var(--gold-bright)] hover:underline"
            >
              More
            </Link>
          </div>

          <ol className="space-y-3.5 m-0 p-0 list-none">
            {aniListFeed.leaderboard.slice(0, 5).map((item, idx) => (
              <li key={item.id}>
                <Link
                  href={`/anilist/${item.id}`}
                  className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/[0.04] transition-colors"
                >
                  <span
                    className={
                      "w-6 text-center font-serif text-2xl font-bold shrink-0 " +
                      (idx === 0
                        ? "text-[var(--gold-bright)]"
                        : idx < 3
                          ? "text-[var(--gold)]"
                          : "text-[var(--text-muted)]")
                    }
                  >
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate m-0">
                      {item.genres[0] || item.category}
                      {item.averageScore ? ` · ${item.averageScore}%` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* 4. Clean 7-Day Release Schedule */}
      <section aria-labelledby="schedule-heading" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="eyebrow m-0 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Weekly Lineup</span>
            </p>
            <h2
              id="schedule-heading"
              className="text-2xl sm:text-3xl font-extrabold m-0"
            >
              Daily Release Schedule
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold-bright)] hover:underline"
          >
            <span>Full schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {aniListFeed.weeklySchedule.map((slot) => (
            <Link
              key={slot.day}
              href={`/anilist/${slot.media.id}`}
              className="group space-y-2.5"
            >
              <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
                <Image
                  src={slot.media.coverImage}
                  alt={slot.media.title}
                  fill
                  sizes="(max-width:640px) 45vw, 14vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                <span className="neu-pill-active absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest">
                  {slot.day}
                </span>
              </div>

              <div className="px-1">
                <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                  {slot.media.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] truncate m-0">
                  {slot.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Free Public Books & Novels Library (Powered by Gutendex / Project Gutenberg API) */}
      <section
        id="books-shelf"
        aria-labelledby="books-shelf-heading"
        className="space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="eyebrow m-0 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Literary &amp; Fiction Archive · Full Text</span>
            </p>
            <h2
              id="books-shelf-heading"
              className="text-2xl sm:text-3xl font-extrabold m-0"
            >
              Free Books &amp; Novels
            </h2>
          </div>
          <Link
            href="/books"
            className="neu-pill-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold"
          >
            <span>Explore Full Books Catalogue (70,000+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {featuredBooks.slice(0, 6).map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group flex flex-col gap-3"
            >
              <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="(max-width:640px) 46vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="liquid-glass absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[var(--gold-bright)]">
                  Read Book
                </span>
              </div>

              <div className="px-1 space-y-0.5">
                <p className="text-[11px] font-bold text-[var(--gold)] truncate m-0">
                  {book.subjects[0] || "Novel"}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                  {book.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] truncate m-0">
                  {book.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Clean Editorial Banner: Vertical Reader Demo & Founder's Note */}
      <section className="liquid-glass-gold rounded-[32px] p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--gold-bright)]">
            <Layers className="w-4 h-4" />
            <span>Built in Africa · Created for the World</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-strong)] m-0">
            Experience the Vertical Comic Reader &amp; Founder’s Vision
          </h2>
          <p className="text-sm sm:text-base text-[var(--text)] max-w-2xl leading-relaxed m-0">
            Test our vertical scroll comic engine with{" "}
            <strong className="text-[var(--ivory)]">{neonLagos.title}</strong>,
            read our full founder’s vision statement, or connect directly with
            the founder on WhatsApp.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-wrap items-center gap-3 justify-end">
          <Link
            href={`/read/${neonLagos.slug}/${neonLagos.chapters[0].slug}`}
            className="neu-pill-active inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Vertical Comic Reader</span>
          </Link>

          <Link
            href="/welcome"
            className="neu-pill inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[var(--ivory)]"
          >
            <Feather className="w-4 h-4 text-[var(--gold-bright)]" />
            <span>Founder’s Note</span>
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact the Founder on WhatsApp"
            title="Contact the Founder on WhatsApp (+234 904 896 4270)"
            className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center shrink-0"
          >
            <Icon name="whatsapp" size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
