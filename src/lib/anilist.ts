export type AniListCategory = "MANHWA" | "MANGA" | "ANIME";

export interface AniListCreator {
  id: number;
  name: string;
  role: string;
  avatar: string;
  featuredWorkId: number;
  featuredWorkTitle: string;
  category: AniListCategory;
  siteUrl: string;
}

export interface AniListMedia {
  id: number;
  category: AniListCategory;
  title: string;
  nativeTitle?: string | null;
  description: string;
  coverImage: string;
  bannerImage?: string | null;
  accentColor?: string | null;
  genres: string[];
  averageScore?: number | null;
  popularity?: number | null;
  status: string;
  chapters?: number | null;
  episodes?: number | null;
  volumes?: number | null;
  countryOfOrigin: string;
  format?: string | null;
  seasonYear?: number | null;
  siteUrl: string;
  authorName?: string;
  authorAvatar?: string | null;
  externalLinks?: {
    id: number;
    site: string;
    url: string;
    type?: string | null;
  }[];
  characters?: {
    id: number;
    name: string;
    role: string;
    image?: string | null;
  }[];
  recommendations?: {
    id: number;
    title: string;
    coverImage: string;
    averageScore?: number | null;
    type: string;
    countryOfOrigin?: string;
  }[];
}

export interface AniListHomeFeed {
  spotlight: AniListMedia[];
  manhwa: AniListMedia[];
  manga: AniListMedia[];
  anime: AniListMedia[];
  recentDrops: AniListMedia[];
  leaderboard: AniListMedia[];
  weeklySchedule: {
    day: string;
    label: string;
    media: AniListMedia;
  }[];
  topCreators: AniListCreator[];
  source: "live" | "fallback";
}

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export function stripHtml(raw?: string | null): string {
  if (!raw) return "Synopsis arriving soon.";
  return raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCategory(
  type?: string | null,
  countryOfOrigin?: string | null,
): AniListCategory {
  if (type === "ANIME") return "ANIME";
  if (countryOfOrigin === "KR") return "MANHWA";
  return "MANGA";
}

interface RawAniListNode {
  id: number;
  type?: string | null;
  format?: string | null;
  status?: string | null;
  countryOfOrigin?: string | null;
  seasonYear?: number | null;
  startDate?: { year?: number | null } | null;
  episodes?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  averageScore?: number | null;
  popularity?: number | null;
  genres?: (string | null)[] | null;
  description?: string | null;
  siteUrl?: string | null;
  bannerImage?: string | null;
  coverImage?: {
    extraLarge?: string | null;
    large?: string | null;
    color?: string | null;
  } | null;
  title?: {
    english?: string | null;
    romaji?: string | null;
    native?: string | null;
  } | null;
  staff?: {
    edges?: (
      | {
          role?: string | null;
          node?: {
            id?: number;
            siteUrl?: string | null;
            name?: { full?: string | null } | null;
            image?: { large?: string | null } | null;
          } | null;
        }
      | null
    )[] | null;
  } | null;
  characters?: {
    edges?: (
      | {
          role?: string | null;
          node?: {
            id: number;
            name?: { full?: string | null } | null;
            image?: { large?: string | null } | null;
          } | null;
        }
      | null
    )[] | null;
  } | null;
  externalLinks?: (
    | {
        id: number;
        site?: string | null;
        url?: string | null;
        type?: string | null;
      }
    | null
  )[] | null;
  recommendations?: {
    nodes?: (
      | {
          mediaRecommendation?: {
            id: number;
            type?: string | null;
            countryOfOrigin?: string | null;
            averageScore?: number | null;
            title?: {
              english?: string | null;
              romaji?: string | null;
            } | null;
            coverImage?: {
              large?: string | null;
              extraLarge?: string | null;
            } | null;
          } | null;
        }
      | null
    )[] | null;
  } | null;
}

function normalizeNode(
  node: RawAniListNode,
  forcedCategory?: AniListCategory,
): AniListMedia {
  const category =
    forcedCategory ?? resolveCategory(node.type, node.countryOfOrigin);
  const title =
    node.title?.english || node.title?.romaji || node.title?.native || "Untitled";
  const authorEdge = node.staff?.edges?.find((e) => Boolean(e?.node?.name?.full));
  const authorName =
    authorEdge?.node?.name?.full ??
    (category === "MANHWA"
      ? "Korean Webtoon Studio"
      : category === "MANGA"
        ? "Manga Creator"
        : "Animation Studio");

  return {
    id: node.id,
    category,
    title,
    nativeTitle: node.title?.native ?? null,
    description: stripHtml(node.description),
    coverImage:
      node.coverImage?.extraLarge ||
      node.coverImage?.large ||
      "/images/story-neon-lagos.webp",
    bannerImage: node.bannerImage ?? null,
    accentColor: node.coverImage?.color ?? "#f5bd43",
    genres: (node.genres ?? []).filter((g): g is string => Boolean(g)).slice(0, 4),
    averageScore: node.averageScore ?? null,
    popularity: node.popularity ?? null,
    status: (node.status ?? "RELEASING").replace(/_/g, " "),
    chapters: node.chapters ?? null,
    episodes: node.episodes ?? null,
    volumes: node.volumes ?? null,
    countryOfOrigin: node.countryOfOrigin ?? "JP",
    format: node.format ?? category,
    seasonYear: node.seasonYear ?? node.startDate?.year ?? null,
    siteUrl: node.siteUrl ?? `https://anilist.co/manga/${node.id}`,
    authorName,
    authorAvatar: authorEdge?.node?.image?.large ?? null,
    externalLinks: (node.externalLinks ?? [])
      .filter((link): link is NonNullable<typeof link> =>
        Boolean(link && link.site && link.url),
      )
      .map((link) => ({
        id: link.id,
        site: link.site!,
        url: link.url!,
        type: link.type ?? null,
      })),
    characters: (node.characters?.edges ?? [])
      .filter((edge): edge is NonNullable<typeof edge> =>
        Boolean(edge?.node?.name?.full),
      )
      .map((edge) => ({
        id: edge.node!.id,
        name: edge.node!.name!.full!,
        role: edge.role ?? "MAIN",
        image: edge.node?.image?.large ?? null,
      })),
    recommendations: (node.recommendations?.nodes ?? [])
      .map((rec) => rec?.mediaRecommendation)
      .filter((rec): rec is NonNullable<typeof rec> => Boolean(rec && rec.id))
      .map((rec) => ({
        id: rec.id,
        title: rec.title?.english || rec.title?.romaji || "Recommended Series",
        coverImage:
          rec.coverImage?.extraLarge ||
          rec.coverImage?.large ||
          "/images/story-neon-lagos.webp",
        averageScore: rec.averageScore ?? null,
        type: rec.type ?? "MANGA",
        countryOfOrigin: rec.countryOfOrigin ?? undefined,
      })),
  };
}

const MEDIA_FIELDS = `
  id
  type
  format
  status
  countryOfOrigin
  seasonYear
  startDate { year }
  episodes
  chapters
  volumes
  averageScore
  popularity
  genres
  description(asHtml: false)
  siteUrl
  bannerImage
  coverImage {
    extraLarge
    large
    color
  }
  title {
    english
    romaji
    native
  }
  staff(perPage: 2) {
    edges {
      role
      node {
        id
        siteUrl
        name { full }
        image { large }
      }
    }
  }
`;

const HOME_FEED_QUERY = `
  query AshabiHomeAniListFeed {
    manhwa: Page(page: 1, perPage: 10) {
      media(type: MANGA, countryOfOrigin: "KR", sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
    manga: Page(page: 1, perPage: 10) {
      media(type: MANGA, countryOfOrigin: "JP", sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
    anime: Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
    leaderboard: Page(page: 1, perPage: 8) {
      media(type: MANGA, sort: [POPULARITY_DESC, SCORE_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const MEDIA_DETAIL_QUERY = `
  query AshabiAniListDetail($id: Int) {
    Media(id: $id, isAdult: false) {
      ${MEDIA_FIELDS}
      characters(sort: [ROLE, RELEVANCE], perPage: 6) {
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
        }
      }
      externalLinks {
        id
        site
        url
        type
      }
      recommendations(sort: RATING_DESC, perPage: 5) {
        nodes {
          mediaRecommendation {
            id
            type
            countryOfOrigin
            averageScore
            title {
              english
              romaji
            }
            coverImage {
              extraLarge
              large
            }
          }
        }
      }
    }
  }
`;

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function extractCreators(nodes: RawAniListNode[]): AniListCreator[] {
  const seen = new Set<number>();
  const creators: AniListCreator[] = [];

  for (const node of nodes) {
    const category = resolveCategory(node.type, node.countryOfOrigin);
    const workTitle =
      node.title?.english || node.title?.romaji || node.title?.native || "Series";
    for (const edge of node.staff?.edges ?? []) {
      const staffNode = edge?.node;
      if (
        !staffNode?.id ||
        !staffNode.name?.full ||
        seen.has(staffNode.id)
      ) {
        continue;
      }
      seen.add(staffNode.id);
      creators.push({
        id: staffNode.id,
        name: staffNode.name.full,
        role: edge?.role || "Story & Art",
        avatar:
          staffNode.image?.large ||
          node.coverImage?.large ||
          "/images/creator-zuri.webp",
        featuredWorkId: node.id,
        featuredWorkTitle: workTitle,
        category,
        siteUrl: staffNode.siteUrl || `https://anilist.co/staff/${staffNode.id}`,
      });
      if (creators.length >= 6) return creators;
    }
  }

  return creators;
}

function buildHomeFeed(
  manhwa: AniListMedia[],
  manga: AniListMedia[],
  anime: AniListMedia[],
  leaderboardRaw: AniListMedia[],
  topCreators: AniListCreator[],
  source: "live" | "fallback",
): AniListHomeFeed {
  // 1. Spotlight: top 6 with wide banners mixing Manhwa, Manga, and Anime
  const combinedForSpotlight = [
    ...manhwa.slice(0, 3),
    ...manga.slice(0, 2),
    ...anime.slice(0, 2),
  ];
  const spotlight = combinedForSpotlight
    .sort((a, b) => (b.BannerScore ?? (b.bannerImage ? 1 : 0)) - (a.BannerScore ?? (a.bannerImage ? 1 : 0)))
    .slice(0, 6);

  // 2. Recent Drops: 8 releasing Manhwa, Manga & Airing Anime
  const recentDrops = [
    ...manhwa.filter((m) => m.status.includes("RELEASING")).slice(0, 4),
    ...manga.filter((m) => m.status.includes("RELEASING")).slice(0, 2),
    ...anime.slice(0, 2),
  ].slice(0, 8);

  // 3. Leaderboard: top 8 most popular
  const leaderboard =
    leaderboardRaw.length > 0
      ? leaderboardRaw.slice(0, 8)
      : [...manhwa, ...manga]
          .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
          .slice(0, 8);

  // 4. Weekly Schedule: 7 days populated from releasing Manhwa/Manga/Anime
  const schedulePool = [...manhwa.slice(0, 4), ...manga.slice(0, 2), ...anime.slice(0, 2)];
  const weeklySchedule = DAYS.map((day, idx) => {
    const media = schedulePool[idx % schedulePool.length] ?? manhwa[0];
    return {
      day,
      label:
        media.category === "MANHWA"
          ? "KR Webtoon"
          : media.category === "MANGA"
            ? "JP Manga"
            : "Simulcast Anime",
      media,
    };
  });

  return {
    spotlight,
    manhwa,
    manga,
    anime,
    recentDrops: recentDrops.length >= 4 ? recentDrops : [...manhwa.slice(0, 4), ...manga.slice(0, 4)],
    leaderboard,
    weeklySchedule,
    topCreators,
    source,
  };
}

// Helper type augmentation avoided by simple sort
declare module "./anilist" {
  interface AniListMedia {
    BannerScore?: number;
  }
}

export async function getAniListHomeFeed(): Promise<AniListHomeFeed> {
  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: HOME_FEED_QUERY }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`AniList HTTP ${response.status}`);
    }

    const json = await response.json();
    const data = json?.data;

    if (!data) {
      throw new Error("Empty AniList GraphQL payload");
    }

    const rawManhwa: RawAniListNode[] = data.manhwa?.media ?? [];
    const rawManga: RawAniListNode[] = data.manga?.media ?? [];
    const rawAnime: RawAniListNode[] = data.anime?.media ?? [];
    const rawLeaderboard: RawAniListNode[] = data.leaderboard?.media ?? [];

    const manhwa = rawManhwa.map((node) => normalizeNode(node, "MANHWA"));
    const manga = rawManga.map((node) => normalizeNode(node, "MANGA"));
    const anime = rawAnime.map((node) => normalizeNode(node, "ANIME"));
    const leaderboard = rawLeaderboard.map((node) => normalizeNode(node));

    if (manhwa.length === 0 && manga.length === 0 && anime.length === 0) {
      return FALLBACK_HOME_FEED;
    }

    const topCreators = extractCreators([
      ...rawManhwa.slice(0, 4),
      ...rawManga.slice(0, 4),
      ...rawAnime.slice(0, 2),
    ]);

    return buildHomeFeed(
      manhwa,
      manga,
      anime,
      leaderboard,
      topCreators,
      "live",
    );
  } catch {
    return FALLBACK_HOME_FEED;
  }
}

export async function getAniListMediaById(
  id: number,
): Promise<AniListMedia | null> {
  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: MEDIA_DETAIL_QUERY,
        variables: { id },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`AniList detail HTTP ${response.status}`);
    }

    const json = await response.json();
    const rawMedia = json?.data?.Media as RawAniListNode | undefined;
    if (!rawMedia) return null;
    return normalizeNode(rawMedia);
  } catch {
    const allFallback = [
      ...FALLBACK_HOME_FEED.manhwa,
      ...FALLBACK_HOME_FEED.manga,
      ...FALLBACK_HOME_FEED.anime,
    ];
    return allFallback.find((item) => item.id === id) ?? null;
  }
}

const FALLBACK_MANHWA: AniListMedia[] = [
  {
    id: 105398,
    category: "MANHWA",
    title: "Solo Leveling",
    nativeTitle: "나 혼자만 레벨업",
    description:
      "In a world where awakened hunters battle monsters across dimensional gates, E-rank hunter Sung Jinwoo receives a mysterious system that lets him level up without limits.",
    coverImage: "/images/story-neon-lagos.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#f5bd43",
    genres: ["Action", "Adventure", "Fantasy"],
    averageScore: 86,
    popularity: 360000,
    status: "FINISHED",
    chapters: 201,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2018,
    siteUrl: "https://anilist.co/manga/105398",
    authorName: "Chugong · DUBU",
  },
  {
    id: 119257,
    category: "MANHWA",
    title: "Omniscient Reader",
    nativeTitle: "전지적 독자 시점",
    description:
      "Kim Dokja is the sole reader of a decade-long web novel. When the real world suddenly merges with the novel's apocalyptic scenarios, only he knows how the story ends.",
    coverImage: "/images/story-between-two-suns.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#f5bd43",
    genres: ["Action", "Fantasy", "Adventure"],
    averageScore: 88,
    popularity: 185000,
    status: "RELEASING",
    chapters: null,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2020,
    siteUrl: "https://anilist.co/manga/119257",
    authorName: "Sing N Song · Sleepy-C",
  },
];

const FALLBACK_MANGA: AniListMedia[] = [
  {
    id: 30013,
    category: "MANGA",
    title: "One Piece",
    nativeTitle: "ONE PIECE",
    description:
      "Monkey D. Luffy sets sail across the Grand Line with the Straw Hat Pirates in search of the legendary treasure One Piece to become King of the Pirates.",
    coverImage: "/images/story-the-iron-guild.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#f5bd43",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"],
    averageScore: 92,
    popularity: 420000,
    status: "RELEASING",
    chapters: null,
    countryOfOrigin: "JP",
    format: "MANGA",
    seasonYear: 1997,
    siteUrl: "https://anilist.co/manga/30013",
    authorName: "Eiichiro Oda",
  },
];

const FALLBACK_ANIME: AniListMedia[] = [
  {
    id: 151807,
    category: "ANIME",
    title: "Solo Leveling",
    nativeTitle: "俺だけレベルアップな件",
    description:
      "Ten years ago, the Gate appeared and connected the real world with the realm of magic and monsters. Weakest hunter Sung Jinwoo awakens a secret quest program.",
    coverImage: "/images/story-the-last-baobab.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#f5bd43",
    genres: ["Action", "Adventure", "Fantasy"],
    averageScore: 84,
    popularity: 310000,
    status: "FINISHED",
    episodes: 12,
    countryOfOrigin: "JP",
    format: "TV",
    seasonYear: 2024,
    siteUrl: "https://anilist.co/anime/151807",
    authorName: "A-1 Pictures",
  },
];

const FALLBACK_HOME_FEED = buildHomeFeed(
  FALLBACK_MANHWA,
  FALLBACK_MANGA,
  FALLBACK_ANIME,
  [...FALLBACK_MANHWA, ...FALLBACK_MANGA],
  [],
  "fallback",
);
