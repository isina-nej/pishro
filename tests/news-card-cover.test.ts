import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

describe("news card cover — no crop, wider cards", () => {
  it("cover stretches to frame edges instead of cropping", () => {
    const src = read("components/news/newsCard.tsx");
    assert.match(src, /object-fill/, "must stretch, not crop");
    assert.ok(!src.includes("object-cover"), "no cover-crop allowed");
    assert.match(src, /aspect-\[21\/9\]/, "wide frame matches 1920x820 uploads");
  });

  it("grid is 2-col so cards are wider", () => {
    const src = read("components/news/newsPageContent.tsx");
    assert.match(src, /sm:grid-cols-2/, "2 columns from sm up");
    assert.ok(!src.includes("lg:grid-cols-3"), "no narrow 3-col grid");
  });
});
