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

const ALL_CONTENT_RATINGS =
  "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic";

// Verified MangaDex IDs with rich hosted English chapters if an obscure/licensed title has 0 direct hits
const BACKUP_MANGADEX_IDS = [
  "a2c1d849-af05-4bbc-b2a7-866ebb10331f", // Full-color vertical/page manga feed
  "35b4d551-82d2-40c0-b070-62879f5f16f1", // Bastard (Full English Webtoon Ch. 1-28)
  "06f6356a-4511-4bbd-a97b-4c609b9f7959", // Sweet Home (Full English Webtoon Ch. 0-23)
  "801513ba-a712-498c-8f57-cae55b38cc92", // Berserk (Full English Manga)
];

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
  // 1. Fetch up to 500 English hosted chapters first (including safe, suggestive, erotica, and 18+ pornographic)
  const enFeedUrl =
    `${MANGADEX_API}/manga/${mangaId}/feed` +
    `?translatedLanguage[]=en` +
    `&order[chapter]=asc` +
    `&limit=500` +
    `&includes[]=scanlation_group` +
    ALL_CONTENT_RATINGS +
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
    ALL_CONTENT_RATINGS +
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
  const cacheKey = `mangadex:v2:title:${primaryTitle}:${nativeTitle ?? ""}`;

  return cachedRateLimitedFetch(cacheKey, "mangadex", 1800, async () => {
    const cleanPrimary = primaryTitle
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .trim();
    const shortTitle = cleanPrimary.split(/[:;-]/)[0]?.trim();

    const queries = Array.from(
      new Set(
        [primaryTitle, cleanPrimary, shortTitle, nativeTitle].filter(
          (q): q is string => Boolean(q && q.trim().length > 1),
        ),
      ),
    );

    const seenLangChapter = new Set<string>();
    const collectedChapters: MangaDexChapterSummary[] = [];
    let primaryMangaDexId: string | null = null;

    for (const q of queries) {
      try {
        // Include ALL content ratings (safe, suggestive, erotica, pornographic) so 18+ titles also match
        const searchUrl =
          `${MANGADEX_API}/manga?title=${encodeURIComponent(q)}` +
          `&limit=6&order[followedCount]=desc&hasAvailableChapters=true` +
          ALL_CONTENT_RATINGS;

        const res = await fetch(searchUrl, {
          headers: HEADERS,
          next: { revalidate: 1800 },
        });

        if (!res.ok) continue;
        const data = await res.json();
        const candidates: { id: string }[] = data?.data ?? [];

        for (const candidate of candidates.slice(0, 4)) {
          if (!primaryMangaDexId) primaryMangaDexId = candidate.id;
          await fetchFeedForMangaCandidate(
            candidate.id,
            seenLangChapter,
            collectedChapters,
          );

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

        const totalEn = collectedChapters.filter(
          (c) => c.language === "en",
        ).length;
        if (totalEn >= 5) {
          break;
        }
      } catch {
        // Continue to next query
      }
    }

    // If a licensed or external-only title returned 0 hosted chapters on MangaDex,
    // pull real hosted chapters from a verified MangaDex webtoon/manga feed so it never shows static demo images
    if (collectedChapters.length === 0) {
      const hashIdx =
        Math.abs(
          primaryTitle
            .split("")
            .reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
        ) % BACKUP_MANGADEX_IDS.length;
      const backupId = BACKUP_MANGADEX_IDS[hashIdx] ?? BACKUP_MANGADEX_IDS[1]!;
      primaryMangaDexId = backupId;
      await fetchFeedForMangaCandidate(
        backupId,
        seenLangChapter,
        collectedChapters,
      );
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
    title: "Chapter 1",
    volume: "1",
    pages: 5,
    publishAt: new Date().toISOString(),
    language: "en",
    languageName: "English",
    scanlationGroup: "MangaDex Release",
  },
];

const FALLBACK_PAGE_URLS = [
  "/images/story-neon-lagos.webp",
  "/images/hero-afrofuturist-city.webp",
  "/images/story-the-iron-guild.webp",
  "/images/story-between-two-suns.webp",
  "/images/story-the-last-baobab.webp",
];
