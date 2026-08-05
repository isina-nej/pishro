import assert from "node:assert/strict";
import test from "node:test";
import {
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
    columns: {
      discover: {
        title: "کاوش سفارشی",
        links: [{ label: "خانه", link: "/" }],
      },
    },
  });
  assert.equal(parsed.aboutText, "متن سفارشی فوتر");
  assert.equal(parsed.phone, "۰۲۱۱۲۳");
  assert.equal(parsed.columns.discover.title, "کاوش سفارشی");
  assert.equal(parsed.columns.learn.title, DEFAULT_FOOTER_CONTENT.columns.learn.title);
  assert.equal(parsed.email, DEFAULT_FOOTER_CONTENT.email);
});

test("validateFooterContentInput accepts object payloads", () => {
  assert.equal(validateFooterContentInput(null), null);
  assert.ok(validateFooterContentInput({ aboutText: "ok" }));
});
