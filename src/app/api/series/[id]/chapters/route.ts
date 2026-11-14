import { NextResponse, type NextRequest } from "next/server";
import { getAniListMediaById } from "@/lib/anilist";
import { getMangaDexChaptersForTitle } from "@/lib/mangadex";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "Invalid series id" }, { status: 400 });
  }

  const media = await getAniListMediaById(numericId);
  const title =
    request.nextUrl.searchParams.get("title")?.trim() || media?.title;
  const nativeTitle =
    request.nextUrl.searchParams.get("native")?.trim() ||
    media?.nativeTitle ||
    null;
  const expected = media?.chapters ?? null;

  if (!title) {
    return NextResponse.json({ error: "Unknown series" }, { status: 404 });
  }

  try {
    const result = await getMangaDexChaptersForTitle(
      title,
      nativeTitle,
      expected,
    );
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      {
        mangaDexId: null,
        chapters: [],
        availableLanguages: [],
        defaultLanguage: "en",
      },
      { status: 200 },
    );
  }
}
