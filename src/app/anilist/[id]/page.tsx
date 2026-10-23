import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { getAniListMediaById } from "@/lib/anilist";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return { title: "Series Not Found" };
  }
  const media = await getAniListMediaById(numericId);
  if (!media) {
    return { title: "Series Not Found" };
  }
  return {
    title: `${media.title} (${media.category})`,
    description: media.description.slice(0, 160),
  };
}

export default async function AniListSeriesPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const media = await getAniListMediaById(numericId);
  if (!media) {
    notFound();
  }

  const officialLinks = (media.externalLinks ?? []).slice(0, 8);

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-20 space-y-12"
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-[var(--text-muted)]"
      >
        <Link href="/" className="hover:text-[var(--gold-bright)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/#anilist-hub-heading" className="hover:text-[var(--gold-bright)]">
          Global {media.category} Chart
        </Link>
        <span>/</span>
        <span className="text-[var(--ivory)] font-semibold truncate">
          {media.title}
        </span>
      </nav>

      {/* Hero Stage */}
      <section className="relative rounded-[30px] overflow-hidden border border-[rgba(245,189,67,0.34)] bg-[#06090e] shadow-[0_28px_80px_rgba(0,0,0,0.65)]">
        <div className="absolute inset-0">
          <Image
            src={media.bannerImage || media.coverImage}
            alt={media.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/92 to-[#05070a]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
          {/* Portrait Cover */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="relative w-52 sm:w-64 aspect-[2/3] rounded-[20px] overflow-hidden border-2 border-[rgba(245,189,67,0.45)] shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
              <Image
                src={media.coverImage}
                alt={media.title}
                fill
                priority
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Series Metadata & Synopsis */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--gold)] text-[#140c02]">
                {media.category} · {media.countryOfOrigin}
              </span>
              {media.averageScore ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#12281e] text-[#68e3ab] border border-[#48c78e]/40">
                  <Icon name="star" size={13} />
                  <span>{media.averageScore}% Community Score</span>
                </span>
              ) : null}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--ivory)]">
                {media.status}
              </span>
              {media.chapters ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-[var(--text-muted)]">
                  {media.chapters} Chapters
                </span>
              ) : null}
              {media.episodes ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-[var(--text-muted)]">
                  {media.episodes} Episodes
                </span>
              ) : null}
              {media.seasonYear ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-[var(--text-muted)]">
                  Released {media.seasonYear}
                </span>
              ) : null}
            </div>

            <div>
              {media.nativeTitle ? (
                <p className="text-xs sm:text-sm font-bold tracking-widest text-[var(--gold-bright)] uppercase mb-1">
                  {media.nativeTitle}
                </p>
              ) : null}
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--text-strong)] leading-tight m-0">
                {media.title}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-2 mb-0">
                Creator / Studio:{" "}
                <strong className="text-[var(--ivory)]">
                  {media.authorName}
                </strong>
                {media.popularity ? (
                  <>
                    {" "}
                    ·{" "}
                    <span className="text-[var(--gold-bright)] font-semibold">
                      {media.popularity.toLocaleString()} AniList Readers
                    </span>
                  </>
                ) : null}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed max-w-3xl m-0">
              {media.description}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap items-center gap-2">
              {media.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/10 text-[var(--ivory)]"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={media.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="button primary"
              >
                <Icon name="globe" size={17} />
                <span>Open Official AniList Page</span>
              </a>
              <Link href="/" className="button secondary">
                <Icon name="compass" size={16} />
                <span>Back to Comic Hub</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Official Reading & Streaming Platforms */}
      {officialLinks.length > 0 ? (
        <section className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-2)] p-6 sm:p-8 space-y-4">
          <div>
            <p className="eyebrow mb-1">Verified External Platforms</p>
            <h2 className="text-xl sm:text-2xl font-extrabold m-0">
              Official Reading &amp; Streaming Links
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {officialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--bg-1)] text-xs sm:text-sm font-bold text-[var(--text-strong)] hover:border-[var(--border-gold)] hover:text-[var(--gold-bright)] transition-all"
              >
                <Icon name="globe" size={15} />
                <span>{link.site}</span>
                <Icon name="arrow" size={13} />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Main Characters Grid */}
      {media.characters && media.characters.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="eyebrow mb-1">Series Roster</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold m-0">
              Featured Characters
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {media.characters.map((char) => (
              <div
                key={char.id}
                className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full bg-[#090f15]">
                  {char.image ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-3 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block">
                    {char.role}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-strong)] truncate m-0">
                    {char.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Recommendations */}
      {media.recommendations && media.recommendations.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="eyebrow mb-1">Readers Also Enjoyed</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold m-0">
              Recommended Series
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {media.recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={`/anilist/${rec.id}`}
                className="group rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] overflow-hidden flex flex-col hover:border-[var(--border-gold)] transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={rec.coverImage}
                    alt={rec.title}
                    fill
                    sizes="220px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {rec.averageScore ? (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-black/80 text-[#68e3ab]">
                      {rec.averageScore}%
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-bright)] block">
                    {rec.countryOfOrigin === "KR" ? "MANHWA" : rec.type}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)] truncate m-0">
                    {rec.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
