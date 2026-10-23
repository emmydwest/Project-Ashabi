import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  creators,
  getCreatorByUsername,
  getStoriesByCreator,
} from "@/lib/stories";
import { StoryCard } from "@/components/story/story-card";
import { CreatorFollowButton } from "@/components/creator/creator-follow-button";
import { Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";

export function generateStaticParams() {
  return creators.map((c) => ({ username: c.username }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const creator = getCreatorByUsername(username);
  if (!creator) return { title: "Creator not found" };
  return {
    title: `${creator.displayName} — Creator Profile`,
    description: creator.bio,
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const creator = getCreatorByUsername(username);
  if (!creator) notFound();

  const publishedCatalog = getStoriesByCreator(creator.username);

  return (
    <main id="main" className="page space-y-10">
      <Link href="/creators" className="text-link">
        <Icon name="arrow-left" size={16} /> All Creators
      </Link>

      <section className="relative rounded-[28px] overflow-hidden border border-[var(--border-gold)] bg-[var(--bg-2)] p-6 sm:p-10">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <Image
            src={`/images/${creator.bannerImage}.webp`}
            alt=""
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/90 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[var(--gold)] shrink-0">
              <Image
                src={`/images/${creator.avatarImage}.webp`}
                alt={creator.displayName}
                fill
                sizes="112px"
              />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold">{creator.publicLabel}</Badge>
                <span className="text-xs text-[var(--text-muted)]">
                  @{creator.username} · {creator.location}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {creator.displayName}
              </h1>
              <p className="text-sm font-medium text-[var(--gold-300)]">
                {creator.roleLabel}
              </p>
              <p className="text-sm sm:text-base text-[var(--text)]">
                {creator.bio}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {creator.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full text-xs border border-[var(--border)] bg-white/[0.04] text-[var(--ivory)]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <CreatorFollowButton
              creatorId={creator.id}
              username={creator.username}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="creator-works-heading" className="space-y-4">
        <div>
          <p className="eyebrow">Published Catalog</p>
          <h2 id="creator-works-heading" className="text-2xl font-bold">
            Stories by {creator.displayName} ({publishedCatalog.length})
          </h2>
        </div>

        <div className="story-grid">
          {publishedCatalog.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>
    </main>
  );
}
