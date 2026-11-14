export const HUMAN_COOKIE_NAME = "ashabi_human";
export const HUMAN_OK_COOKIE_NAME = "ashabi_human_ok";
export const HUMAN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const BOT_UA =
  /googlebot|google-inspectiontool|bingbot|duckduckbot|slurp|yandex(bot|images)|baiduspider|facebookexternalhit|facebot|twitterbot|linkedinbot|applebot|pingdom|uptimerobot|ahrefsbot|semrushbot|dotbot|petalbot|bytespider|ia_archiver|discordbot|whatsapp|telegrambot|slackbot|previewbot|crawler|spider/i;

export function isSearchEngineBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_UA.test(userAgent);
}

export function isSafeRelativePath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }
  if (value.includes("://")) return null;
  return value;
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmacHex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

export async function signHumanCookie(
  secret: string,
  maxAgeSeconds = HUMAN_COOKIE_MAX_AGE,
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `v1.${exp}`;
  const mac = await hmacHex(secret, payload);
  return `${payload}.${mac}`;
}

export async function verifyHumanCookie(
  value: string | null | undefined,
  secret: string,
): Promise<boolean> {
  if (!value || !secret) return false;
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const [version, expRaw, mac] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = await hmacHex(secret, `${version}.${expRaw}`);
  return timingSafeEqual(mac.toLowerCase(), expected.toLowerCase());
}

export function humanCookieHeaders(signedValue: string): string[] {
  const common = `Path=/; Max-Age=${HUMAN_COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
  return [
    `${HUMAN_COOKIE_NAME}=${signedValue}; ${common}; HttpOnly`,
    `${HUMAN_OK_COOKIE_NAME}=1; ${common}`,
  ];
}
