import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_ENAMAD,
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_NAVBAR_ITEMS,
  parseFooterContent,
  parseNavbarItems,
  validateFooterContentInput,
  validateNavbarItemsInput,
} from "@/lib/site/chrome-content";

test("parseNavbarItems falls back to defaults for empty/invalid input", () => {
  assert.deepEqual(parseNavbarItems(null), DEFAULT_NAVBAR_ITEMS);
  assert.deepEqual(parseNavbarItems("nope"), DEFAULT_NAVBAR_ITEMS);
  assert.deepEqual(parseNavbarItems([]), DEFAULT_NAVBAR_ITEMS);
});

test("parseNavbarItems keeps valid admin edits", () => {
  const parsed = parseNavbarItems([
    { label: "خانه", link: "/" },
    { label: "آموزش", link: "/courses" },
  ]);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].label, "خانه");
  assert.equal(parsed[1].link, "/courses");
});

test("validateNavbarItemsInput rejects bad rows", () => {
  assert.equal(validateNavbarItemsInput([]), null);
  assert.equal(validateNavbarItemsInput([{ label: "x", link: "javascript:alert(1)" }]), null);
  assert.ok(validateNavbarItemsInput([{ label: "خانه", link: "/" }]));
});

test("parseFooterContent merges partial payloads with defaults", () => {
  const parsed = parseFooterContent({
    aboutText: "متن سفارشی فوتر",
    phone: "۰۲۱۱۲۳",
    columns: [
      {
        id: "discover",
        title: "کاوش سفارشی",
        links: [{ label: "خانه", link: "/" }],
      },
    ],
  });
  assert.equal(parsed.aboutText, "متن سفارشی فوتر");
  assert.equal(parsed.phone, "۰۲۱۱۲۳");
  assert.equal(parsed.columns.length, 1);
  assert.equal(parsed.columns[0].title, "کاوش سفارشی");
  assert.equal(parsed.email, DEFAULT_FOOTER_CONTENT.email);
});

test("parseFooterContent keeps legacy object columns shape", () => {
  const parsed = parseFooterContent({
    columns: {
      discover: {
        title: "کاوش سفارشی",
        links: [{ label: "خانه", link: "/" }],
      },
    },
  });
  assert.equal(parsed.columns.length, 4);
  assert.equal(parsed.columns[0].title, "کاوش سفارشی");
  assert.equal(parsed.columns[1].title, DEFAULT_FOOTER_CONTENT.columns[1].title);
});

test("parseFooterContent supports add/remove footer columns", () => {
  const parsed = parseFooterContent({
    columns: [
      { id: "a", title: "ستون یک", links: [{ label: "خانه", link: "/" }] },
      {
        id: "b",
        title: "ستون دو",
        links: [{ label: "دوره‌ها", link: "/courses" }],
      },
    ],
  });
  assert.equal(parsed.columns.length, 2);
  assert.equal(parsed.columns[1].title, "ستون دو");

  const emptied = parseFooterContent({ columns: [] });
  assert.deepEqual(emptied.columns, []);
});

test("parseFooterContent parses enamad settings", () => {
  const parsed = parseFooterContent({
    enamad: {
      enabled: false,
      linkUrl: "https://trustseal.enamad.ir/?id=1",
      imageUrl: "/images/custom.png",
    },
  });
  assert.equal(parsed.enamad.enabled, false);
  assert.equal(parsed.enamad.linkUrl, "https://trustseal.enamad.ir/?id=1");
  assert.equal(parsed.enamad.imageUrl, "/images/custom.png");

  const fallback = parseFooterContent({});
  assert.deepEqual(fallback.enamad, DEFAULT_ENAMAD);
});

test("validateFooterContentInput accepts object payloads", () => {
  assert.equal(validateFooterContentInput(null), null);
  assert.ok(validateFooterContentInput({ aboutText: "ok" }));
});
