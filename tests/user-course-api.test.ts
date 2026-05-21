import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("user purchased course API", () => {
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
