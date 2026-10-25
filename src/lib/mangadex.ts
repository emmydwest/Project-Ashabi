export interface MangaDexChapterSummary {
  id: string;
  chapterNumber: string;
  title: string;
  volume?: string | null;
  pages: number;
  publishAt: string;
  language: string;
  scanlationGroup?: string;
}

export interface MangaDexChapterPages {
  chapterId: string;
  pageUrls: string[];
  dataSaverUrls: string[];
  source: "mangadex" | "fallback";
}

const MANGADEX_API = "https://api.mangadex.org";
const USER_AGENT =
  "ProjectAshabi/1.0 (https://github.com/emmydwest/Project-Ashabi)";

const HEADERS = {
  Accept: "application/json",
  "User-Agent": USER_AGENT,
};

interface RawMangaDexChapter {
  id: string;
  attributes?: {
    volume?: string | null;
    chapter?: string | null;
    title?: string | null;
    translatedLanguage?: string | null;
    externalUrl?: string | null;
    publishAt?: string | null;
    pages?: number | null;
  };
  relationships?: {
    id: string;
    type: string;
    attributes?: {
      name?: string;
    };
  }[];
}

async function fetchPlayableFeedForMangaId(
  mangaId: string,
): Promise<MangaDexChapterSummary[]> {
  const feedUrl =
    `${MANGADEX_API}/manga/${mangaId}/feed` +
    `?translatedLanguage[]=en` +
    `&order[chapter]=asc` +
    `&limit=96` +
    `&includes[]=scanlation_group` +
    `&contentRating[]=safe` +
    `&contentRating[]=suggestive` +
    `&includeEmptyPages=0` +
    `&includeFuturePublishAt=0` +
    `&includeExternalUrl=0`;

  const res = await fetch(feedUrl, {
    headers: HEADERS,
    next: { revalidate: 1800 },
  });

  if (!res.ok) return [];
  const json = await res.json();
  const rawList: RawMangaDexChapter[] = json?.data ?? [];

  // Deduplicate by chapter number so the reader gets one clean entry per chapter
  const seenChapters = new Set<string>();
  const chapters: MangaDexChapterSummary[] = [];

  for (const item of rawList) {
    const pages = item.attributes?.pages ?? 0;
    const externalUrl = item.attributes?.externalUrl;
    if (pages <= 0 || externalUrl) continue;

    const chNum = item.attributes?.chapter?.trim() || String(chapters.length + 1);
    if (seenChapters.has(chNum)) continue;
    seenChapters.add(chNum);

    const groupRel = item.relationships?.find(
      (r) => r.type === "scanlation_group",
    );

    chapters.push({
      id: item.id,
      chapterNumber: chNum,
      title:
        item.attributes?.title?.trim() || `Chapter ${chNum}`,
      volume: item.attributes?.volume ?? null,
      pages,
      publishAt: item.attributes?.publishAt ?? new Date().toISOString(),
      language: item.attributes?.translatedLanguage ?? "en",
      scanlationGroup: groupRel?.attributes?.name ?? "Community Release",
    });
  }

  return chapters;
}

export async function getMangaDexChaptersForTitle(
  primaryTitle: string,
  nativeTitle?: string | null,
): Promise<{
  mangaDexId: string | null;
  chapters: MangaDexChapterSummary[];
}> {
  const queries = [primaryTitle, nativeTitle].filter(
    (q): q is string => Boolean(q && q.trim().length > 1),
  );

  for (const q of queries) {
    try {
      const searchUrl =
        `${MANGADEX_API}/manga?title=${encodeURIComponent(q)}` +
        `&limit=6&order[FollowedCount]=desc&hasAvailableChapters=true`;

      const res = await fetch(searchUrl, {
        headers: HEADERS,
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;
      const data = await res.json();
      const candidates: { id: string }[] = data?.data ?? [];

      for (const candidate of candidates) {
        const chapters = await fetchPlayableFeedForMangaId(candidate.id);
        if (chapters.length > 0) {
          return {
            mangaDexId: candidate.id,
            chapters,
          };
        }
      }
    } catch {
      // Continue to next candidate or fallback
    }
  }

  return {
    mangaDexId: null,
    chapters: FALLBACK_CHAPTERS,
  };
}

export async function getMangaDexChapterPages(
  chapterId: string,
): Promise<MangaDexChapterPages> {
  if (chapterId.startsWith("demo-chapter-")) {
    return {
      chapterId,
      pageUrls: FALLBACK_PAGE_URLS,
      dataSaverUrls: FALLBACK_PAGE_URLS,
      source: "fallback",
    };
  }

  try {
    const res = await fetch(`${MANGADEX_API}/at-home/server/${chapterId}`, {
      headers: HEADERS,
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`MangaDex at-home HTTP ${res.status}`);
    }

    const json = await res.json();
    const baseUrl: string = json?.baseUrl || "https://uploads.mangadex.org";
    const hash: string | undefined = json?.chapter?.hash;
    const dataFiles: string[] = json?.chapter?.data ?? [];
    const saverFiles: string[] = json?.chapter?.dataSaver ?? [];

    if (!hash || (dataFiles.length === 0 && saverFiles.length === 0)) {
      throw new Error("Empty chapter page list");
    }

    const pageUrls = dataFiles.map(
      (file) => `${baseUrl}/data/${hash}/${file}`,
    );
    const dataSaverUrls =
      saverFiles.length > 0
        ? saverFiles.map((file) => `${baseUrl}/data-saver/${hash}/${file}`)
        : pageUrls;

    return {
      chapterId,
      pageUrls,
      dataSaverUrls,
      source: "mangadex",
    };
  } catch {
    return {
      chapterId,
      pageUrls: FALLBACK_PAGE_URLS,
      dataSaverUrls: FALLBACK_PAGE_URLS,
      source: "fallback",
    };
  }
}

const FALLBACK_CHAPTERS: MangaDexChapterSummary[] = [
  {
    id: "demo-chapter-1",
    chapterNumber: "1",
    title: "Episode 1 — Awakening Panel Strip",
    volume: "1",
    pages: 5,
    publishAt: new Date().toISOString(),
    language: "en",
    scanlationGroup: "Ashabi Preview Archive",
  },
  {
    id: "demo-chapter-2",
    chapterNumber: "2",
    title: "Episode 2 — Into the Gate",
    volume: "1",
    pages: 5,
    publishAt: new Date().toISOString(),
    language: "en",
    scanlationGroup: "Ashabi Preview Archive",
  },
];

const FALLBACK_PAGE_URLS = [
  "/images/story-neon-lagos.webp",
  "/images/hero-afrofuturist-city.webp",
  "/images/story-the-iron-guild.webp",
  "/images/story-between-two-suns.webp",
  "/images/story-the-last-baobab.webp",
];
