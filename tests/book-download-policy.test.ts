import test from "node:test";
import assert from "node:assert/strict";
import { canDownloadBookContent } from "../lib/services/library-download-policy";

test("public may download only published free book content", () => {
  assert.equal(canDownloadBookContent("PUBLISHED", 0, false), true);
  assert.equal(canDownloadBookContent("PUBLISHED", null, false), true);
  assert.equal(canDownloadBookContent("PUBLISHED", 150000, false), false);
  assert.equal(canDownloadBookContent("DRAFT", 0, false), false);
  assert.equal(canDownloadBookContent("ARCHIVED", 0, false), false);
});
test("admins can preview protected books", () => {
  assert.equal(canDownloadBookContent("DRAFT", 10000, true), true);
});
