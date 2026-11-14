import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Play,
  ShieldCheck,
  Star,
} from "lucide-react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import { LiveAniListImage } from "@/components/story/live-anilist-image";
import { SeriesChaptersBrowser } from "@/components/reader/series-chapters-browser";
import { LiveAniListSeries } from "@/components/story/live-anilist-series";
import {
  anilistCoverSize,
  getAniListMediaById,
} from "@/lib/anilist";
import { allSnapshotMedia } from "@/lib/anilist-snapshot";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = true;

export function generateStaticParams() {
  return allSnapshotMedia().map((item) => ({ id: String(item.id) }));
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
  const ogImage =
    media.bannerImage || media.coverImage || "/images/hero-ashabi-dawn.webp";
  return {
    title: `${media.title} (${media.category})`,
    description: media.description.slice(0, 160),
    openGraph: {
      title: `${media.title} (${media.category}) | Project Ashabi`,
      description: media.description.slice(0, 160),
      images: [{ url: ogImage, alt: media.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${media.title} (${media.category}) | Project Ashabi`,
      description: media.description.slice(0, 160),
      images: [ogImage],
    },
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
    return <LiveAniListSeries mediaId={numericId} />;
  }

  const isFinished = media.status.toUpperCase().includes("FINISH");
  const statusBannerText = isFinished
    ? `COMPLETED${media.chapters ? ` · ${media.chapters} Chapters` : ""}`
    : `ONGOING (${media.status})${media.chapters ? ` · ${media.chapters} Chapters` : ""}`;

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-24 space-y-14"
    >
      {/* Top Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center justify-between gap-4"
      >
        <Link
          href="/?explore=1#anilist-hub-heading"
          className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--gold-bright)]" />
          <span>Back to {media.category} Hub</span>
        </Link>
        <span className="text-xs text-[var(--text-muted)] truncate">
          {media.category}
          {media.chapters ? ` · ${media.chapters} Chapters` : ""}
        </span>
      </nav>

      {/* Hero Stage */}
      <section className="liquid-glass-gold relative rounded-[32px] overflow-hidden">
        <div className="absolute inset-0">
          <LiveAniListImage
            mediaId={media.id}
            src={media.bannerImage || media.coverImage}
            preferBanner
            alt={media.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05080c] via-[#05080c]/92 to-[#05080c]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080c] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
          {/* Portrait Cover */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="relative w-52 sm:w-64 aspect-[2/3] rounded-[22px] overflow-hidden border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
              <LiveAniListImage
                mediaId={media.id}
                src={anilistCoverSize(media.coverImage, "large")}
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
              <span className="neu-pill-active px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                {media.category} · {media.countryOfOrigin}
              </span>
              {media.averageScore ? (
                <span className="neu-pill inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#68e3ab]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{media.averageScore}% Score</span>
                </span>
              ) : null}
              <span className="neu-pill px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--ivory)]">
                {statusBannerText}
              </span>
              {media.chapters ? (
                <span className="neu-pill px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--gold-bright)]">
                  {media.chapters} Chapters
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
                      {media.popularity.toLocaleString()} Readers
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
                <Link
                  key={genre}
                  href={`/discover?genre=${encodeURIComponent(genre)}`}
                  className="neu-inset px-3.5 py-1 rounded-full text-xs font-semibold text-[var(--ivory)] hover:text-[var(--gold-bright)] transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#playable-chapters"
                className="neu-pill inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-[var(--text-strong)]"
              >
                <Layers className="w-4 h-4 text-[var(--gold-bright)]" />
                <span>Choose Language &amp; Chapter</span>
              </a>

              {media.trailer ? (
                <a
                  href="#series-trailer"
                  className="neu-pill inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-[var(--text-strong)]"
                >
                  <Play className="w-4 h-4 text-[var(--gold-bright)] fill-current" />
                  <span>Watch Official Trailer</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Language & Chapters Browser */}
      <SeriesChaptersBrowser
        seriesId={media.id}
        seriesTitle={media.title}
        nativeTitle={media.nativeTitle}
        expectedChapters={media.chapters}
        seriesStatus={media.status}
      />

      {/* In-App Video Trailer Section (No External Backlinks) */}
      {media.trailer ? (
        <section
          id="series-trailer"
          aria-labelledby="trailer-heading"
          className="liquid-glass rounded-[30px] p-6 sm:p-10 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow mb-1">
                In-App Promotional Video · English Subtitles (CC) Enabled
              </p>
              <h2
                id="trailer-heading"
                className="text-2xl sm:text-3xl font-extrabold m-0"
              >
                {media.title} — Official English-Subtitled Trailer
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="neu-pill-active px-3.5 py-1.5 rounded-full text-xs font-extrabold">
                EN Subtitles Active
              </span>
              <span className="neu-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--ivory)]">
                Third-Party Media Stream
              </span>
            </div>
          </div>

          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-[22px] overflow-hidden border border-[var(--border-gold)] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <iframe
              src={media.trailer.embedUrl}
              title={`${media.title} Official Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {media.characters.map((char) => (
              <div
                key={char.id}
                className="neu-card rounded-[20px] overflow-hidden flex flex-col"
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
                <div className="p-3.5 space-y-0.5">
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

      {/* Non-Clickable Third-Party Attribution Notice (Replaces External Backlinks) */}
      <section className="liquid-glass rounded-[26px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
            <ShieldCheck className="w-4 h-4" />
            <span>Third-Party Demonstration Content Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed m-0">
            <strong className="text-[var(--ivory)]">{media.title}</strong> is
            streamed via an independent third-party content API strictly for
            platform demonstration during Project Ashabi&apos;s development
            phase. All copyrights, trademarks, character designs, and story
            rights remain the sole property of{" "}
            <strong className="text-[var(--ivory)]">{media.authorName}</strong>{" "}
            and their respective rightsholders.
          </p>
        </div>
        <Link
          href="/terms"
          className="neu-pill px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)] shrink-0 self-start sm:self-center"
        >
          Rights &amp; DMCA Policy
        </Link>
      </section>

      {/* Recommendations */}
      {media.recommendations && media.recommendations.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="eyebrow mb-1">Readers Also Enjoyed</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold m-0">
              Recommended Series
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {media.recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={`/anilist/${rec.id}`}
                className="group space-y-2.5"
              >
                <div className="neu-card relative aspect-[2/3] w-full rounded-[20px] overflow-hidden">
                  <Image
                    src={anilistCoverSize(rec.coverImage, "medium")}
                    alt={rec.title}
                    fill
                    sizes="220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {rec.averageScore ? (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-black/80 text-[#68e3ab]">
                      {rec.averageScore}%
                    </span>
                  ) : null}
                </div>
                <div className="px-1">
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
