import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTokensFromEditable,
  customPaletteDbId,
  isCustomPaletteId,
  normalizeHex,
  toCustomPaletteId,
  DEFAULT_EDITABLE_LIGHT,
} from "@/lib/theme/custom-palette";

describe("custom palette helpers", () => {
  it("normalizes and validates hex codes", () => {
    assert.equal(normalizeHex("#0c3f32"), "#0C3F32");
    assert.equal(normalizeHex("abc"), "#AABBCC");
    assert.equal(normalizeHex("zz"), null);
  });

  it("builds custom palette ids", () => {
    assert.equal(toCustomPaletteId("clxyz"), "custom:clxyz");
    assert.equal(isCustomPaletteId("custom:clxyz"), true);
    assert.equal(customPaletteDbId("custom:clxyz"), "clxyz");
    assert.equal(customPaletteDbId("emerald-trust"), null);
  });

  it("expands editable colors into runtime tokens", () => {
    const tokens = buildTokensFromEditable(DEFAULT_EDITABLE_LIGHT, "light");
    assert.equal(tokens.homeBg, "#F4F7F5");
    assert.equal(tokens.btnPrimaryBg, "#0C3F32");
    assert.ok(tokens.background.includes("%"));
    assert.ok(tokens.homeGlowRgb.includes(","));
  });
});
