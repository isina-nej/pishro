import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterNavByHiddenPages,
  isPathHidden,
  parseHiddenPages,
} from "../lib/site/hidable-pages";

describe("hidable pages", () => {
  it("parses only known paths", () => {
    assert.deepEqual(parseHiddenPages(["/news", "/evil", 12, null]), ["/news"]);
  });

  it("hides nested routes under a page", () => {
    assert.equal(isPathHidden("/news/foo", ["/news"]), true);
    assert.equal(isPathHidden("/news", ["/news"]), true);
    assert.equal(isPathHidden("/courses", ["/news"]), false);
  });

  it("only treats exact home as hidden when / is hidden", () => {
    assert.equal(isPathHidden("/", ["/"]), true);
    assert.equal(isPathHidden("/about-us", ["/"]), false);
  });

  it("filters navbar items", () => {
    const items = [
      { label: "اخبار", link: "/news" },
      { label: "دوره", link: "/courses" },
    ];
    assert.deepEqual(filterNavByHiddenPages(items, ["/news"]), [
      { label: "دوره", link: "/courses" },
    ]);
  });
});
