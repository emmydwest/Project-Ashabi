import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { HomeComicStage } from "@/components/story/home-comic-stage";
import { AniListHub } from "@/components/story/anilist-hub";
import { AshabiPreviewNotice } from "@/components/layout/ashabi-preview-notice";
import { ANILIST_GENRES, getAniListHomeFeed } from "@/lib/anilist";
import { creators as ashabiCreators, getPublicStories } from "@/lib/stories";

export default async function Home() {
  const [publicStories, aniListFeed] = await Promise.all([
    Promise.resolve(getPublicStories()),
    getAniListHomeFeed(),
  ]);

  const featuredManhwa =
    aniListFeed.manhwa[0] ?? aniListFeed.spotlight[0];
  const verticalPreviewPanels = [
    aniListFeed.manhwa[0],
    aniListFeed.manhwa[1],
    aniListFeed.manhwa[2],
  ].filter(Boolean);
  const bingeShelf = [
    ...aniListFeed.manga.slice(0, 3),
    ...aniListFeed.anime.slice(0, 2),
  ].slice(0, 5);

  const liveGenres = ANILIST_GENRES.filter((g) => g !== "All");

  return (
    <main
      id="main"
      className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-20 space-y-10"
    >
      {/* 0. Compact African Comic Platform Brief Bar & Floating Info Card */}
      <AshabiPreviewNotice />

      {/* 1. Interactive Spotlight Carousel (Populated by AniList Top Manhwa, Manga & Anime) */}
      <HomeComicStage
        spotlightItems={aniListFeed.spotlight}
        stories={publicStories}
      />

      {/* 2. Quick Format & Genre Pill Strip */}
      <nav
        aria-label="Browse by category or genre"
        className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
      >
        <a
          href="#anilist-hub-heading"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)] shadow-[var(--gold-glow)]"
        >
          <Icon name="flame" size={16} />
          <span>Trending Manhwa · Manga · Anime</span>
        </a>
        <a
          href="#latest-drops-heading"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ivory)] hover:border-[var(--border-gold)]"
        >
          <Icon name="clock" size={15} />
          <span>New Weekly Drops</span>
        </a>
        <a
          href="#schedule-heading"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ivory)] hover:border-[var(--border-gold)]"
        >
          <Icon name="calendar" size={15} />
          <span>Release Calendar</span>
        </a>
        <span className="h-5 w-px bg-[var(--border)] mx-1 shrink-0" />
        {liveGenres.map((g) => (
          <Link
            key={g}
            href={`/discover?genre=${encodeURIComponent(g)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border border-[var(--border)] bg-white/[0.03] text-[var(--text)] hover:border-[var(--border-gold)] hover:text-[var(--gold-bright)] transition-all"
          >
            <Icon name="compass" size={14} />
            <span>{g}</span>
          </Link>
        ))}
      </nav>

      {/* 3. Two-Column Comic Hub: Live AniList Releasing Drops (Left 8 cols) + Top 8 Popular Leaderboard (Right 4 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Fresh Releasing Manhwa, Manga & Anime Drops */}
        <section
          aria-labelledby="latest-drops-heading"
          className="lg:col-span-8 space-y-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div>
              <p className="eyebrow mb-1">
                Live AniList Serialization · Releasing Now
              </p>
              <h2
                id="latest-drops-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              >
                New Chapter &amp; Episode Drops
              </h2>
            </div>
            <Link href="/discover" className="text-link">
              <span>Search &amp; filter all series</span>
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {aniListFeed.recentDrops.map((item, idx) => (
              <Link
                key={item.id}
                href={`/anilist/${item.id}`}
                className="group relative rounded-[20px] border border-[var(--border)] bg-[var(--bg-2)] p-3.5 flex gap-4 items-center transition-all hover:border-[var(--border-gold)] hover:-translate-y-0.5 hover:bg-[var(--bg-3)]"
              >
                <div className="relative w-24 h-34 rounded-[14px] overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[var(--gold)] text-[#140c02]">
                    {item.category}
                  </span>
                  {item.trailer ? (
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-black/85 text-[var(--gold-bright)] border border-[var(--border-gold)]">
                      Trailer
                    </span>
                  ) : idx < 4 ? (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#48c78e] text-[#051b10]">
                      UP
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-bright)] truncate">
                      {item.genres.slice(0, 2).join(" · ") || item.category}
                    </span>
                    {item.averageScore ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#68e3ab] shrink-0">
                        <Icon name="star" size={11} />
                        {item.averageScore}%
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-[var(--ivory)] truncate m-0">
                    {item.chapters
                      ? `${item.chapters} Chapters Released`
                      : item.episodes
                        ? `${item.episodes} Episodes Airing`
                        : `${item.status} · Ongoing Serialization`}
                  </p>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 m-0">
                    {item.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)] truncate">
                      {item.authorName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--gold-bright)] shrink-0">
                      Open <Icon name="play" size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right: Top 8 Most Popular Series Leaderboard */}
        <aside
          aria-labelledby="top-series-heading"
          className="lg:col-span-4 rounded-[24px] border border-[rgba(245,189,67,0.28)] bg-gradient-to-b from-[#0d151c] to-[#070b0f] p-5 sm:p-6 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[rgba(245,189,67,0.16)] border border-[var(--border-gold)] grid place-items-center text-[var(--gold-bright)]">
                <Icon name="flame" size={18} />
              </span>
              <div>
                <h2
                  id="top-series-heading"
                  className="text-lg font-extrabold m-0"
                >
                  Most Popular Series
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] m-0">
                  All-Time AniList Reader Rankings
                </p>
              </div>
            </div>
            <Link
              href="/discover?sort=POPULARITY"
              className="text-xs font-bold text-[var(--gold-bright)] hover:underline"
            >
              See All
            </Link>
          </div>

          <ol className="space-y-2.5 m-0 p-0 list-none">
            {aniListFeed.leaderboard.map((item, idx) => (
              <li key={item.id}>
                <Link
                  href={`/anilist/${item.id}`}
                  className="group flex items-center gap-3.5 p-2 rounded-[16px] border border-transparent hover:border-[var(--border-gold)] hover:bg-white/[0.03] transition-all"
                >
                  <span
                    className={
                      "w-7 text-center font-serif text-2xl font-bold shrink-0 " +
                      (idx === 0
                        ? "text-[var(--gold-bright)]"
                        : idx < 3
                          ? "text-[var(--gold)]"
                          : "text-[var(--text-muted)]")
                    }
                  >
                    0{idx + 1}
                  </span>

                  <div className="relative w-13 h-18 rounded-[10px] overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="52px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)]">
                        {item.category}
                      </span>
                      {item.averageScore ? (
                        <span className="text-[10px] font-bold text-[#68e3ab]">
                          · {item.averageScore}%
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate m-0">
                      {item.authorName}
                      {item.popularity
                        ? ` · ${Math.round(item.popularity / 1000)}k fans`
                        : ""}
                    </p>
                  </div>

                  <span className="w-8 h-8 rounded-full border border-[var(--border)] grid place-items-center text-[var(--text-muted)] group-hover:text-[var(--gold-bright)] group-hover:border-[var(--border-gold)] shrink-0">
                    <Icon name="play" size={13} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* 4. Weekly Serialization Schedule Bar (MON - SUN Populated by AniList) */}
      <section
        aria-labelledby="schedule-heading"
        className="rounded-[24px] border border-[var(--border)] bg-[rgba(10,16,22,0.85)] p-6 sm:p-8 space-y-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Weekly Serialization Lineup</p>
            <h2
              id="schedule-heading"
              className="text-2xl sm:text-3xl font-extrabold"
            >
              Daily Manhwa, Manga &amp; Simulcast Drops
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] m-0">
            Click any day’s featured series to open its full hub, character
            roster, trailer, and official platform links.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {aniListFeed.weeklySchedule.map((slot) => (
            <Link
              key={slot.day}
              href={`/anilist/${slot.media.id}`}
              className="group rounded-[18px] border border-[var(--border)] bg-[var(--bg-1)] overflow-hidden flex flex-col justify-between transition-all hover:border-[var(--border-gold)] hover:-translate-y-1"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={slot.media.coverImage}
                  alt={slot.media.title}
                  fill
                  sizes="(max-width:640px) 90vw, 15vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/45" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-xs font-extrabold tracking-widest bg-[var(--gold)] text-[#140c02]">
                  {slot.day}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-[var(--ivory)] border border-white/15">
                  {slot.label}
                </span>
                {slot.media.averageScore ? (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#12281e]/90 text-[#68e3ab]">
                    {slot.media.averageScore}%
                  </span>
                ) : null}
              </div>

              <div className="p-3.5 space-y-1">
                <h3 className="text-sm font-bold group-hover:text-[var(--gold-bright)] truncate m-0">
                  {slot.media.title}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] truncate m-0">
                  {slot.media.authorName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Interactive Global Manhwa, Manga & Anime Hub (Live Search + Genre Filter + Trailers) */}
      <AniListHub feed={aniListFeed} />

      {/* 6. Top Creators & Illustrators Strip (Populated from AniList Staff) */}
      <section
        aria-labelledby="creators-strip-heading"
        className="rounded-[26px] border border-[var(--border)] bg-[var(--bg-2)] p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">The Voices Behind the Panels</p>
            <h2
              id="creators-strip-heading"
              className="text-2xl sm:text-3xl font-extrabold"
            >
              Top Manhwa, Manga &amp; Comic Creators
            </h2>
          </div>
          <Link href="/creators" className="button secondary text-xs">
            <span>Ashabi Creator Directory</span>
            <Icon name="arrow" size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aniListFeed.topCreators.length > 0
            ? aniListFeed.topCreators.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/anilist/${creator.featuredWorkId}`}
                  className="group rounded-[18px] border border-[var(--border)] bg-[var(--bg-1)] p-4 flex items-center gap-4 hover:border-[var(--border-gold)] transition-all"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold)] shrink-0 bg-[#090f15]">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block truncate">
                      {creator.category} · {creator.role}
                    </span>
                    <h3 className="text-base font-bold group-hover:text-[var(--gold-bright)] truncate m-0">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate m-0">
                      Featured: {creator.featuredWorkTitle}
                    </p>
                  </div>
                  <Icon name="arrow" size={16} />
                </Link>
              ))
            : ashabiCreators.map((creator) => (
                <Link
                  key={creator.username}
                  href={`/creators/${creator.username}`}
                  className="group rounded-[18px] border border-[var(--border)] bg-[var(--bg-1)] p-4 flex items-center gap-4 hover:border-[var(--border-gold)] transition-all"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold)] shrink-0">
                    <Image
                      src={`/images/${creator.avatarImage}.webp`}
                      alt={creator.displayName}
                      fill
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block">
                      {creator.roleLabel}
                    </span>
                    <h3 className="text-base font-bold group-hover:text-[var(--gold-bright)] truncate m-0">
                      {creator.displayName}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate m-0">
                      {creator.specialties.join(" · ")}
                    </p>
                  </div>
                  <Icon name="arrow" size={16} />
                </Link>
              ))}
        </div>
      </section>

      {/* 7. Vertical Webtoon & Manhwa Panel Showcase + Binge Shelf */}
      <section
        aria-labelledby="panel-peek-heading"
        className="rounded-[28px] border border-[rgba(245,189,67,0.3)] bg-gradient-to-b from-[#0b1218] to-[#05070a] p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="eyebrow mb-1">
              Vertical Webtoon &amp; Manhwa Showcase · AniList Live
            </p>
            <h2
              id="panel-peek-heading"
              className="text-2xl sm:text-3xl font-extrabold"
            >
              Inside the Vertical Webtoon Stage:{" "}
              {featuredManhwa?.title ?? "Top Manhwa"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl m-0">
              Preview the top vertical webtoon &amp; manhwa visual cards from
              AniList below, or jump into our built-in vertical comic reader to
              test the scroll experience.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {featuredManhwa ? (
              <Link
                href={`/anilist/${featuredManhwa.id}`}
                className="button primary"
              >
                <Icon name="play" size={18} />
                <span>Explore {featuredManhwa.title}</span>
              </Link>
            ) : null}
            <Link
              href="/read/neon-lagos/rain-on-the-third-mainland"
              className="button secondary"
            >
              <Icon name="book" size={16} />
              <span>Test Vertical Reader Demo</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {verticalPreviewPanels.map((panelItem, idx) => (
            <Link
              key={panelItem.id}
              href={`/anilist/${panelItem.id}`}
              className="group rounded-[20px] overflow-hidden border border-[var(--border)] bg-[var(--bg-0)] flex flex-col justify-between transition-all hover:border-[var(--border-gold)] hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={panelItem.coverImage}
                  alt={panelItem.title}
                  fill
                  sizes="(max-width:768px) 95vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-[var(--gold-bright)] border border-white/15">
                  Manhwa Spotlight 0{idx + 1}
                </span>
                {panelItem.averageScore ? (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#12281e]/90 text-[#68e3ab]">
                    {panelItem.averageScore}%
                  </span>
                ) : null}
              </div>
              <div className="p-4 border-t border-[var(--border)] bg-[#080d12]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block">
                  {panelItem.title} · {panelItem.authorName}
                </span>
                <p className="text-xs sm:text-sm text-[var(--text-strong)] mt-1 mb-0 line-clamp-2">
                  “{panelItem.description}”
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold m-0">
              Must-Binge Manga &amp; Anime Classics (AniList Top Rated)
            </h3>
            <Link href="/discover" className="text-link text-xs">
              <span>Full Discovery Catalog</span>
              <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {bingeShelf.map((item) => (
              <Link
                key={item.id}
                href={`/anilist/${item.id}`}
                className="group rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] overflow-hidden flex flex-col justify-between transition-all hover:border-[var(--border-gold)] hover:-translate-y-1"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width:640px) 48vw, 19vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/30" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[var(--gold)] text-[#140c02]">
                    {item.category}
                  </span>
                  {item.averageScore ? (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#12281e]/90 text-[#68e3ab]">
                      {item.averageScore}%
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block truncate">
                    {item.genres.slice(0, 2).join(" · ") || item.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] truncate m-0">
                    {item.authorName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
