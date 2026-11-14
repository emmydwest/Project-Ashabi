"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import {
  fetchAniListMediaById,
  isPlaceholderCover,
} from "@/lib/anilist";
import type { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & {
  mediaId: number;
  src?: string | null;
  preferBanner?: boolean;
};

export function LiveAniListImage({
  mediaId,
  src,
  preferBanner = false,
  alt,
  ...rest
}: Props) {
  const [resolved, setResolved] = useState(src ?? "");

  useEffect(() => {
    setResolved(src ?? "");
    if (!isPlaceholderCover(src)) return;

    const controller = new AbortController();
    fetchAniListMediaById(mediaId, controller.signal)
      .then((live) => {
        if (!live) return;
        const next = preferBanner
          ? live.bannerImage || live.coverImage
          : live.coverImage;
        if (next) setResolved(next);
      })
      .catch(() => {
        // Keep the placeholder if the browser cannot reach AniList either.
      });

    return () => controller.abort();
  }, [mediaId, preferBanner, src]);

  return <SafeImage {...rest} src={resolved} alt={alt} />;
}
