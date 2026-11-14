"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { LiveAniListImage } from "@/components/story/live-anilist-image";
import { SeriesChaptersBrowser } from "@/components/reader/series-chapters-browser";
import {
  anilistCoverSize,
  fetchAniListMediaById,
  type AniListMedia,
} from "@/lib/anilist";

export function LiveAniListSeries({ mediaId }: { mediaId: number }) {
  const [media, setMedia] = useState<AniListMedia | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchAniListMediaById(mediaId, controller.signal)
      .then((result) => {
        if (result) setMedia(result);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
    return () => controller.abort();
  }, [mediaId]);

  if (failed) {
    return (
      <main id="main" className="page space-y-4">
        <h1>Series not found</h1>
        <p className="page-intro">
          This title is not in the current catalogue. Please try Discover.
        </p>
        <Link href="/discover" className="neu-pill-active inline-flex px-4 py-2 rounded-full text-xs font-extrabold">
          Back to Discover
        </Link>
      </main>
    );
  }

  if (!media) {
    return (
      <main id="main" className="page flex items-center justify-center py-24 text-sm font-semibold text-[var(--gold-bright)]">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading series…
      </main>
    );
  }

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-24 space-y-10"
    >
      <Link
        href="/discover"
        className="neu-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
      >
        <ArrowLeft className="w-4 h-4 text-[var(--gold-bright)]" />
        Back to Discover
      </Link>

      <section className="liquid-glass rounded-[32px] p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <div className="relative w-52 sm:w-64 aspect-[2/3] rounded-[22px] overflow-hidden border border-white/15">
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
        <div className="lg:col-span-9 space-y-4">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold m-0">
            {media.title}
          </h1>
          <p className="text-sm text-[var(--text-muted)] m-0">
            {media.authorName}
            {media.averageScore ? ` · ${media.averageScore}%` : ""}
          </p>
          <p className="text-base text-[var(--text)] leading-relaxed m-0">
            {media.description}
          </p>
        </div>
      </section>

      <SeriesChaptersBrowser
        seriesId={media.id}
        seriesTitle={media.title}
        nativeTitle={media.nativeTitle}
        expectedChapters={media.chapters}
        seriesStatus={media.status}
      />
    </main>
  );
}
