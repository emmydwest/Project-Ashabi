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

function normalizeRawChapters(
  rawList: RawMangaDexChapter[],
  seenChapters: Set<string>,
  chapters: MangaDexChapterSummary[],
) {
  for (const item of rawList) {
    const pages = item.attributes?.pages ?? 0;
    const externalUrl = item.attributes?.externalUrl;
    if (pages <= 0 || externalUrl) continue;

    const chNum =
      item.attributes?.chapter?.trim() || String(chapters.length + 1);
    if (seenChapters.has(chNum)) continue;
    seenChapters.add(chNum);

    const groupRel = item.relationships?.find(
      (r) => r.type === "scanlation_group",
    );
    const lang = (item.attributes?.translatedLanguage ?? "en").toUpperCase();

    chapters.push({
      id: item.id,
      chapterNumber: chNum,
      title:
        item.attributes?.title?.trim() ||
        `Chapter ${chNum}${lang !== "EN" ? ` (${lang})` : ""}`,
      volume: item.attributes?.volume ?? null,
      pages,
      publishAt: item.attributes?.publishAt ?? new Date().toISOString(),
      language: item.attributes?.translatedLanguage ?? "en",
      scanlationGroup: groupRel?.attributes?.name ?? "MangaDex Release",
    });
  }
}

async function fetchPlayableFeedForMangaId(
  mangaId: string,
): Promise<MangaDexChapterSummary[]> {
  const seenChapters = new Set<string>();
  const chapters: MangaDexChapterSummary[] = [];

  // 1. Prefer English hosted chapters first
  const enFeedUrl =
    `${MANGADEX_API}/manga/${mangaId}/feed` +
    `?translatedLanguage[]=en` +
    `&order[chapter]=asc` +
    `&limit=96` +
    `&includes[]=scanlation_group` +
    `&contentRating[]=safe` +
    `&contentRating[]=suggestive` +
    `&contentRating[]=erotica` +
    `&includeEmptyPages=0` +
    `&includeFuturePublishAt=0` +
    `&includeExternalUrl=0`;

  try {
    const resEn = await fetch(enFeedUrl, {
      headers: HEADERS,
      next: { revalidate: 1800 },
    });
    if (resEn.ok) {
      const jsonEn = await resEn.json();
      normalizeRawChapters(jsonEn?.data ?? [], seenChapters, chapters);
    }
  } catch {
    // Continue to multi-language fallback if needed
  }

  // 2. If a licensed Manhwa/Manga has fewer than 5 English chapters hosted directly on MangaDex,
  // also include hosted chapters across all available languages so full vertical strips are playable
  if (chapters.length < 5) {
    const anyFeedUrl =
      `${MANGADEX_API}/manga/${mangaId}/feed` +
      `?order[chapter]=asc` +
      `&limit=96` +
      `&includes[]=scanlation_group` +
      `&contentRating[]=safe` +
      `&contentRating[]=suggestive` +
      `&contentRating[]=erotica` +
      `&includeEmptyPages=0` +
      `&includeFuturePublishAt=0` +
      `&includeExternalUrl=0`;

    try {
      const resAny = await fetch(anyFeedUrl, {
        headers: HEADERS,
        next: { revalidate: 1800 },
      });
      if (resAny.ok) {
        const jsonAny = await resAny.json();
        normalizeRawChapters(jsonAny?.data ?? [], seenChapters, chapters);
      }
    } catch {
      // Ignore error
    }
  }

  chapters.sort((a, b) => {
    const numA = parseFloat(a.chapterNumber);
    const numB = parseFloat(b.chapterNumber);
    if (Number.isFinite(numA) && Number.isFinite(numB)) {
      return numA - numB;
    }
    return a.chapterNumber.localeCompare(b.chapterNumber);
  });

  return chapters;
}

export async function getMangaDexChaptersForTitle(
  primaryTitle: string,
  nativeTitle?: string | null,
): Promise<{
  mangaDexId: string | null;
  chapters: MangaDexChapterSummary[];
}> {
  const shortTitle = primaryTitle.split(/[:;-]/)[0]?.trim();
  const queries = Array.from(
    new Set(
      [primaryTitle, shortTitle, nativeTitle].filter(
        (q): q is string => Boolean(q && q.trim().length > 1),
      ),
    ),
  );

  for (const q of queries) {
    try {
      // IMPORTANT: MangaDex v5 requires camelCase `order[followedCount]=desc`
      const searchUrl =
        `${MANGADEX_API}/manga?title=${encodeURIComponent(q)}` +
        `&limit=6&order[followedCount]=desc&hasAvailableChapters=true`;

      const res = await fetch(searchUrl, {
        headers: HEADERS,
        next: { revalidate: 1800 },
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
      // Continue to next query candidate
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
      (file) =>
        `/api/manga-image?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${file}`)}`,
    );
    const dataSaverUrls =
      saverFiles.length > 0
        ? saverFiles.map(
            (file) =>
              `/api/manga-image?url=${encodeURIComponent(`${baseUrl}/data-saver/${hash}/${file}`)}`,
          )
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
