import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const exists = (p: string) => existsSync(join(root, p));

describe("course upload chain — routes exist", () => {
  const routes = [
    "app/api/admin/uploads/temp/route.ts",
    "app/api/admin/courses/route.ts",
    "app/api/admin/courses/[id]/route.ts",
    "app/api/admin/courses/[id]/lessons/route.ts",
    "app/api/admin/courses/[id]/lessons/reorder/route.ts",
    "app/api/admin/courses/[id]/chapters/route.ts",
    "app/api/admin/courses/[id]/chapters/reorder/route.ts",
    "app/api/admin/lessons/route.ts",
    "app/api/admin/lessons/[id]/route.ts",
    "app/api/uploads/[...path]/route.ts",
  ];
  for (const r of routes) {
    it(`${r} exists`, () => {
      assert.ok(exists(r), `missing ${r}`);
    });
  }
});

describe("course upload chain — temp upload validation", () => {
  it("temp route validates thumbnail + video mime/size", () => {
    const src = read("app/api/admin/uploads/temp/route.ts");
    assert.match(src, /validateThumbnailFile/, "must validate thumbnails");
    assert.match(src, /validateVideoFile/, "must validate videos");
    assert.match(src, /getAdminAuthFromHeaders/, "must require admin auth");
    assert.match(src, /MAX_MULTIPART_BODY_BYTES/, "must cap body size");
  });

  it("schema caps match UI caps", () => {
    const schema = read("lib/schemas/course-management-schema.ts");
    assert.match(schema, /THUMBNAIL_MAX_BYTES = 5 \* 1024 \* 1024/, "thumb 5MB");
    assert.match(schema, /VIDEO_MAX_BYTES = 500 \* 1024 \* 1024/, "video 500MB");
    assert.match(schema, /ALLOWED_VIDEO_TYPE = "video\/mp4"/, "mp4 only");
    const modal = read("components/admin/course-edit/LessonModal.tsx");
    assert.match(modal, /THUMBNAIL_MAX_BYTES/, "modal enforces thumb cap");
    assert.match(modal, /VIDEO_MAX_BYTES/, "modal enforces video cap");
    assert.match(modal, /videoTempPath/, "new lesson requires uploaded video");
  });
});

describe("course upload chain — temp-to-permanent commit", () => {
  it("lesson create commits temp media, rolls back on failure", () => {
    const src = read("lib/services/lesson-service.ts");
    assert.match(src, /commitTempMediaPath/, "must promote temp files");
    assert.match(src, /safeDeleteStoragePath/, "must clean up on failure");
    assert.match(src, /buildLessonVideoPath/, "video under lessons video path");
  });

  it("course create commits temp media, deletes course on failure", () => {
    const src = read("app/api/admin/courses/route.ts");
    assert.match(src, /commitTempMediaPath/, "must promote temp files");
    assert.match(src, /prisma\.course\.delete/, "orphan course removed on media failure");
  });

  it("protected lesson videos never served via /api/uploads", () => {
    const src = read("app/api/uploads/[...path]/route.ts");
    assert.match(src, /isProtectedCourseVideoPath/, "must block direct lesson video access");
    assert.match(src, /lessons/, "pattern covers lesson video paths");
  });

  it("storage adapter guards traversal + stays outside repo", () => {
    const src = read("lib/services/storage-adapter.ts");
    assert.match(src, /assertSafeStoragePath/, "must block path traversal");
    assert.match(src, /isPathInsideDir/, "must reject repo-inside roots");
    assert.match(src, /DEFAULT_UPLOAD_ROOT = "\/opt\/uploade"/, "default outside repo");
  });
});

describe("course admin panel — list/create/edit wired", () => {
  it("list page paginates + bulk actions", () => {
    const src = read("app/admin/courses/page.tsx");
    assert.match(src, /useAdminCoursesList/, "must fetch paginated list");
    assert.match(src, /BulkActionBar/, "must support bulk ops");
    assert.match(src, /entity="course"/, "bulk entity is course");
  });

  it("create page blocks submit while thumbnail uploading", () => {
    const src = read("app/admin/courses/create/page.tsx");
    assert.match(src, /thumbUploading/, "must track upload state");
    assert.match(src, /صبر کنید تا آپلود تصویر تمام شود/, "must gate submit");
    assert.match(src, /thumbnailTempPath/, "must send temp path");
  });

  it("lesson modal gates submit while video uploading, shows pending state", () => {
    const src = read("components/admin/course-edit/LessonModal.tsx");
    assert.match(src, /videoUploading/, "must track video upload state");
    assert.match(src, /صبر کنید تا آپلود ویدیو تمام شود/, "must gate submit during upload");
    assert.match(src, /disabled=\{isLoading \|\| videoUploading\}/, "submit disabled during upload");
    assert.match(src, /آپلود شد:/, "must confirm completed upload");
  });

  it("edit page covers basic + chapters + lessons tabs", () => {
    const src = read("app/admin/courses/[id]/edit/page.tsx");
    assert.match(src, /CourseBasicTab/, "basic tab");
    assert.match(src, /CourseChaptersTab/, "chapters tab");
    assert.match(src, /CourseLessonsTab/, "lessons tab");
  });

  it("admin hooks hit correct endpoints with invalidation", () => {
    const hooks = read("lib/hooks/useAdminCourses.ts");
    assert.match(hooks, /\/api\/admin\/courses\?\$/, "list endpoint");
    assert.match(hooks, /api\.patch\(`\/api\/admin\/courses\/\$\{id\}`/, "update endpoint");
    assert.match(hooks, /uploadTempFile/, "temp upload helper");
    assert.match(hooks, /timeout: kind === "video" \? 0 : 120000/, "video upload no-timeout");
    const lessons = read("lib/hooks/useLessons.ts");
    assert.match(lessons, /\/api\/admin\/courses\/\$\{courseId\}\/lessons/, "lesson create/list endpoint");
    assert.match(lessons, /api\.patch\(`\/api\/admin\/lessons\/\$\{id\}`/, "lesson update endpoint");
    assert.match(lessons, /api\.delete\(`\/api\/admin\/lessons\/\$\{id\}`/, "lesson delete endpoint");
  });
});

describe("video mute flags — admin toggle + muted default", () => {
  it("migration adds muted columns defaulting to true", () => {
    const sql = read("prisma/migrations/20261004000000_add_video_mute_flags/migration.sql");
    assert.match(sql, /ADD COLUMN `mutedByDefault`.*DEFAULT 1/, "lesson muted default");
    assert.match(sql, /ADD COLUMN `introMutedByDefault`.*DEFAULT 1/, "trailer muted default");
  });

  it("lesson create/update accept mutedByDefault", () => {
    const schema = read("lib/schemas/course-management-schema.ts");
    assert.match(schema, /mutedByDefault: z\.boolean/, "lesson schema carries flag");
    assert.match(schema, /introMutedByDefault: z\.boolean/, "course schema carries flag");
    const svc = read("lib/services/lesson-service.ts");
    assert.match(svc, /mutedByDefault: data\.mutedByDefault \?\? true/, "create defaults muted");
    assert.match(svc, /updateData\.mutedByDefault = data\.mutedByDefault/, "update persists flag");
  });

  it("lesson modal + course tab expose mute checkbox default on", () => {
    const modal = read("components/admin/course-edit/LessonModal.tsx");
    assert.match(modal, /mutedByDefault: true/, "new lesson defaults muted");
    assert.match(modal, /پخش بی‌صدا/, "modal has mute toggle");
    const tab = read("components/admin/course-edit/CourseBasicTab.tsx");
    assert.match(tab, /introMutedByDefault/, "trailer tab carries flag");
    assert.match(tab, /پخش بی‌صدا/, "trailer tab has mute toggle");
  });

  it("player starts muted from DB flag", () => {
    const player = read("components/course/purchasedCourseContent.tsx");
    assert.match(player, /mutedByDefault/, "player reads lesson flag");
    const modal = read("components/courses/CourseDetailModal.tsx");
    assert.match(modal, /introMutedByDefault \?\? true/, "teaser reads course flag");
  });

  it("trailer shows in modal, detail page, and admin tab", () => {
    const modal = read("components/courses/CourseDetailModal.tsx");
    assert.match(modal, /course\.introVideoUrl \? \(/, "modal prefers trailer over image");
    assert.match(modal, /autoPlay/, "modal teaser autoplays");
    const page = read("app/(routes)/courses/[categorySlug]/[courseSlug]/page.tsx");
    assert.match(page, /course\.introVideoUrl \? \(/, "detail page prefers trailer over image");
    const tab = read("components/admin/course-edit/CourseBasicTab.tsx");
    assert.match(tab, /پیش‌نمایش ویدیو معرفی/, "admin tab previews uploaded trailer");
    assert.match(tab, /trailerUploading/, "save gated during trailer upload");
  });

  it("public courses API degrades when mute migration missing", () => {
    const src = read("app/api/courses/route.ts");
    assert.match(src, /SELECT introMutedByDefault FROM Course LIMIT 0/, "probes mute column");
    assert.match(src, /1 AS introMutedByDefault/, "falls back to muted");
  });

  it("uploads route serves byte ranges so <video> can play", () => {
    const src = read("app/api/uploads/[...path]/route.ts");
    assert.match(src, /bytes=/, "parses Range header");
    assert.match(src, /Content-Range/, "returns Content-Range");
    assert.match(src, /206/, "returns 206 for partial content");
    assert.match(src, /Accept-Ranges/, "advertises range support");
    assert.match(src, /416/, "rejects unsatisfiable ranges");
    assert.match(src, /isTrailer/, "trailer gets cacheable headers");
  });
});

describe("course upload chain — auth everywhere", () => {
  it("every admin course/lesson route requires auth", () => {
    const routes = [
      "app/api/admin/courses/route.ts",
      "app/api/admin/courses/[id]/route.ts",
      "app/api/admin/courses/[id]/lessons/route.ts",
      "app/api/admin/lessons/route.ts",
      "app/api/admin/lessons/[id]/route.ts",
    ];
    for (const r of routes) {
      const src = read(r);
      assert.match(src, /401|UNAUTHORIZED/, `${r} must reject unauthenticated`);
    }
  });

  it("no DELETE on /api/admin/courses/[id] — delete goes through bulk", () => {
    const src = read("app/api/admin/courses/[id]/route.ts");
    assert.ok(!src.includes("export async function DELETE"), "single delete not exposed");
  });
});
