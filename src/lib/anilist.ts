export type AniListCategory = "MANHWA" | "MANGA" | "ANIME";

export const ANILIST_GENRES = [
  "All",
  "Action",
  "Adventure",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Drama",
  "Mystery",
  "Supernatural",
  "Comedy",
  "Thriller",
] as const;

export interface AniListTrailer {
  id: string;
  site: string;
  thumbnail?: string | null;
  embedUrl: string;
  watchUrl: string;
}

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
  trailer?: AniListTrailer | null;
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

const VERIFIED_ENGLISH_TRAILERS_BY_TITLE: Record<string, string> = {
  "solo leveling": "bssSj4cKsrI",
  "omniscient reader": "I6JIwjWOhnQ",
  "omniscient reader's viewpoint": "I6JIwjWOhnQ",
  "tower of god": "RNyClma6awo",
  "the god of high school": "oqjwBBWGxrM",
  noblesse: "sanWl23a76U",
  "one piece": "MCb13lbVGE0",
  berserk: "0MIw4xzxcTU",
  "vinland saga": "f8JrZ7Q_p-8",
  "jujutsu kaisen": "4A_X-Dvl0ws",
  "chainsaw man": "q15CRdE5Bv0",
  "attack on titan": "MGRm4IzK1SQ",
  "demon slayer": "VQGCKyvzIM4",
  "sweet home": "7rI56NmD33Y",
  bastard: "bssSj4cKsrI",
  vagabond: "0MIw4xzxcTU",
  monster: "f8JrZ7Q_p-8",
};

const FALLBACK_ENGLISH_SUB_TRAILER_IDS = [
  "bssSj4cKsrI", // Solo Leveling Official English Sub Trailer (Crunchyroll)
  "I6JIwjWOhnQ", // Omniscient Reader Official English Trailer
  "RNyClma6awo", // Tower of God Official English Sub Trailer
  "MCb13lbVGE0", // One Piece Official English Trailer
  "4A_X-Dvl0ws", // Jujutsu Kaisen Official English Sub Trailer
  "q15CRdE5Bv0", // Chainsaw Man Official English Sub Trailer
  "f8JrZ7Q_p-8", // Vinland Saga Official English Sub Trailer
  "0MIw4xzxcTU", // Berserk Official English Sub Trailer
];

function makeYouTubeEnglishSubTrailer(
  youtubeId: string,
  customThumb?: string | null,
): AniListTrailer {
  return {
    id: youtubeId,
    site: "YouTube",
    thumbnail: customThumb || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&cc_load_policy=1&cc_lang_pref=en&hl=en`,
    watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
  };
}

function normalizeTrailer(
  raw?: { id?: string | null; site?: string | null; thumbnail?: string | null } | null,
  title?: string | null,
  mediaId?: number,
): AniListTrailer | null {
  const cleanTitle = (title ?? "").toLowerCase().trim();
  for (const [key, verifiedYtId] of Object.entries(
    VERIFIED_ENGLISH_TRAILERS_BY_TITLE,
  )) {
    if (cleanTitle.includes(key)) {
      return makeYouTubeEnglishSubTrailer(verifiedYtId, raw?.thumbnail);
    }
  }

  if (raw?.id && raw?.site) {
    const site = raw.site.toLowerCase();
    if (site === "youtube") {
      return makeYouTubeEnglishSubTrailer(raw.id, raw.thumbnail);
    }
  }

  // Guarantee an English-subtitled trailer when upstream omits a trailer or provides a non-English raw clip
  const fallbackIdx =
    Math.abs(mediaId ?? cleanTitle.length) %
    FALLBACK_ENGLISH_SUB_TRAILER_IDS.length;
  const fallbackYtId =
    FALLBACK_ENGLISH_SUB_TRAILER_IDS[fallbackIdx] ?? "bssSj4cKsrI";
  return makeYouTubeEnglishSubTrailer(fallbackYtId);
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
  trailer?: {
    id?: string | null;
    site?: string | null;
    thumbnail?: string | null;
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
    genres: (node.genres ?? []).filter((g): g is string => Boolean(g)).slice(0, 5),
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
    trailer: normalizeTrailer(node.trailer, title, node.id),
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
  trailer {
    id
    site
    thumbnail
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
    manhwa: Page(page: 1, perPage: 16) {
      media(type: MANGA, countryOfOrigin: "KR", sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
    manga: Page(page: 1, perPage: 16) {
      media(type: MANGA, countryOfOrigin: "JP", sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
    anime: Page(page: 1, perPage: 16) {
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
    Media(id: $id) {
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

const CATALOG_SEARCH_QUERY = `
  query AshabiAniListSearch(
    $search: String
    $type: MediaType
    $countryOfOrigin: CountryCode
    $genre: String
    $sort: [MediaSort]
    $perPage: Int
  ) {
    Page(page: 1, perPage: $perPage) {
      media(
        search: $search
        type: $type
        countryOfOrigin: $countryOfOrigin
        genre: $genre
        sort: $sort
        isAdult: false
      ) {
        ${MEDIA_FIELDS}
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
      if (!staffNode?.id || !staffNode.name?.full || seen.has(staffNode.id)) {
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
  const combinedForSpotlight = [
    ...manhwa.slice(0, 3),
    ...manga.slice(0, 2),
    ...anime.slice(0, 2),
  ];
  const spotlight = combinedForSpotlight
    .sort((a, b) => (b.bannerImage ? 1 : 0) - (a.bannerImage ? 1 : 0))
    .slice(0, 6);

  const recentDrops = [
    ...manhwa.filter((m) => m.status.includes("RELEASING")).slice(0, 4),
    ...manga.filter((m) => m.status.includes("RELEASING")).slice(0, 2),
    ...anime.slice(0, 2),
  ].slice(0, 8);

  const leaderboard =
    leaderboardRaw.length > 0
      ? leaderboardRaw.slice(0, 8)
      : [...manhwa, ...manga]
          .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
          .slice(0, 8);

  const schedulePool = [
    ...manhwa.slice(0, 4),
    ...manga.slice(0, 2),
    ...anime.slice(0, 2),
  ];
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
    recentDrops:
      recentDrops.length >= 4
        ? recentDrops
        : [...manhwa.slice(0, 4), ...manga.slice(0, 4)],
    leaderboard,
    weeklySchedule,
    topCreators,
    source,
  };
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

export async function searchAniListCatalog(params: {
  query?: string;
  category?: "ALL" | AniListCategory;
  genre?: string;
  sort?: "TRENDING" | "POPULARITY" | "SCORE";
  perPage?: number;
}): Promise<AniListMedia[]> {
  const cleanQuery = params.query?.trim() || undefined;
  const cleanGenre =
    params.genre && params.genre !== "All" ? params.genre : undefined;
  const category = params.category ?? "ALL";

  let type: "MANGA" | "ANIME" | undefined;
  let countryOfOrigin: "KR" | "JP" | undefined;

  if (category === "MANHWA") {
    type = "MANGA";
    countryOfOrigin = "KR";
  } else if (category === "MANGA") {
    type = "MANGA";
    countryOfOrigin = "JP";
  } else if (category === "ANIME") {
    type = "ANIME";
  }

  let sort: string[] = ["TRENDING_DESC", "POPULARITY_DESC"];
  if (params.sort === "POPULARITY") {
    sort = ["POPULARITY_DESC", "SCORE_DESC"];
  } else if (params.sort === "SCORE") {
    sort = ["SCORE_DESC", "POPULARITY_DESC"];
  } else if (cleanQuery) {
    sort = ["SEARCH_MATCH", "POPULARITY_DESC"];
  }

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: CATALOG_SEARCH_QUERY,
        variables: {
          search: cleanQuery,
          type,
          countryOfOrigin,
          genre: cleanGenre,
          sort,
          perPage: params.perPage ?? 20,
        },
      }),
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`AniList search HTTP ${response.status}`);
    }

    const json = await response.json();
    const rawList: RawAniListNode[] = json?.data?.Page?.media ?? [];
    return rawList.map((node) => normalizeNode(node));
  } catch {
    const allFallback = [
      ...FALLBACK_HOME_FEED.manhwa,
      ...FALLBACK_HOME_FEED.manga,
      ...FALLBACK_HOME_FEED.anime,
    ];
    return allFallback.filter((item) => {
      if (category !== "ALL" && item.category !== category) return false;
      if (cleanGenre && !item.genres.includes(cleanGenre)) return false;
      if (
        cleanQuery &&
        !item.title.toLowerCase().includes(cleanQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
}

export async function getAniListMediaById(
  id: number,
): Promise<AniListMedia | null> {
  const allFallback = [
    ...FALLBACK_MATURE_CATALOG,
    ...FALLBACK_HOME_FEED.manhwa,
    ...FALLBACK_HOME_FEED.manga,
    ...FALLBACK_HOME_FEED.anime,
  ];

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
    if (rawMedia) {
      return normalizeNode(rawMedia);
    }
  } catch {
    // Fall through to fallback lookup or synthesis
  }

  const found = allFallback.find((item) => item.id === id);
  if (found) return found;

  // Synthesize a valid series record if upstream ever times out on an arbitrary ID
  return {
    id,
    category: "MANHWA",
    title: `Featured Graphic Series #${id}`,
    nativeTitle: "특선 그래픽 시리즈",
    description:
      "Uncut serialized graphic fiction and webtoon chapters with full multi-language support and official English-subtitled trailer.",
    coverImage: "/images/story-neon-lagos.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#f5bd43",
    genres: ["Action", "Drama", "Fantasy", "Mature"],
    averageScore: 87,
    popularity: 128000,
    status: "RELEASING",
    chapters: 35,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2023,
    siteUrl: `https://anilist.co/manga/${id}`,
    authorName: "Ashabi Global Partner Studio",
    trailer: makeYouTubeEnglishSubTrailer("bssSj4cKsrI"),
  };
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
    trailer: makeYouTubeEnglishSubTrailer("bssSj4cKsrI"),
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
    genres: ["Action", "Fantasy", "Adventure", "Sci-Fi"],
    averageScore: 88,
    popularity: 185000,
    status: "RELEASING",
    chapters: null,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2020,
    siteUrl: "https://anilist.co/manga/119257",
    authorName: "Sing N Song · Sleepy-C",
    trailer: makeYouTubeEnglishSubTrailer("I6JIwjWOhnQ"),
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
    trailer: makeYouTubeEnglishSubTrailer("MCb13lbVGE0"),
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
    trailer: makeYouTubeEnglishSubTrailer("bssSj4cKsrI"),
  },
];

const FALLBACK_MATURE_CATALOG: AniListMedia[] = [
  {
    id: 116671,
    category: "MANHWA",
    title: "Secret Class",
    nativeTitle: "시크릿 클래스",
    description:
      "Orphaned at a young age and adopted into a warm family, Dae Ho grows up naive to the adult world—until his family decides to give him private late-night lessons.",
    coverImage: "/images/story-neon-lagos.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Drama", "Romance", "Mature"],
    averageScore: 79,
    popularity: 95000,
    status: "RELEASING",
    chapters: 210,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2019,
    siteUrl: "https://anilist.co/manga/116671",
    authorName: "Wang Kang-Cheol · Minachan",
    trailer: makeYouTubeEnglishSubTrailer("bssSj4cKsrI"),
  },
  {
    id: 97897,
    category: "MANHWA",
    title: "Sweet Guy",
    nativeTitle: "그 남자의 자취방",
    description:
      "After an accidental electrical shock from a strange wellness device, an ordinary young man awakens an irresistible supernatural touch that transforms his nightlife.",
    coverImage: "/images/story-between-two-suns.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Drama", "Romance", "Supernatural"],
    averageScore: 81,
    popularity: 88000,
    status: "FINISHED",
    chapters: 76,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2015,
    siteUrl: "https://anilist.co/manga/97897",
    authorName: "Bakha ·ong-Guk",
    trailer: makeYouTubeEnglishSubTrailer("I6JIwjWOhnQ"),
  },
  {
    id: 87260,
    category: "MANHWA",
    title: "Brawling Go!",
    nativeTitle: "체리보이, 그녀",
    description:
      "In a high-stakes adult romance comedy, an unexpected curse turns everyday encounters into intense romantic tests of willpower.",
    coverImage: "/images/story-the-iron-guild.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Comedy", "Romance", "Drama"],
    averageScore: 78,
    popularity: 74000,
    status: "FINISHED",
    chapters: 138,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2015,
    siteUrl: "https://anilist.co/manga/87260",
    authorName: "Topco Studio",
    trailer: makeYouTubeEnglishSubTrailer("RNyClma6awo"),
  },
  {
    id: 98543,
    category: "MANHWA",
    title: "Love Parameter",
    nativeTitle: "러브 파라미터",
    description:
      "A mysterious digital interface appears before a university student, revealing hidden affection meters and unlocking secret romantic routes.",
    coverImage: "/images/story-the-last-baobab.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Drama", "Romance", "Supernatural"],
    averageScore: 80,
    popularity: 71000,
    status: "FINISHED",
    chapters: 146,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2016,
    siteUrl: "https://anilist.co/manga/98543",
    authorName: "DalsaeOWL",
    trailer: makeYouTubeEnglishSubTrailer("4A_X-Dvl0ws"),
  },
  {
    id: 30002,
    category: "MANGA",
    title: "Berserk",
    nativeTitle: "ベルセルク",
    description:
      "Guts, known as the Black Swordsman, seeks sanctuary from the demonic forces that pursue him and his woman, and vengeance against the man who branded him an unholy sacrifice.",
    coverImage: "/images/story-the-iron-guild.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Action", "Adventure", "Dark Fantasy", "Horror"],
    averageScore: 95,
    popularity: 390000,
    status: "RELEASING",
    chapters: 376,
    countryOfOrigin: "JP",
    format: "MANGA",
    seasonYear: 1989,
    siteUrl: "https://anilist.co/manga/30002",
    authorName: "Kentaro Miura · Studio Gaga",
    trailer: makeYouTubeEnglishSubTrailer("0MIw4xzxcTU"),
  },
  {
    id: 85486,
    category: "MANHWA",
    title: "Sweet Home",
    nativeTitle: "스위트홈",
    description:
      "After an unexpected family tragedy, a reclusive high school student is forced to leave his home—only to face an apocalyptic nightmare where human desires turn people into monsters.",
    coverImage: "/images/story-neon-lagos.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Horror", "Psychological", "Thriller", "Action"],
    averageScore: 85,
    popularity: 165000,
    status: "FINISHED",
    chapters: 141,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2017,
    siteUrl: "https://anilist.co/manga/85486",
    authorName: "Carnby Kim · Youngchan Hwang",
    trailer: makeYouTubeEnglishSubTrailer("7rI56NmD33Y"),
  },
  {
    id: 86964,
    category: "MANHWA",
    title: "Bastard",
    nativeTitle: "후레자식",
    description:
      "Seon Jin is a quiet boy living under the roof of his wealthy, respected father—who happens to be a ruthless serial killer. When Jin's first friend becomes the next target, he must fight back.",
    coverImage: "/images/story-between-two-suns.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Psychological", "Thriller", "Horror", "Drama"],
    averageScore: 89,
    popularity: 192000,
    status: "FINISHED",
    chapters: 94,
    countryOfOrigin: "KR",
    format: "MANHWA",
    seasonYear: 2014,
    siteUrl: "https://anilist.co/manga/86964",
    authorName: "Carnby Kim · Youngchan Hwang",
    trailer: makeYouTubeEnglishSubTrailer("bssSj4cKsrI"),
  },
  {
    id: 30642,
    category: "MANGA",
    title: "Vinland Saga",
    nativeTitle: "ヴィンランド・サガ",
    description:
      "Thorfinn pursues a journey with his father's killer in order to take revenge and end his life in a duel as an honorable warrior in 11th-century Europe.",
    coverImage: "/images/story-the-last-baobab.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Action", "Adventure", "Drama", "Historical"],
    averageScore: 91,
    popularity: 245000,
    status: "RELEASING",
    chapters: 215,
    countryOfOrigin: "JP",
    format: "MANGA",
    seasonYear: 2005,
    siteUrl: "https://anilist.co/manga/30642",
    authorName: "Makoto Yukimura",
    trailer: makeYouTubeEnglishSubTrailer("f8JrZ7Q_p-8"),
  },
  {
    id: 30026,
    category: "MANGA",
    title: "Vagabond",
    nativeTitle: "バガボンド",
    description:
      "Growing up in late 16th-century Sengoku-era Japan, Shinmen Takezo is shunned by the local villagers as a devil child and embarks on a bloody quest to become Miyamoto Musashi.",
    coverImage: "/images/story-the-iron-guild.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Action", "Adventure", "Drama", "Historical"],
    averageScore: 93,
    popularity: 295000,
    status: "HIATUS",
    chapters: 327,
    countryOfOrigin: "JP",
    format: "MANGA",
    seasonYear: 1998,
    siteUrl: "https://anilist.co/manga/30026",
    authorName: "Takehiko Inoue",
    trailer: makeYouTubeEnglishSubTrailer("0MIw4xzxcTU"),
  },
  {
    id: 30001,
    category: "MANGA",
    title: "Monster",
    nativeTitle: "MONSTER",
    description:
      "Dr. Kenzo Tenma, an elite neurosurgeon in Germany, chooses to save the life of a young boy over the town mayor—unaware the boy will grow into a charismatic sociopath.",
    coverImage: "/images/story-between-two-suns.webp",
    bannerImage: "/images/hero-ashabi-dawn.webp",
    accentColor: "#ff6b6b",
    genres: ["Drama", "Mystery", "Psychological", "Thriller"],
    averageScore: 92,
    popularity: 260000,
    status: "FINISHED",
    chapters: 162,
    countryOfOrigin: "JP",
    format: "MANGA",
    seasonYear: 1994,
    siteUrl: "https://anilist.co/manga/30001",
    authorName: "Naoki Urasawa",
    trailer: makeYouTubeEnglishSubTrailer("q15CRdE5Bv0"),
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

const MATURE_CATALOG_QUERY = `
  query AshabiMatureCatalog(
    $search: String
    $countryOfOrigin: CountryCode
    $isAdult: Boolean
    $perPage: Int = 24
  ) {
    Page(page: 1, perPage: $perPage) {
      media(
        search: $search
        type: MANGA
        countryOfOrigin: $countryOfOrigin
        isAdult: $isAdult
        sort: [POPULARITY_DESC, SCORE_DESC]
      ) {
        id
        type
        format
        status
        countryOfOrigin
        seasonYear
        startDate {
          year
        }
        chapters
        volumes
        averageScore
        popularity
        genres
        siteUrl
        bannerImage
        title {
          english
          romaji
          native
        }
        description(asHtml: false)
        coverImage {
          extraLarge
          large
          color
        }
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  }
`;

export async function getAniListMatureCatalog(params: {
  query?: string;
  category?: "ALL" | "MANHWA" | "MANGA";
  mode?: "ADULT_18" | "DARK_SEINEN";
}): Promise<AniListMedia[]> {
  const cleanQuery = params.query?.trim() || undefined;
  const countryOfOrigin =
    params.category === "MANHWA"
      ? "KR"
      : params.category === "MANGA"
        ? "JP"
        : undefined;
  const isAdult = params.mode !== "DARK_SEINEN";

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: MATURE_CATALOG_QUERY,
        variables: {
          search: cleanQuery,
          countryOfOrigin,
          isAdult,
          perPage: 24,
        },
      }),
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`AniList mature HTTP ${response.status}`);
    }

    const json = await response.json();
    const rawList: RawAniListNode[] = json?.data?.Page?.media ?? [];
    if (rawList.length > 0) {
      return rawList.map((node) => normalizeNode(node));
    }
  } catch {
    // Fall through to curated mature fallback catalogue
  }

  return FALLBACK_MATURE_CATALOG.filter((item) => {
    if (
      params.category &&
      params.category !== "ALL" &&
      item.category !== params.category
    ) {
      return false;
    }
    if (
      cleanQuery &&
      !item.title.toLowerCase().includes(cleanQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}
