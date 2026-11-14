import {
  searchAniListCatalog,
  searchAniListMatureCatalog,
  type AniListCategory,
  type AniListMedia,
} from "@/lib/anilist";

type SearchParams = {
  query?: string;
  category?: "ALL" | AniListCategory;
  genre?: string;
  sort?: "TRENDING" | "POPULARITY" | "SCORE";
  perPage?: number;
};

function snapshotSearchUrl(params: SearchParams) {
  const search = new URLSearchParams();
  if (params.query) search.set("q", params.query);
  if (params.category && params.category !== "ALL") {
    search.set("category", params.category);
  }
  if (params.genre && params.genre !== "All") search.set("genre", params.genre);
  if (params.sort) search.set("sort", params.sort);
  return `/api/anilist/search?${search.toString()}`;
}

export async function searchAniListFromBrowser(
  params: SearchParams,
  signal?: AbortSignal,
): Promise<AniListMedia[]> {
  try {
    const results = await searchAniListCatalog({ ...params, signal });
    if (results.length > 0 && !results[0].coverImage.startsWith("/images/")) {
      return results;
    }
    if (results.length > 0) return results;
  } catch {
    // The Worker cannot reach AniList, but the browser usually can.
  }

  const response = await fetch(snapshotSearchUrl(params), { signal });
  if (!response.ok) return [];
  const data = await response.json();
  return (data.results ?? []) as AniListMedia[];
}

export async function searchAniListMatureFromBrowser(
  params: {
    query?: string;
    category?: "ALL" | "MANHWA" | "MANGA";
    mode?: "ADULT_18" | "DARK_SEINEN";
  },
  signal?: AbortSignal,
): Promise<AniListMedia[]> {
  try {
    const results = await searchAniListMatureCatalog(params, signal);
    if (results.length > 0) return results;
  } catch {
    // Fall back to whatever the server rendered from the snapshot.
  }
  return [];
}
