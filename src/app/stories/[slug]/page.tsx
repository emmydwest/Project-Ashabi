import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicStories, getStoryBySlug } from "@/lib/stories";
import { Icon } from "@/components/icons";
import { StoryActions } from "@/components/story/story-actions";
import { Badge } from "@/components/ui/primitives";
import { formatRelativeDate } from "@/lib/utils";

export function generateStaticParams() {
  return getPublicStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) {
    return { title: "Story not found" };
  }
  return {
    title: `${story.title} — ${story.format}`,
    description: story.description,
    openGraph: {
      title: `${story.title} | Ashabi`,
      description: story.description,
      images: [`/images/${story.image}.webp`],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const publishedChapters = story.chapters.filter(
    (c) => c.publicationStatus === "published" && c.rightsCleared,
  );
  const firstChapter = publishedChapters[0];
  const relatedStories = getPublicStories()
    .filter((s) => s.slug !== story.slug)
    .slice(0, 3);

  return (
    <main id="main" className="page">
      <Link href="/discover" className="text-link">
        <Icon name="arrow-left" size={16} /> Back to Discover
      </Link>

      <section className="story-detail">
        <div className="detail-cover">
          <Image
            src={"/images/" + story.image + ".webp"}
            alt={"Cover art for " + story.title}
            fill
            priority
            sizes="(max-width:700px) 90vw, 360px"
          />
        </div>
        <div className="detail-copy">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge tone="gold">{story.rights.creditLabel}</Badge>
            <Badge tone="neutral">{story.format}</Badge>
            <Badge tone="success">Free to Read</Badge>
            <Badge tone="neutral">{story.ageRating}</Badge>
          </div>

          <h1>{story.title}</h1>
          {story.subtitle ? (
            <p className="text-lg text-[var(--ivory)] opacity-90 -mt-1 mb-2">
              {story.subtitle}
            </p>
          ) : null}

          <p className="text-sm text-[var(--text-muted)]">
            Created by{" "}
            <Link
              href={`/creators/${story.creatorUsername}`}
              className="text-[var(--gold-bright)] underline-offset-4 hover:underline font-semibold"
            >
              {story.creatorDisplayName}
            </Link>{" "}
            ({story.creatorRole}) · {story.releaseStatus} ·{" "}
            {story.releaseSchedule}
          </p>

          <div className="tags mt-3">
            {story.genres.map((g) => (
              <Link
                key={g}
                href={`/discover?genre=${encodeURIComponent(g)}`}
              >
                <span>{g}</span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-base leading-relaxed text-[var(--text-strong)]">
            {story.synopsis}
          </p>

          <StoryActions
            storyId={story.id}
            storySlug={story.slug}
            firstChapterSlug={firstChapter?.slug}
            storyTitle={story.title}
          />

          <div className="mt-6 rounded-[16px] border border-[var(--border)] bg-[rgba(8,13,18,0.72)] p-4 text-xs text-[var(--text-muted)] space-y-1">
            <div className="flex items-center gap-2 text-[var(--ivory)] font-semibold">
              <Icon name="shield" size={16} />
              <span>Rights & Attribution Record</span>
            </div>
            <p>
              <strong>Credit & Ownership:</strong>{" "}
              {story.rights.ownerOrRightsholder}
            </p>
            <p>
              <strong>Source Layer:</strong> {story.rights.sourceName} ·{" "}
              {story.rights.permissionBasis}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="chapters-heading">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <p className="eyebrow">Episodes & Chapters</p>
            <h2 id="chapters-heading" className="text-2xl font-bold">
              Available to Read Free ({publishedChapters.length})
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            No account or payment required
          </span>
        </div>

        <div className="grid gap-3">
          {publishedChapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/read/${story.slug}/${chapter.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[18px] border border-[var(--border)] bg-[rgba(12,19,25,0.82)] p-5 transition-all hover:border-[var(--border-gold)] hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-bright)]">
                    Episode {chapter.number}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    · {chapter.estimatedReadMinutes} min read · Released{" "}
                    {formatRelativeDate(chapter.publishedAt)}
                  </span>
                  <Badge tone="success">Free</Badge>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-strong)] group-hover:text-[var(--gold-bright)]">
                  {chapter.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-2xl">
                  {chapter.synopsis}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-full border border-[var(--border-gold)] bg-[rgba(245,189,67,0.12)] text-xs font-semibold text-[var(--gold-bright)] shrink-0">
                <span>Read Episode</span>
                <Icon name="arrow" size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="more-worlds-heading">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="eyebrow">Continue exploring</p>
            <h2 id="more-worlds-heading" className="text-2xl font-bold">
              More worlds in the catalog
            </h2>
          </div>
          <Link href="/discover" className="text-link">
            Browse all <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedStories.map((item) => (
            <Link
              key={item.slug}
              href={`/stories/${item.slug}`}
              className="rounded-[18px] border border-[var(--border)] bg-[var(--bg-2)] p-4 hover:border-[var(--border-gold)] transition-all flex items-center gap-4"
            >
              <div className="relative w-20 h-24 rounded-[12px] overflow-hidden shrink-0">
                <Image
                  src={`/images/${item.image}.webp`}
                  alt={item.title}
                  fill
                  sizes="80px"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-[var(--gold-bright)]">
                  {item.format}
                </span>
                <h3 className="text-base font-semibold truncate mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  By {item.creatorDisplayName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
