import { NextResponse, type NextRequest } from "next/server";
import { humanCookieHeaders, signHumanCookie } from "@/lib/human-check";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function POST(request: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Verification is temporarily unavailable." },
      { status: 503 },
    );
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token?.trim() ?? "";
  } catch {
    token = "";
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Please complete the check and try again." },
      { status: 400 },
    );
  }

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  const ip = request.headers.get("cf-connecting-ip");
  if (ip) form.set("remoteip", ip);

  let verified: TurnstileVerifyResponse;
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(8000),
      },
    );
    verified = (await response.json()) as TurnstileVerifyResponse;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not reach the verification service." },
      { status: 502 },
    );
  }

  if (!verified.success) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const signed = await signHumanCookie(secret);
  const response = NextResponse.json({ ok: true });
  for (const cookie of humanCookieHeaders(signed)) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}
