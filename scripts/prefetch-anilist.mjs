/**
 * Pulls the public AniList catalogues used on the homepage, Discover, and
 * 18+ pages so the Cloudflare Worker can render real covers offline.
 *
 * AniList's WAF blocks Cloudflare Worker IPs ("You have been manually
 * blocked"), so runtime fetches from the deployed worker always fail.
 * This script runs at build time from a regular network and writes
 * src/data/anilist-snapshot.json.
 */
const ENDPOINT = "https://graphql.anilist.co";
const OUT = new URL("../src/data/anilist-snapshot.json", import.meta.url);

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
  coverImage { extraLarge large color }
  title { english romaji native }
  trailer { id site thumbnail }
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

const CATALOG_SEARCH_QUERY = `
  query AshabiAniListSearch($type: MediaType, $sort: [MediaSort], $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: $type, sort: $sort, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const MATURE_CATALOG_QUERY = `
  query AshabiMatureCatalog(
    $countryOfOrigin: CountryCode
    $isAdult: Boolean
    $perPage: Int = 24
  ) {
    Page(page: 1, perPage: $perPage) {
      media(
        type: MANGA
        countryOfOrigin: $countryOfOrigin
        isAdult: $isAdult
        sort: [POPULARITY_DESC, SCORE_DESC]
      ) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

async function requestAniList(query, variables) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        "ProjectAshabi/1.0 (https://github.com/emmydwest/Project-Ashabi)",
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`AniList HTTP ${response.status}: ${text.slice(0, 240)}`);
  }

  const json = JSON.parse(text);
  if (!json?.data) {
    throw new Error(`AniList returned no data: ${text.slice(0, 240)}`);
  }
  return json.data;
}

function mediaList(data) {
  return Array.isArray(data?.Page?.media) ? data.Page.media : [];
}

async function main() {
  const home = await requestAniList(HOME_FEED_QUERY);
  const discoverManga = await requestAniList(CATALOG_SEARCH_QUERY, {
    type: "MANGA",
    sort: ["TRENDING_DESC", "POPULARITY_DESC"],
    perPage: 24,
  });
  const discoverAnime = await requestAniList(CATALOG_SEARCH_QUERY, {
    type: "ANIME",
    sort: ["TRENDING_DESC", "POPULARITY_DESC"],
    perPage: 16,
  });
  const matureAdult = await requestAniList(MATURE_CATALOG_QUERY, {
    isAdult: true,
    perPage: 24,
  });
  const matureDarkSeinen = await requestAniList(MATURE_CATALOG_QUERY, {
    isAdult: false,
    perPage: 24,
  });

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    home: {
      manhwa: home.manhwa?.media ?? [],
      manga: home.manga?.media ?? [],
      anime: home.anime?.media ?? [],
      leaderboard: home.leaderboard?.media ?? [],
    },
    discover: [...mediaList(discoverManga), ...mediaList(discoverAnime)],
    matureAdult: mediaList(matureAdult),
    matureDarkSeinen: mediaList(matureDarkSeinen),
  };

  const counts = {
    manhwa: snapshot.home.manhwa.length,
    manga: snapshot.home.manga.length,
    anime: snapshot.home.anime.length,
    discover: snapshot.discover.length,
    matureAdult: snapshot.matureAdult.length,
    matureDarkSeinen: snapshot.matureDarkSeinen.length,
  };

  const coverSample =
    snapshot.home.manhwa[0]?.coverImage?.extraLarge ||
    snapshot.matureAdult[0]?.coverImage?.large;
  if (!coverSample || !String(coverSample).includes("anilist.co")) {
    throw new Error("Snapshot is missing AniList cover URLs");
  }

  const { writeFile, mkdir } = await import("node:fs/promises");
  const { dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const outPath = fileURLToPath(OUT);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${outPath}`);
  console.log(counts);
}

main().catch(async (error) => {
  console.error(error);
  try {
    const { access } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    await access(fileURLToPath(OUT));
    console.warn("Keeping the existing AniList snapshot and continuing.");
    process.exit(0);
  } catch {
    process.exit(1);
  }
});
