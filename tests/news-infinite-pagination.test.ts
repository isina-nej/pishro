import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

describe("news public page — total count + scroll infinite", () => {
  it("total shown from server pagination, not items.length", () => {
    const src = read("components/news/newsPageContent.tsx");
    assert.match(src, /getNewsTotal/, "must read server total");
    assert.match(src, /serverStats\?\.totalNews/, "hero total falls back to /stats endpoint");
    assert.ok(!src.includes("useNewsList({"), "must not use single-page list anymore");
  });

  it("loads next page on scroll via sentinel observer", () => {
    const src = read("components/news/newsPageContent.tsx");
    assert.match(src, /useNewsInfinite/, "must use infinite query");
    assert.match(src, /IntersectionObserver/, "must observe scroll sentinel");
    assert.match(src, /sentinelRef/, "must render sentinel element");
    assert.match(src, /fetchNextPage/, "must advance pages");
    assert.match(src, /flattenNewsPages/, "must flatten pages into one list");
    assert.ok(
      !src.includes("auto-load rest so client filter"),
      "must not chain-load all pages on mount"
    );
  });

  it("infinite hook sends page + NEWS_PAGE_SIZE params", () => {
    const hook = read("lib/hooks/useNews.ts");
    assert.match(hook, /useInfiniteQuery/, "must use useInfiniteQuery");
    assert.match(hook, /getNextPageParam/, "must expose next-page cursor");
    assert.match(hook, /NEWS_PAGE_SIZE/, "must use shared page size");
  });

  it("filter state lives in page, server params carry category/search/sort/timeRange", () => {
    const src = read("components/news/newsPageContent.tsx");
    assert.ok(!src.includes("useNewsFilters"), "must not client-filter anymore");
    assert.match(src, /debouncedQuery/, "search must be debounced");
    assert.match(src, /category: selectedCategory/, "category goes to server");
    assert.match(src, /timeRange: timeRange/, "timeRange goes to server");
  });
});
