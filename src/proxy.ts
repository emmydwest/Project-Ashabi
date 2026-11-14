import { NextResponse, type NextRequest } from "next/server";
import {
  HUMAN_COOKIE_NAME,
  isSafeRelativePath,
  isSearchEngineBot,
  verifyHumanCookie,
} from "@/lib/human-check";

const PUBLIC_PREFIXES = [
  "/welcome",
  "/api/human",
  "/robots.txt",
  "/favicon.ico",
  "/images",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }
  return /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml|map)$/i.test(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // The founder's welcome letter always owns a plain visit to "/".
  if (pathname === "/" && searchParams.get("explore") !== "1") {
    const welcomeUrl = request.nextUrl.clone();
    welcomeUrl.pathname = "/welcome";
    welcomeUrl.search = "";
    return NextResponse.redirect(welcomeUrl);
  }

  const isBot = isSearchEngineBot(request.headers.get("user-agent"));
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!isBot && secret && !isPublicPath(pathname)) {
    const cookie = request.cookies.get(HUMAN_COOKIE_NAME)?.value;
    const verified = cookie ? await verifyHumanCookie(cookie, secret) : false;
    if (!verified) {
      const welcomeUrl = request.nextUrl.clone();
      welcomeUrl.pathname = "/welcome";
      const intended =
        pathname === "/" && searchParams.get("explore") === "1"
          ? "/?explore=1"
          : `${pathname}${request.nextUrl.search}`;
      const safe = isSafeRelativePath(intended);
      welcomeUrl.search = safe ? `?next=${encodeURIComponent(safe)}` : "";
      return NextResponse.redirect(welcomeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
