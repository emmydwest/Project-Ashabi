import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const USER_AGENT =
  "ProjectAshabi/1.0 (https://github.com/emmydwest/Project-Ashabi)";

export async function GET(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const { allowed, retryAfterMs } = checkRateLimit(
    `img-proxy:${clientIp}`,
    60,
    15,
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
    return new NextResponse("Missing image url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid image url", { status: 400 });
  }

  const host = parsed.hostname.toLowerCase();
  const isAllowed =
    host.endsWith("mangadex.org") ||
    host.endsWith("mangadex.network") ||
    host.endsWith("gutenberg.org");

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
      return new NextResponse(`Upstream error ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Failed to proxy image", { status: 502 });
  }
}
