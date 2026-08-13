import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterNavByHiddenPages,
  filterProfileNav,
  firstVisibleProfilePath,
  HIDABLE_ITEM_IDS,
  isPathHidden,
  isSectionHidden,
  parseHiddenPages,
  profilePathToVisibilityId,
} from "../lib/site/hidable-pages";

describe("hidable pages", () => {
  it("parses known page paths, sections, profile and chrome ids", () => {
    assert.deepEqual(
      parseHiddenPages([
        "/news",
        "home:album",
        "profile:orders",
        "chrome:chat",
        "/evil",
        "home:bad",
        12,
        null,
      ]),
      ["/news", "home:album", "profile:orders", "chrome:chat"]
    );
  });

  it("includes a broad catalog of controllable items", () => {
    assert.ok(HIDABLE_ITEM_IDS.has("profile:support"));
    assert.ok(HIDABLE_ITEM_IDS.has("about:team"));
    assert.ok(HIDABLE_ITEM_IDS.has("investment:selection"));
    assert.ok(HIDABLE_ITEM_IDS.has("chrome:footer"));
    assert.ok(HIDABLE_ITEM_IDS.size >= 40);
  });

  it("hides nested routes under a page", () => {
    assert.equal(isPathHidden("/news/foo", ["/news"]), true);
    assert.equal(isPathHidden("/checkout/result", ["/checkout"]), true);
    assert.equal(isPathHidden("/courses", ["/news"]), false);
  });

  it("ignores section keys when checking paths", () => {
    assert.equal(isPathHidden("/news", ["home:album"]), false);
    assert.equal(isPathHidden("/", ["home:mobile-view"]), false);
  });

  it("filters navbar items", () => {
    const items = [
      { label: "اخبار", link: "/news" },
      { label: "دوره", link: "/courses" },
      { label: "سبد", link: "/investment-plans" },
    ];
    assert.deepEqual(
      filterNavByHiddenPages(items, [
        "/news",
        "home:album",
        "/investment-plans",
      ]),
      [{ label: "دوره", link: "/courses" }]
    );
  });

  it("checks homepage section visibility", () => {
    assert.equal(
      isSectionHidden("home:mobile-view", ["home:mobile-view"]),
      true
    );
    assert.equal(isSectionHidden("home:album", ["home:mobile-view"]), false);
  });

  it("maps and filters profile nav", () => {
    assert.equal(profilePathToVisibilityId("/profile/support/abc"), "profile:support");
    assert.equal(profilePathToVisibilityId("/profile/acc"), "profile:acc");
    const nav = filterProfileNav(
      [
        { id: "profile:acc", link: "/profile/acc" },
        { id: "profile:orders", link: "/profile/orders" },
      ],
      ["profile:orders"]
    );
    assert.deepEqual(nav.map((i) => i.id), ["profile:acc"]);
    assert.equal(
      firstVisibleProfilePath(["profile:acc", "profile:courses"]),
      "/profile/orders"
    );
  });
});
