"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/story-neon-lagos.webp";

export function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  ...rest
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const cleanSrc = src && src.trim().length > 0 ? src.trim() : fallbackSrc;
  const resolvedSrc = failedSrc === cleanSrc ? fallbackSrc : cleanSrc;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt || "Project Ashabi artwork"}
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => {
        if (cleanSrc !== fallbackSrc) {
          setFailedSrc(cleanSrc);
        }
      }}
    />
  );
}
