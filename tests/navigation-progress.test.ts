import test from "node:test";
import assert from "node:assert/strict";
import { isInternalPageNavigation } from "../lib/navigation/progress";

test("only real same-origin page changes trigger the global loader", () => {
  const current = "https://pishrosarmaye.com/courses";
  assert.equal(isInternalPageNavigation(current, "/news"), true);
  assert.equal(isInternalPageNavigation(current, "https://pishrosarmaye.com/news"), true);
  assert.equal(isInternalPageNavigation(current, "/courses#popular"), false);
  assert.equal(isInternalPageNavigation(current, "/courses?sort=new"), false);
  assert.equal(isInternalPageNavigation(current, "https://external.example/news"), false);
  assert.equal(isInternalPageNavigation(current, "mailto:hello@example.com"), false);
  assert.equal(isInternalPageNavigation(current, "http://[bad"), false);
});
