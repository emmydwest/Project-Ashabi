import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // If user arrives at "/" without having visited the standalone "/welcome" page first,
  // route them to "/welcome" (a true standalone page, not a popup).
  if (pathname === "/") {
    const welcomedCookie = request.cookies.get("ashabi_welcomed")?.value === "1";
    const exploringNow = searchParams.get("explore") === "1";

    if (!welcomedCookie && !exploringNow) {
      const welcomeUrl = request.nextUrl.clone();
      welcomeUrl.pathname = "/welcome";
      return NextResponse.redirect(welcomeUrl);
    }
  }

  let response = NextResponse.next({ request });

  if (pathname === "/" && searchParams.get("explore") === "1") {
    response.cookies.set("ashabi_welcomed", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser().catch(() => null);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
