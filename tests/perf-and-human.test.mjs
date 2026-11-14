import test from "node:test";
import assert from "node:assert/strict";
import { anilistCoverSize } from "../src/lib/anilist.ts";
import {
  isSafeRelativePath,
  isSearchEngineBot,
  signHumanCookie,
  verifyHumanCookie,
} from "../src/lib/human-check.ts";

test("anilistCoverSize rewrites large and extraLarge covers to medium", () => {
  const large =
    "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx151512-q0Xddr1JNKNq.png";
  const extra =
    "https://s4.anilist.co/file/anilistcdn/media/manga/cover/extraLarge/bx151512-q0Xddr1JNKNq.png";
  assert.equal(
    anilistCoverSize(large, "medium"),
    "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx151512-q0Xddr1JNKNq.png",
  );
  assert.equal(
    anilistCoverSize(extra, "medium"),
    "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/bx151512-q0Xddr1JNKNq.png",
  );
  assert.equal(anilistCoverSize("/images/story-neon-lagos.webp", "medium"), "/images/story-neon-lagos.webp");
  assert.equal(anilistCoverSize("", "medium"), "/images/story-neon-lagos.webp");
});

test("search engine bots are skipped and ordinary browsers are not", () => {
  assert.equal(isSearchEngineBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"), true);
  assert.equal(isSearchEngineBot("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"), false);
  assert.equal(isSearchEngineBot(null), false);
});

test("only relative in-site paths are accepted as a Turnstile redirect target", () => {
  assert.equal(isSafeRelativePath("/discover"), "/discover");
  assert.equal(isSafeRelativePath("/?explore=1"), "/?explore=1");
  assert.equal(isSafeRelativePath("https://evil.example"), null);
  assert.equal(isSafeRelativePath("//evil.example"), null);
  assert.equal(isSafeRelativePath("/\\evil"), null);
});

test("signed human cookies verify and expire correctly", async () => {
  const secret = "test-turnstile-secret";
  const token = await signHumanCookie(secret, 60);
  assert.equal(await verifyHumanCookie(token, secret), true);
  assert.equal(await verifyHumanCookie(token, "wrong-secret"), false);
  assert.equal(await verifyHumanCookie("v1.1.deadbeef", secret), false);
  const expired = await signHumanCookie(secret, -10);
  assert.equal(await verifyHumanCookie(expired, secret), false);
});
