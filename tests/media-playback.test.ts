import test from "node:test";
import assert from "node:assert/strict";
import { shouldPlayAmbientVideo } from "../lib/utils/media-playback";

test("ambient video pauses offscreen and when the document is hidden", () => {
  const base = { inView: true, reducedMotion: false, saveData: false, hidden: false };
  assert.equal(shouldPlayAmbientVideo(base), true);
  assert.equal(shouldPlayAmbientVideo({ ...base, inView: false }), false);
  assert.equal(shouldPlayAmbientVideo({ ...base, hidden: true }), false);
});

test("ambient video does not automatically play with reduced motion or data saver", () => {
  const base = { inView: true, reducedMotion: false, saveData: false, hidden: false };
  assert.equal(shouldPlayAmbientVideo({ ...base, reducedMotion: true }), false);
  assert.equal(shouldPlayAmbientVideo({ ...base, saveData: true }), false);
});
