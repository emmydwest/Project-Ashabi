import { cachedRateLimitedFetch } from "@/lib/rate-limit";

export interface MangaDexChapterSummary {
  id: string;
  chapterNumber: string;
  title: string;
  volume?: string | null;
  pages: number;
  publishAt: string;
  language: string;
  languageName: string;
  scanlationGroup?: string;
}

export interface MangaDexLanguageOption {
  code: string;
  name: string;
  count: number;
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

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "Français (French)",
  es: "Español (Spanish)",
  "es-la": "Español (LATAM)",
  "pt-br": "Português (Brasil)",
  pt: "Português",
  ru: "Русский (Russian)",
  id: "Bahasa Indonesia",
  ar: "العربية (Arabic)",
  de: "Deutsch (German)",
  it: "Italiano (Italian)",
  tr: "Türkçe (Turkish)",
  vi: "Tiếng Việt (Vietnamese)",
  pl: "Polski (Polish)",
  th: "ไทย (Thai)",
  hi: "हिन्दी (Hindi)",
  ka: "ქართული (Georgian)",
  ms: "Bahasa Melayu",
  zh: "中文 (Chinese)",
  "zh-hk": "中文 (Traditional)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
};

export function getLanguageLabel(code: string): string {
  const normalized = code.toLowerCase();
  return LANGUAGE_NAMES[normalized] ?? normalized.toUpperCase();
}

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

function normalizeRawChaptersByLanguage(
  rawList: RawMangaDexChapter[],
  seenLangChapter: Set<string>,
  chapters: MangaDexChapterSummary[],
) {
  for (const item of rawList) {
    const pages = item.attributes?.pages ?? 0;
    const externalUrl = item.attributes?.externalUrl;
    if (pages <= 0 || externalUrl) continue;

    const lang = (item.attributes?.translatedLanguage ?? "en").toLowerCase();
    const rawCh = item.attributes?.chapter?.trim();
    const chNum = rawCh && rawCh.length > 0 ? rawCh : "1";

    const dedupeKey = `${lang}:${chNum}`;
    if (seenLangChapter.has(dedupeKey)) continue;
    seenLangChapter.add(dedupeKey);

    const groupRel = item.relationships?.find(
      (r) => r.type === "scanlation_group",
    );
    const languageName = getLanguageLabel(lang);

    chapters.push({
      id: item.id,
      chapterNumber: chNum,
      title: item.attributes?.title?.trim() || `Chapter ${chNum}`,
      volume: item.attributes?.volume ?? null,
      pages,
      publishAt: item.attributes?.publishAt ?? new Date().toISOString(),
      language: lang,
      languageName,
      scanlationGroup: groupRel?.attributes?.name ?? "MangaDex Release",
    });
  }
}

async function fetchFeedForMangaCandidate(
  mangaId: string,
  seenLangChapter: Set<string>,
  chapters: MangaDexChapterSummary[],
): Promise<void> {
  // 1. Fetch up to 500 English hosted chapters first so Chapter 1 is always captured
  const enFeedUrl =
    `${MANGADEX_API}/manga/${mangaId}/feed` +
    `?translatedLanguage[]=en` +
    `&order[chapter]=asc` +
    `&limit=500` +
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
      normalizeRawChaptersByLanguage(
        jsonEn?.data ?? [],
        seenLangChapter,
        chapters,
      );
    }
  } catch {
    // Continue
  }

  // 2. Also fetch multi-language hosted chapters so users can choose their preferred language
  const multiFeedUrl =
    `${MANGADEX_API}/manga/${mangaId}/feed` +
    `?order[chapter]=asc` +
    `&limit=500` +
    `&includes[]=scanlation_group` +
    `&contentRating[]=safe` +
    `&contentRating[]=suggestive` +
    `&contentRating[]=erotica` +
    `&includeEmptyPages=0` +
    `&includeFuturePublishAt=0` +
    `&includeExternalUrl=0`;

  try {
    const resMulti = await fetch(multiFeedUrl, {
      headers: HEADERS,
      next: { revalidate: 1800 },
    });
    if (resMulti.ok) {
      const jsonMulti = await resMulti.json();
      normalizeRawChaptersByLanguage(
        jsonMulti?.data ?? [],
        seenLangChapter,
        chapters,
      );
    }
  } catch {
    // Ignore
  }
}

export async function getMangaDexChaptersForTitle(
  primaryTitle: string,
  nativeTitle?: string | null,
): Promise<{
  mangaDexId: string | null;
  chapters: MangaDexChapterSummary[];
  availableLanguages: MangaDexLanguageOption[];
  defaultLanguage: string;
}> {
  const cacheKey = `mangadex:title:${primaryTitle}:${nativeTitle ?? ""}`;

  return cachedRateLimitedFetch(cacheKey, "mangadex", 1800, async () => {
    const shortTitle = primaryTitle.split(/[:;-]/)[0]?.trim();
    const queries = Array.from(
      new Set(
        [primaryTitle, shortTitle, nativeTitle].filter(
          (q): q is string => Boolean(q && q.trim().length > 1),
        ),
      ),
    );

    const seenLangChapter = new Set<string>();
    const collectedChapters: MangaDexChapterSummary[] = [];
    let primaryMangaDexId: string | null = null;

    for (const q of queries) {
      try {
        const searchUrl =
          `${MANGADEX_API}/manga?title=${encodeURIComponent(q)}` +
          `&limit=5&order[followedCount]=desc&hasAvailableChapters=true`;

        const res = await fetch(searchUrl, {
          headers: HEADERS,
          next: { revalidate: 1800 },
        });

        if (!res.ok) continue;
        const data = await res.json();
        const candidates: { id: string }[] = data?.data ?? [];

        // Check up to top 3 candidates for this title so if Candidate 1 starts at Ch 216
        // and Candidate 2 has Ch 1-215 (like One Piece or Vagabond), both merge cleanly from Chapter 1!
        for (const candidate of candidates.slice(0, 3)) {
          if (!primaryMangaDexId) primaryMangaDexId = candidate.id;
          await fetchFeedForMangaCandidate(
            candidate.id,
            seenLangChapter,
            collectedChapters,
          );

          // Check if we already have English chapters starting at Chapter 0 or 1
          const hasEnglishCh1 = collectedChapters.some(
            (c) =>
              c.language === "en" &&
              (c.chapterNumber === "1" ||
                c.chapterNumber === "0" ||
                c.chapterNumber === "0.1"),
          );
          const enCount = collectedChapters.filter(
            (c) => c.language === "en",
          ).length;

          if (hasEnglishCh1 && enCount >= 10) {
            break;
          }
        }

        if (collectedChapters.length > 0) {
          break;
        }
      } catch {
        // Continue to next query
      }
    }

    if (collectedChapters.length === 0) {
      return {
        mangaDexId: null,
        chapters: FALLBACK_CHAPTERS,
        availableLanguages: [
          { code: "en", name: "English", count: FALLBACK_CHAPTERS.length },
        ],
        defaultLanguage: "en",
      };
    }

    // Sort chapters numerically by chapterNumber
    collectedChapters.sort((a, b) => {
      const numA = parseFloat(a.chapterNumber);
      const numB = parseFloat(b.chapterNumber);
      if (Number.isFinite(numA) && Number.isFinite(numB)) {
        return numA - numB;
      }
      return a.chapterNumber.localeCompare(b.chapterNumber);
    });

    // Build available languages list, always prioritizing English ('en') first if present
    const langCounts = new Map<string, number>();
    for (const ch of collectedChapters) {
      langCounts.set(ch.language, (langCounts.get(ch.language) ?? 0) + 1);
    }

    const availableLanguages: MangaDexLanguageOption[] = Array.from(
      langCounts.entries(),
    )
      .map(([code, count]) => ({
        code,
        name: getLanguageLabel(code),
        count,
      }))
      .sort((a, b) => {
        if (a.code === "en") return -1;
        if (b.code === "en") return 1;
        return b.count - a.count;
      });

    const defaultLanguage = availableLanguages[0]?.code ?? "en";

    return {
      mangaDexId: primaryMangaDexId,
      chapters: collectedChapters,
      availableLanguages,
      defaultLanguage,
    };
  });
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

  return cachedRateLimitedFetch(
    `mangadex:pages:${chapterId}`,
    "mangadex",
    900,
    async () => {
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
    },
  );
}

const FALLBACK_CHAPTERS: MangaDexChapterSummary[] = [
  {
    id: "demo-chapter-1",
    chapterNumber: "1",
    title: "Chapter 1 — Awakening Panel Strip",
    volume: "1",
    pages: 5,
    publishAt: new Date().toISOString(),
    language: "en",
    languageName: "English",
    scanlationGroup: "Ashabi Preview Archive",
  },
  {
    id: "demo-chapter-2",
    chapterNumber: "2",
    title: "Chapter 2 — Into the Gate",
    volume: "1",
    pages: 5,
    publishAt: new Date().toISOString(),
    language: "en",
    languageName: "English",
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
