import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const USER_AGENT =
  "ProjectAshabi/1.0 (https://github.com/emmydwest/Project-Ashabi)";

export async function GET(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  // Allow full 200+ page webtoon chapters to stream smoothly while preventing abuse
  const { allowed, retryAfterMs } = checkRateLimit(
    `img-proxy:${clientIp}`,
    400,
    80,
  );
  if (!allowed) {
    return new NextResponse("Rate limit exceeded. Please slow down.", {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
      },
    });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.redirect(
      new URL("/images/story-neon-lagos.webp", request.url),
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.redirect(
      new URL("/images/story-neon-lagos.webp", request.url),
    );
  }

  const host = parsed.hostname.toLowerCase();
  const isAllowed =
    host.endsWith("mangadex.org") ||
    host.endsWith("mangadex.network") ||
    host.endsWith("gutenberg.org") ||
    host.endsWith("anilist.co");

  if (!isAllowed) {
    return new NextResponse("Forbidden host", { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok || !upstream.body) {
      // Fallback: redirect browser directly to upstream asset with no-referrer
      return NextResponse.redirect(parsed.toString(), 307);
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    });
  } catch {
    return NextResponse.redirect(parsed.toString(), 307);
  }
}
