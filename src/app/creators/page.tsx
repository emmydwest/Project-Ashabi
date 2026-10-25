import { SafeImage as Image } from "@/components/ui/safe-image";
import Link from "next/link";
import { creators, getStoriesByCreator } from "@/lib/stories";
import { Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";

export const metadata = { title: "Creators" };

export default function CreatorsPage() {
  return (
    <main id="main" className="page space-y-12">
      <section className="max-w-3xl space-y-4">
        <p className="eyebrow">For the world-builders</p>
        <h1 className="text-4xl sm:text-5xl font-bold">
          African creators, credited and front-and-center.
        </h1>
        <p className="text-base sm:text-lg text-[var(--text)]">
          Writers, illustrators, comic artists, and sequential storytellers:
          Ashabi pairs curated editorial support with clear rights records so
          creators retain ownership unless a separate agreement states
          otherwise.
        </p>
      </section>

      <section aria-labelledby="showcase-creators" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured Roster</p>
            <h2 id="showcase-creators" className="text-2xl sm:text-3xl font-bold">
              Meet the creators in the launch collection
            </h2>
          </div>
          <Link href="/discover" className="text-link">
            Browse all stories <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.map((creator) => {
            const works = getStoriesByCreator(creator.username);
            return (
              <Link
                key={creator.username}
                href={`/creators/${creator.username}`}
                className="group rounded-[22px] border border-[var(--border)] bg-[var(--bg-2)] p-6 flex flex-col justify-between gap-5 transition-all hover:border-[var(--border-gold)] hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[var(--border-gold)] shrink-0">
                      <Image
                        src={`/images/${creator.avatarImage}.webp`}
                        alt={creator.displayName}
                        fill
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Badge tone="gold">{creator.publicLabel}</Badge>
                      <h3 className="text-xl font-bold mt-1 group-hover:text-[var(--gold-bright)] truncate">
                        {creator.displayName}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {creator.roleLabel} · {creator.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text)] line-clamp-3">
                    {creator.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--ivory)] font-medium">
                    {works.length} {works.length === 1 ? "story" : "stories"} in
                    catalog
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--gold-bright)] font-semibold">
                    View profile <Icon name="arrow" size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[24px] border border-[var(--border-gold)] bg-[rgba(12,19,25,0.85)] p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <p className="eyebrow">Staged Creator Onboarding</p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            How publishing on Ashabi works
          </h2>
          <p className="text-sm sm:text-base text-[var(--text)]">
            During our initial 90-day beta, creator intake is curated by the
            Ashabi editorial team so every published title has verified rights,
            accurate creator credit, and mobile-optimized assets.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Creators retain copyright unless a separate written agreement states
            otherwise. Publishing is completely free for approved creators.
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.03] p-4">
            <strong className="text-[var(--gold-bright)] block">
              1. Editorial & Rights Review
            </strong>
            <span className="text-xs text-[var(--text-muted)]">
              Every work passes intake, suitability, and written permission
              verification before release.
            </span>
          </div>
          <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.03] p-4">
            <strong className="text-[var(--gold-bright)] block">
              2. Audience & Readership Insights
            </strong>
            <span className="text-xs text-[var(--text-muted)]">
              Track episode starts, completion rates, and reader follows without
              vanity noise.
            </span>
          </div>
          <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.03] p-4">
            <strong className="text-[var(--gold-bright)] block">
              3. Clear Attribution
            </strong>
            <span className="text-xs text-[var(--text-muted)]">
              Public labels clearly distinguish creator-published stories from
              Ashabi concepts and external discovery links.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
