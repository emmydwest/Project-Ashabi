import snapshot from "@/data/anilist-snapshot.json";
import {
  buildHomeFeed,
  extractCreators,
  normalizeAniListNode,
  type AniListCategory,
  type AniListHomeFeed,
  type AniListMedia,
  type RawAniListNode,
} from "@/lib/anilist";

function mapList(raw: unknown, forcedCategory?: AniListCategory): AniListMedia[] {
  if (!Array.isArray(raw)) return [];
  return (raw as RawAniListNode[]).map((node) =>
    normalizeAniListNode(node, forcedCategory),
  );
}

function uniqueMedia(items: AniListMedia[]): AniListMedia[] {
  const seen = new Set<number>();
  const unique: AniListMedia[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

export function getSnapshotHomeFeed(): AniListHomeFeed | null {
  const manhwa = mapList(snapshot.home.manhwa, "MANHWA");
  const manga = mapList(snapshot.home.manga, "MANGA");
  const anime = mapList(snapshot.home.anime, "ANIME");
  const leaderboard = mapList(snapshot.home.leaderboard);
  if (manhwa.length === 0 && manga.length === 0 && anime.length === 0) {
    return null;
  }

  const topCreators = extractCreators([
    ...(snapshot.home.manhwa as RawAniListNode[]).slice(0, 4),
    ...(snapshot.home.manga as RawAniListNode[]).slice(0, 4),
    ...(snapshot.home.anime as RawAniListNode[]).slice(0, 2),
  ]);

  return buildHomeFeed(
    manhwa,
    manga,
    anime,
    leaderboard,
    topCreators,
    "live",
  );
}

export function allSnapshotMedia(): AniListMedia[] {
  return uniqueMedia([
    ...mapList(snapshot.discover),
    ...mapList(snapshot.home.manhwa, "MANHWA"),
    ...mapList(snapshot.home.manga, "MANGA"),
    ...mapList(snapshot.home.anime, "ANIME"),
    ...mapList(snapshot.home.leaderboard),
    ...mapList(snapshot.matureAdult),
    ...mapList(snapshot.matureDarkSeinen),
  ]);
}

export function searchSnapshotCatalog(params: {
  query?: string;
  category?: "ALL" | AniListCategory;
  genre?: string;
}): AniListMedia[] {
  const query = params.query?.trim().toLowerCase();
  const genre = params.genre && params.genre !== "All" ? params.genre : undefined;
  const category = params.category ?? "ALL";

  return allSnapshotMedia().filter((item) => {
    if (category !== "ALL" && item.category !== category) return false;
    if (genre && !item.genres.includes(genre)) return false;
    if (query && !item.title.toLowerCase().includes(query)) return false;
    return true;
  });
}

export function getSnapshotMatureCatalog(params: {
  query?: string;
  category?: "ALL" | "MANHWA" | "MANGA";
  mode?: "ADULT_18" | "DARK_SEINEN";
}): AniListMedia[] {
  const raw =
    params.mode === "DARK_SEINEN"
      ? snapshot.matureDarkSeinen
      : snapshot.matureAdult;
  const query = params.query?.trim().toLowerCase();

  return mapList(raw).filter((item) => {
    if (
      params.category &&
      params.category !== "ALL" &&
      item.category !== params.category
    ) {
      return false;
    }
    if (query && !item.title.toLowerCase().includes(query)) return false;
    return true;
  });
}

export function getSnapshotMediaById(id: number): AniListMedia | null {
  return allSnapshotMedia().find((item) => item.id === id) ?? null;
}
