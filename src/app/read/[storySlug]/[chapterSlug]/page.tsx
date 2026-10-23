import { notFound } from "next/navigation";
import { getChapterBySlug, getPublicStories } from "@/lib/stories";
import { EpisodeReader } from "@/components/reader/episode-reader";

export function generateStaticParams() {
  const params: { storySlug: string; chapterSlug: string }[] = [];
  for (const story of getPublicStories()) {
    for (const chapter of story.chapters) {
      if (chapter.publicationStatus === "published" && chapter.rightsCleared) {
        params.push({ storySlug: story.slug, chapterSlug: chapter.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storySlug: string; chapterSlug: string }>;
}) {
  const { storySlug, chapterSlug } = await params;
  const found = getChapterBySlug(storySlug, chapterSlug);
  if (!found) {
    return { title: "Episode not found" };
  }
  return {
    title: `${found.chapter.title} — ${found.story.title}`,
    description: found.chapter.synopsis,
  };
}

export default async function ReadEpisodePage({
  params,
}: {
  params: Promise<{ storySlug: string; chapterSlug: string }>;
}) {
  const { storySlug, chapterSlug } = await params;
  const found = getChapterBySlug(storySlug, chapterSlug);
  if (!found) notFound();

  return (
    <EpisodeReader
      story={found.story}
      chapter={found.chapter}
      prev={found.prev}
      next={found.next}
    />
  );
}
