import Link from "next/link";
import Image from "next/image";
import type { Story } from "@/lib/stories";
import { Icon } from "@/components/icons";

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link className="story-card" href={"/stories/" + story.slug}>
      <div className="cover">
        <Image
          src={"/images/" + story.image + ".webp"}
          alt={"Cover art for " + story.title}
          fill
          sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 22vw"
        />
        <span className="cover-label">{story.format}</span>
        <span className="card-arrow">
          <Icon name="arrow" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3">
        <span className="text-[11px] uppercase tracking-wider text-[var(--gold-bright)] font-semibold">
          {story.creatorDisplayName}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--border)] bg-white/[0.04] text-[var(--text-muted)]">
          {story.releaseStatus}
        </span>
      </div>
      <h3 className="mt-1">{story.title}</h3>
      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
        {story.description}
      </p>
      <p className="mt-2 text-xs text-[var(--ivory)] opacity-85">
        {story.genres.join(" · ")} · {story.chapters.length}{" "}
        {story.chapters.length === 1 ? "episode" : "episodes"} · Free
      </p>
    </Link>
  );
}
