import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");

describe("courses public page — server infinite scroll", () => {
  it("api paginates with total, not full dump", () => {
    const src = read("app/api/courses/route.ts");
    assert.match(src, /paginatedResponse/, "must return paginated envelope");
    assert.match(src, /COUNT\(\*\) AS total/, "must count total server-side");
    assert.match(src, /LIMIT \$\{limit\} OFFSET \$\{skip\}/, "must slice page");
  });

  it("page scrolls via sentinel + server params", () => {
    const src = read("components/courses/coursesPageContent.tsx");
    assert.match(src, /useCoursesInfinite/, "must use infinite hook");
    assert.match(src, /IntersectionObserver/, "must observe scroll sentinel");
    assert.match(src, /getCoursesTotal/, "must read server total");
    assert.ok(!src.includes("useCoursesFilters("), "must not client-filter anymore");
  });

  it("courses hook paginates with shared page size", () => {
    const hook = read("lib/hooks/useCourses.ts");
    assert.match(hook, /useInfiniteQuery/, "must use useInfiniteQuery");
    assert.match(hook, /COURSES_PAGE_SIZE/, "must use shared page size");
    assert.match(hook, /getNextPageParam/, "must expose next-page cursor");
  });
});

describe("crypto market — total count + scroll paging", () => {
  it("pagination exposes total for the count line", () => {
    const svc = read("lib/services/crypto-market-service.ts");
    assert.match(svc, /total: capped/, "must include capped total");
    const types = read("types/crypto-market.ts");
    assert.match(types, /total: number/, "type must carry total");
  });

  it("crypto page pages by scroll with larger batches", () => {
    const src = read("components/crypto/CryptoPricesPage.tsx");
    assert.match(src, /IntersectionObserver/, "must observe scroll sentinel");
    assert.match(src, /PAGE_SIZE = 24/, "bigger batches, fewer round-trips");
    assert.match(src, /از .*ارز بارگذاری شده/, "count line shows loaded vs total");
  });
});
