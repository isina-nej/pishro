import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CourseCreateSchema,
  LessonCreateSchema,
  validateThumbnailFile,
  validateVideoFile,
} from '../lib/schemas/course-management-schema';

describe('course-management validation', () => {
  it('accepts valid course', () => {
    const r = CourseCreateSchema.safeParse({
      title: 'دوره تست',
      cost: 0,
      likes: 1,
      dislikes: 0,
    });
    assert.equal(r.success, true);
  });

  it('rejects negative cost', () => {
    const r = CourseCreateSchema.safeParse({ title: 'x', cost: -1 });
    assert.equal(r.success, false);
  });

  it('rejects invalid lesson duration', () => {
    const r = LessonCreateSchema.safeParse({
      courseId: 'c1',
      title: 'درس',
      durationSeconds: 0,
    });
    assert.equal(r.success, false);
  });

  it('validates thumbnail mime and size', () => {
    assert.equal(
      validateThumbnailFile({ type: 'image/gif', size: 100 }),
      'فرمت تصویر باید JPEG یا PNG باشد'
    );
    assert.equal(validateThumbnailFile({ type: 'image/png', size: 100 }), null);
  });

  it('validates video mime', () => {
    assert.equal(
      validateVideoFile({ type: 'video/webm', size: 100 }),
      'فرمت ویدیو باید MP4 باشد'
    );
    assert.equal(validateVideoFile({ type: 'video/mp4', size: 100 }), null);
  });
});
