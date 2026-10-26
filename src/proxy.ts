import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ALWAYS show the standalone "/welcome" Founder's Message whenever a visitor loads or reloads "/"
  // without explicitly clicking through "?explore=1" from the Founder's page.
  if (pathname === "/") {
    const exploringNow = searchParams.get("explore") === "1";

    if (!exploringNow) {
      const welcomeUrl = request.nextUrl.clone();
      welcomeUrl.pathname = "/welcome";
      const redirectRes = NextResponse.redirect(welcomeUrl);
      redirectRes.cookies.delete("ashabi_welcomed");
      return redirectRes;
    }
  }

  let response = NextResponse.next({ request });
  response.cookies.delete("ashabi_welcomed");

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
