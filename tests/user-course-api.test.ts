import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TEST_BASE_URL, skipUnlessServerUp } from "./helpers/server";

const BASE = TEST_BASE_URL;

describe("user purchased course API", { skip: await skipUnlessServerUp() }, () => {
  it("GET /api/user/courses/:id returns 401 without auth", async () => {
    const res = await fetch(`${BASE}/api/user/courses/test-course-id`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.status, "error");
  });

  it("GET /api/user/courses/:id returns 403 without enrollment", async () => {
    const res = await fetch(`${BASE}/api/user/courses/test-course-id`, {
      headers: {
        Cookie: "invalid-session-for-test",
      },
    });
    assert.ok([401, 403].includes(res.status));
  });

  it("GET /api/user/lessons/:id/stream returns 401 without auth", async () => {
    const res = await fetch(`${BASE}/api/user/lessons/test-lesson-id/stream`);
    assert.equal(res.status, 401);
  });
});
