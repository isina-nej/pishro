import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_UPLOAD_ROOT,
  isPathInsideDir,
  resolveUploadRoot,
} from "@/lib/services/storage-adapter";

describe("resolveUploadRoot", () => {
  const projectRoot = "/opt/pishro";

  it("defaults to /opt/uploade outside the project", () => {
    assert.equal(resolveUploadRoot("", projectRoot), DEFAULT_UPLOAD_ROOT);
    assert.equal(resolveUploadRoot(null, projectRoot), DEFAULT_UPLOAD_ROOT);
  });

  it("accepts an absolute path outside the project", () => {
    assert.equal(
      resolveUploadRoot("/var/lib/pishro/uploads", projectRoot),
      "/var/lib/pishro/uploads"
    );
  });

  it("rejects relative paths that would land inside the repo", () => {
    assert.equal(resolveUploadRoot("uploads", projectRoot), DEFAULT_UPLOAD_ROOT);
    assert.equal(resolveUploadRoot("./.uploads", projectRoot), DEFAULT_UPLOAD_ROOT);
  });

  it("relocates paths that resolve inside the project root", () => {
    assert.equal(
      resolveUploadRoot("/opt/pishro/.uploads", projectRoot),
      DEFAULT_UPLOAD_ROOT
    );
    assert.equal(
      resolveUploadRoot("/opt/pishro/public/uploads", projectRoot),
      DEFAULT_UPLOAD_ROOT
    );
  });

  it("detects nested project paths", () => {
    assert.equal(isPathInsideDir("/opt/pishro/uploads", projectRoot), true);
    assert.equal(isPathInsideDir("/opt/uploade", projectRoot), false);
    assert.equal(isPathInsideDir("/opt/pishro", projectRoot), true);
  });
});
