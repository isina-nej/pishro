import assert from "node:assert/strict";
import test from "node:test";
import { MobileScrollerStepUpsertSchema } from "@/lib/schemas/landing-cms-schema";

const base = {
  stepNumber: 1,
  title: "قدم",
  description: "توضیح",
};

test("accepts IMAGE step with imageUrl", () => {
  const parsed = MobileScrollerStepUpsertSchema.safeParse({
    ...base,
    contentType: "IMAGE",
    imageUrl: "/images/home/mobile-scroll/in-mobile-1.svg",
  });
  assert.equal(parsed.success, true);
});

test("rejects IMAGE step without imageUrl", () => {
  const parsed = MobileScrollerStepUpsertSchema.safeParse({
    ...base,
    contentType: "IMAGE",
  });
  assert.equal(parsed.success, false);
});

test("accepts PAGE step with internal path", () => {
  const parsed = MobileScrollerStepUpsertSchema.safeParse({
    ...base,
    contentType: "PAGE",
    pageUrl: "/courses",
  });
  assert.equal(parsed.success, true);
});

test("rejects PAGE step without pageUrl", () => {
  const parsed = MobileScrollerStepUpsertSchema.safeParse({
    ...base,
    contentType: "PAGE",
  });
  assert.equal(parsed.success, false);
});

test("rejects PAGE step with invalid pageUrl", () => {
  const parsed = MobileScrollerStepUpsertSchema.safeParse({
    ...base,
    contentType: "PAGE",
    pageUrl: "not-a-path",
  });
  assert.equal(parsed.success, false);
});
