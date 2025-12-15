import type { Lesson } from "@prisma/client";

export type { Lesson };

export interface LessonWithCourse extends Lesson {
  course: {
    id: string;
    subject: string;
    slug: string | null;
  };
}

export interface LessonFormData {
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  order?: number;
  published?: boolean;
}
