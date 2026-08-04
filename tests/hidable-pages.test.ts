import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterNavByHiddenPages,
  isPathHidden,
  isSectionHidden,
  parseHiddenPages,
} from "../lib/site/hidable-pages";

describe("hidable pages", () => {
  it("parses known page paths and home sections", () => {
    assert.deepEqual(
      parseHiddenPages(["/news", "home:album", "/evil", "home:bad", 12, null]),
      ["/news", "home:album"]
    );
  });

  it("hides nested routes under a page", () => {
    assert.equal(isPathHidden("/news/foo", ["/news"]), true);
    assert.equal(isPathHidden("/news", ["/news"]), true);
    assert.equal(isPathHidden("/courses", ["/news"]), false);
  });

  it("ignores section keys when checking paths", () => {
    assert.equal(isPathHidden("/news", ["home:album"]), false);
    assert.equal(isPathHidden("/", ["home:mobile-view"]), false);
  });

  it("only treats exact home as hidden when / is hidden", () => {
    assert.equal(isPathHidden("/", ["/"]), true);
    assert.equal(isPathHidden("/about-us", ["/"]), false);
  });

  it("filters navbar items", () => {
    const items = [
      { label: "اخبار", link: "/news" },
      { label: "دوره", link: "/courses" },
      { label: "سبد", link: "/investment-plans" },
    ];
    assert.deepEqual(
      filterNavByHiddenPages(items, ["/news", "home:album", "/investment-plans"]),
      [{ label: "دوره", link: "/courses" }]
    );
  });

  it("checks homepage section visibility", () => {
    assert.equal(isSectionHidden("home:mobile-view", ["home:mobile-view"]), true);
    assert.equal(isSectionHidden("home:album", ["home:mobile-view"]), false);
    assert.equal(isSectionHidden("home:calculator", ["/investment-plans"]), false);
  });
});
