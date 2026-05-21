import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, "عنوان الزامی است")
  .max(200, "عنوان نباید بیشتر از 200 کاراکتر باشد");

export const CourseCreateSchema = z.object({
  title: titleSchema,
  description: z.string().optional(),
  cost: z.number()
    .int("قیمت باید عدد صحیح باشد")
    .min(0, "هزینه باید عدد نامنفی باشد")
    .max(2147483647, "قیمت نمی‌تواند بیشتر از 2,147,483,647 باشد"),
  likes: z.number().int().min(0).optional(),
  dislikes: z.number().int().min(0).optional(),
  categoryId: z.string().optional().nullable(),
  hasChapters: z.boolean().optional(),
  thumbnailPath: z.string().optional().nullable(),
  trailerVideoPath: z.string().optional().nullable(),
  thumbnailTempPath: z.string().optional().nullable(),
  trailerTempPath: z.string().optional().nullable(),
});

export const CourseUpdateSchema = CourseCreateSchema.partial();

export const ChapterCreateSchema = z.object({
  title: titleSchema,
});

export const ChapterUpdateSchema = z.object({
  title: titleSchema.optional(),
});

const lessonBaseSchema = z.object({
  courseId: z.string().min(1),
  title: titleSchema,
  description: z.string().optional(),
  durationSeconds: z
    .number()
    .int()
    .positive("مدت زمان باید عدد صحیح مثبت باشد"),
  chapterId: z.string().optional().nullable(),
  position: z.number().int().positive().optional(),
  thumbnailPath: z.string().optional().nullable(),
  videoPath: z.string().optional().nullable(),
  thumbnailTempPath: z.string().optional().nullable(),
  videoTempPath: z.string().optional().nullable(),
});

export const LessonCreateSchema = lessonBaseSchema.refine(
  (d) => !!(d.videoPath || d.videoTempPath),
  { message: "ویدیو الزامی است", path: ["videoTempPath"] }
);

export const LessonUpdateSchema = lessonBaseSchema
  .omit({ courseId: true })
  .partial();

export const ReorderSchema = z.object({
  order: z.array(z.string().min(1)).min(1),
});

export const THUMBNAIL_MAX_BYTES = 2 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 500 * 1024 * 1024;
export const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png"] as const;
export const ALLOWED_VIDEO_TYPE = "video/mp4";

export function validateThumbnailFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type as (typeof ALLOWED_THUMBNAIL_TYPES)[number])) {
    return "فرمت تصویر باید JPEG یا PNG باشد";
  }
  if (file.size > THUMBNAIL_MAX_BYTES) {
    return "حجم تصویر نباید بیشتر از 2 مگابایت باشد";
  }
  return null;
}

export function validateVideoFile(file: {
  type: string;
  size: number;
}): string | null {
  if (file.type !== ALLOWED_VIDEO_TYPE) {
    return "فرمت ویدیو باید MP4 باشد";
  }
  if (file.size > VIDEO_MAX_BYTES) {
    return "حجم ویدیو نباید بیشتر از 500 مگابایت باشد";
  }
  return null;
}
