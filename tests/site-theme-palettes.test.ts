import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_PALETTE_ID,
  LANDING_PALETTES,
  isValidPaletteId,
  isValidThemeMode,
  resolvePaletteId,
  resolveThemeMode,
} from "@/lib/theme/landing-palettes";

describe("landing palettes / site theme", () => {
  it("exposes exactly 10 palettes with light and dark tokens", () => {
    assert.equal(LANDING_PALETTES.length, 10);
    for (const palette of LANDING_PALETTES) {
      assert.ok(palette.light.homeDeep);
      assert.ok(palette.dark.homeDeep);
      assert.ok(palette.light.primary);
      assert.ok(palette.dark.primary);
    }
  });

  it("resolves palette and theme mode with safe defaults", () => {
    assert.equal(resolvePaletteId("steel-blue"), "steel-blue");
    assert.equal(resolvePaletteId("nope"), DEFAULT_PALETTE_ID);
    assert.equal(resolveThemeMode("dark"), "dark");
    assert.equal(resolveThemeMode("weird"), "system");
    assert.equal(isValidPaletteId("caspian-teal"), true);
    assert.equal(isValidPaletteId("x"), false);
    assert.equal(isValidThemeMode("system"), true);
    assert.equal(isValidThemeMode("auto"), false);
  });
});
