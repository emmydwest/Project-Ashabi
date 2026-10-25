import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MangaDexVerticalReader } from "@/components/reader/mangadex-vertical-reader";
import { getAniListMediaById } from "@/lib/anilist";
import {
  getMangaDexChapterPages,
  getMangaDexChaptersForTitle,
} from "@/lib/mangadex";

interface PageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return { title: "Chapter Reader" };
  }
  const media = await getAniListMediaById(numericId);
  if (!media) {
    return { title: "Chapter Reader" };
  }
  return {
    title: `Read ${media.title} — Full Chapter Reader`,
    description: `Read ${media.title} (${media.category}) vertical chapters directly on Project Ashabi.`,
  };
}

export default async function AniListMangaDexReaderPage({ params }: PageProps) {
  const { id, chapterId } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const media = await getAniListMediaById(numericId);
  if (!media) {
    notFound();
  }

  const [{ chapters, availableLanguages }, pagesData] = await Promise.all([
    getMangaDexChaptersForTitle(media.title, media.nativeTitle),
    getMangaDexChapterPages(chapterId),
  ]);

  const currentChapter =
    chapters.find((c) => c.id === chapterId) ??
    chapters[0] ?? {
      id: chapterId,
      chapterNumber: "1",
      title: "Chapter 1",
      volume: "1",
      pages: pagesData.pageUrls.length,
      publishAt: new Date().toISOString(),
      language: "en",
      languageName: "English",
      scanlationGroup: "Ashabi Reader",
    };

  return (
    <main id="main">
      <MangaDexVerticalReader
        seriesId={media.id}
        seriesTitle={media.title}
        category={media.category}
        currentChapter={currentChapter}
        allChapters={chapters}
        availableLanguages={availableLanguages}
        pagesData={pagesData}
      />
    </main>
  );
}
