import test from "node:test";
import assert from "node:assert/strict";
import {
  creators,
  filterStories,
  getChapterBySlug,
  getCreatorByUsername,
  getPublicStories,
  getStoryBySlug,
  stories,
} from "../src/lib/stories.ts";

test("search combines a normalized query with the selected genre", () => {
  assert.deepEqual(
    filterStories("  NEON  ", "Sci-Fi").map((s) => s.slug),
    ["neon-lagos"],
  );
  assert.equal(filterStories("Neon", "Romance").length, 0);
});

test("filterStories supports format, release status, and sort options", () => {
  const comics = filterStories("", "All", { format: "Comic" });
  assert.deepEqual(
    comics.map((s) => s.slug),
    ["neon-lagos"],
  );

  const byTitle = filterStories("", "All", { sort: "title" });
  assert.equal(byTitle[0].slug, "ashes-and-petals");
});

test("an unmatched query produces an empty result", () => {
  assert.equal(filterStories("not-a-story", "All").length, 0);
});

test("all concept stories retain explicit non-production rights status and chapters", () => {
  assert.equal(new Set(stories.map((s) => s.slug)).size, stories.length);
  for (const s of getPublicStories()) {
    assert.equal(s.rights.status, "demo-only");
    assert.equal(s.rights.verifiedForWeb, true);
    assert.ok(s.rights.permissionBasis.length > 0);
    assert.ok(s.chapters.length >= 1, `${s.slug} should have at least 1 chapter`);
  }
});

test("chapter lookup resolves prev and next episodes accurately", () => {
  const first = getChapterBySlug("the-last-baobab", "chapter-1-roots-of-amber");
  assert.ok(first);
  assert.equal(first.prev, undefined);
  assert.equal(first.next?.slug, "chapter-2-the-indigo-key");

  const second = getChapterBySlug("the-last-baobab", "chapter-2-the-indigo-key");
  assert.ok(second);
  assert.equal(second.prev?.slug, "chapter-1-roots-of-amber");
  assert.equal(second.next, undefined);
});

test("creator profiles resolve and link to their published stories", () => {
  assert.ok(creators.length >= 3);
  const creator = getCreatorByUsername("zuri-adesina");
  assert.ok(creator);
  const story = getStoryBySlug("the-last-baobab");
  assert.equal(story?.creatorUsername, creator.username);
});
