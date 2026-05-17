import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { adminCourseKeys } from "./useAdminCourses";
import { chapterKeys } from "./useChapters";

export const lessonKeys = {
  all: ["admin-lessons"] as const,
  listByCourse: (courseId: string) =>
    [...lessonKeys.all, "list", courseId] as const,
};

export function useCourseLessons(courseId: string) {
  return useQuery({
    queryKey: lessonKeys.listByCourse(courseId),
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/admin/courses/${courseId}/lessons?limit=100`
      );
      return data.data.items as Array<{
        id: string;
        title: string;
        description?: string;
        durationSeconds?: number;
        order: number;
        chapterId?: string;
        thumbnail?: string;
        videoUrl?: string;
      }>;
    },
    enabled: !!courseId,
  });
}

export function useCreateLesson(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await axios.post(
        `/api/admin/courses/${courseId}/lessons`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.listByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: adminCourseKeys.detail(courseId),
      });
      toast.success("درس ایجاد شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در ایجاد درس");
    },
  });
}

export function useUpdateLesson(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const { data: res } = await axios.patch(`/api/admin/lessons/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.listByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      toast.success("درس به‌روز شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی درس");
    },
  });
}

export function useDeleteLesson(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.listByCourse(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: chapterKeys.listByCourse(courseId),
      });
      toast.success("درس حذف شد");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "خطا در حذف درس");
    },
  });
}
