// @/lib/hooks/useChapters.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Chapter {
  id: string;
  courseId: string;
  title: string;
  position: number;
  lessons?: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateChapterInput {
  title: string;
}

interface UpdateChapterInput {
  title?: string;
}

interface ReorderInput {
  order: string[];
}

export const chapterKeys = {
  all: ["chapters"] as const,
  lists: () => [...chapterKeys.all, "list"] as const,
  listByCourse: (courseId: string) =>
    [...chapterKeys.lists(), courseId] as const,
  detail: (id: string) => [...chapterKeys.all, "detail", id] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Get chapters for a course
 */
export function useChapters(courseId: string, enabled = true) {
  return useQuery({
    queryKey: chapterKeys.listByCourse(courseId),
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/admin/courses/${courseId}/chapters?limit=100`
      );
      return (data.data.items ?? data.data) as Chapter[];
    },
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}

// ===========================
// Mutations
// ===========================

/**
 * Create a new chapter
 */
export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CreateChapterInput;
    }) => {
      const { data: response } = await axios.post(
        `/api/admin/courses/${courseId}/chapters`,
        data
      );
      return response.data as Chapter;
    },
    onSuccess: (chapter) => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(chapter.courseId),
      });
      toast.success("فصل با موفقیت ایجاد شد");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "خطا در ایجاد فصل";
      toast.error(message);
    },
  });
}

/**
 * Update a chapter
 */
export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateChapterInput;
    }) => {
      const { data: response } = await axios.patch(
        `/api/admin/chapters/${id}`,
        data
      );
      return response.data as Chapter;
    },
    onSuccess: (chapter) => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(chapter.courseId),
      });
      toast.success("فصل با موفقیت به‌روز شد");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "خطا در به‌روزرسانی فصل";
      toast.error(message);
    },
  });
}

/**
 * Delete a chapter
 */
export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await axios.delete(`/api/admin/chapters/${id}`);
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      toast.success("فصل با موفقیت حذف شد");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "خطا در حذف فصل";
      toast.error(message);
    },
  });
}

/**
 * Reorder chapters
 */
export function useReorderChapters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      order,
    }: {
      courseId: string;
      order: string[];
    }) => {
      const { data } = await axios.post(
        `/api/admin/courses/${courseId}/chapters/reorder`,
        { order }
      );
      return data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      toast.success("ترتیب فصل‌ها با موفقیت به‌روز شد");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "خطا در ترتیب فصل‌ها";
      toast.error(message);
    },
  });
}

/**
 * Reorder lessons in a course
 */
export function useReorderLessons() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      order,
    }: {
      courseId: string;
      order: string[];
    }) => {
      const { data } = await axios.post(
        `/api/admin/courses/${courseId}/lessons/reorder`,
        { order }
      );
      return data;
    },
    onSuccess: (_, { courseId }) => {
      // Invalidate both chapter and course detail queries
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-lessons", "list", courseId],
      });
      toast.success("ترتیب درس‌ها با موفقیت به‌روز شد");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "خطا در ترتیب درس‌ها";
      toast.error(message);
    },
  });
}
