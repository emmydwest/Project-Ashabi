import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stories } from "@/lib/stories";
import { Icon } from "@/components/icons";
export const dynamicParams = false;
export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  return {
    title: story?.title ?? "Story not found",
    description: story?.description,
  };
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();
  return (
    <main id="main" className="page">
      <Link href="/discover" className="text-link">
        ← Back to Discover
      </Link>
      <section className="story-detail">
        <div className="detail-cover">
          <Image
            src={"/images/" + story.image + ".webp"}
            alt={"Concept artwork for " + story.title}
            fill
            priority
            sizes="(max-width:700px) 90vw, 360px"
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">Ashabi concept collection</p>
          <h1>{story.title}</h1>
          <p>{story.format} · Concept preview</p>
          <div className="tags">
            {story.genres.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
          <p>{story.description}</p>
          <div className="notice">
            <h2>Every world starts with an idea.</h2>
            <p>
              This title is a visual concept for Ashabi. No chapters have been
              published, and no creator partnership is being represented.
            </p>
          </div>
        </div>
      </section>
      <section className="notice">
        <h2>Chapters</h2>
        <p>
          No chapters available yet. Explore the rest of the concept collection
          while these worlds take shape.
        </p>
        <Link className="text-link" href="/discover">
          Discover more stories <Icon name="arrow" />
        </Link>
      </section>
    </main>
  );
}
