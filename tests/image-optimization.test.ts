import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { optimizePublicImage } from "../lib/services/image-optimization";

test("large upload becomes bounded and not larger than source", async () => {
  const source = await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2200" height="1400"><rect width="2200" height="1400" fill="#005544"/><circle cx="900" cy="600" r="350" fill="#d9a153"/></svg>'))
    .jpeg({ quality: 95 }).toBuffer();
  const image = await optimizePublicImage(source, { maxWidth: 800, maxHeight: 800 });
  assert.ok(image.buffer.length <= source.length);
  assert.ok(image.width <= 800 && image.height <= 800);
  const meta = await sharp(image.buffer).metadata();
  assert.equal(meta.width, image.width);
  assert.equal(meta.height, image.height);
});
test("small image is never enlarged", async () => {
  const src = await sharp({ create: { width: 60, height: 40, channels: 4, background: "#005544" } }).png().toBuffer();
  const image = await optimizePublicImage(src);
  assert.ok(image.buffer.length <= src.length);
  assert.equal(image.width, 60);
  assert.equal(image.height, 40);
});
test("invalid raster is rejected", async () => {
  await assert.rejects(optimizePublicImage(Buffer.from("not an image")), /Invalid/);
});
