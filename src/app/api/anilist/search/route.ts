import { NextRequest, NextResponse } from "next/server";
import {
  searchAniListCatalog,
  type AniListCategory,
} from "@/lib/anilist";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const rawCategory = (searchParams.get("category") ?? "ALL").toUpperCase();
  const category = (
    ["ALL", "MANHWA", "MANGA", "ANIME"].includes(rawCategory)
      ? rawCategory
      : "ALL"
  ) as "ALL" | AniListCategory;
  const genre = searchParams.get("genre") ?? undefined;
  const rawSort = (searchParams.get("sort") ?? "TRENDING").toUpperCase();
  const sort = (
    ["TRENDING", "POPULARITY", "SCORE"].includes(rawSort)
      ? rawSort
      : "TRENDING"
  ) as "TRENDING" | "POPULARITY" | "SCORE";

  const results = await searchAniListCatalog({
    query: q,
    category,
    genre,
    sort,
    perPage: 20,
  });

  return NextResponse.json({ results });
}
