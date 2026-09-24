import test from "node:test";
import assert from "node:assert/strict";
import { filterStories, stories } from "../src/lib/stories.ts";
test("search combines a normalized query with the selected genre", () => {
  assert.deepEqual(
    filterStories("  NEON  ", "Sci-Fi").map((s) => s.slug),
    ["neon-lagos"],
  );
  assert.equal(filterStories("Neon", "Romance").length, 0);
});
test("an unmatched query produces an empty result", () => {
  assert.equal(filterStories("not-a-story", "All").length, 0);
});
test("all concept stories retain explicit non-production rights status", () => {
  assert.equal(new Set(stories.map((s) => s.slug)).size, stories.length);
  for (const s of stories) {
    assert.equal(s.rights.status, "demo-only");
    assert.ok(s.rights.permissionBasis.length > 0);
  }
});
