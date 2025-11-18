// @/lib/hooks/useVideos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type {
  Video,
  RequestUploadUrlInput,
  CreateVideoInput,
  UpdateVideoInput,
  VideoFilterOptions,
  StreamToken,
} from "@/types/video";
import type { ApiSuccessResponse, PaginatedData } from "@/lib/api-response";

// ===========================
// Query Keys
// ===========================
export const videoKeys = {
  all: ["videos"] as const,
  lists: () => [...videoKeys.all, "list"] as const,
  list: (filters: VideoFilterOptions) =>
    [...videoKeys.lists(), filters] as const,
  details: () => [...videoKeys.all, "detail"] as const,
  detail: (videoId: string) => [...videoKeys.details(), videoId] as const,
  token: (videoId: string) => [...videoKeys.all, "token", videoId] as const,
};

// ===========================
// Queries
// ===========================

/**
 * Hook برای دریافت لیست ویدیوها (برای ادمین)
 */
export function useVideos(filters: VideoFilterOptions = {}) {
  return useQuery<PaginatedData<Video>>({
    queryKey: videoKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.processingStatus) {
        params.set("status", filters.processingStatus);
      }
      if (filters.search) {
        params.set("search", filters.search);
      }
      if (filters.page) {
        params.set("page", filters.page.toString());
      }
      if (filters.limit) {
        params.set("limit", filters.limit.toString());
      }

      const response = await axios.get<ApiSuccessResponse<PaginatedData<Video>>>(
        `/api/admin/videos?${params.toString()}`
      );

      return response.data.data;
    },
    staleTime: 30 * 1000, // 30 ثانیه - ویدیوها ممکن است در حال پردازش باشند
    gcTime: 5 * 60 * 1000, // 5 دقیقه در cache
    retry: 2,
    refetchInterval: (query) => {
      // اگر ویدیویی در حال پردازش است، هر 5 ثانیه refresh کن
      const hasProcessing = query.state.data?.items.some(
        (v) =>
          v.processingStatus === "UPLOADING" ||
          v.processingStatus === "UPLOADED" ||
          v.processingStatus === "PROCESSING"
      );
      return hasProcessing ? 5000 : false;
    },
  });
}

/**
 * Hook برای دریافت یک ویدیوی خاص
 */
export function useVideo(videoId: string) {
  return useQuery<Video>({
    queryKey: videoKeys.detail(videoId),
    queryFn: async () => {
      const response = await axios.get<ApiSuccessResponse<Video>>(
        `/api/admin/videos/${videoId}`
      );
      return response.data.data;
    },
    staleTime: 30 * 1000,
    enabled: !!videoId,
    refetchInterval: (query) => {
      // اگر ویدیو در حال پردازش است، هر 3 ثانیه refresh کن
      const isProcessing =
        query.state.data?.processingStatus === "UPLOADING" ||
        query.state.data?.processingStatus === "UPLOADED" ||
        query.state.data?.processingStatus === "PROCESSING";
      return isProcessing ? 3000 : false;
    },
  });
}

/**
 * Hook برای دریافت توکن پخش ویدیو
 */
export function useVideoToken(videoId: string) {
  return useQuery<StreamToken>({
    queryKey: videoKeys.token(videoId),
    queryFn: async () => {
      const response = await axios.post<
        ApiSuccessResponse<Omit<StreamToken, "userId">>
      >("/api/video/token", { videoId });
      return response.data.data as StreamToken;
    },
    enabled: false, // فقط manual فراخوانی شود
    staleTime: 0, // هرگز fresh نیست - همیشه جدید بگیر
    gcTime: 0, // در cache نگه ندار
  });
}

// ===========================
// Mutations
// ===========================

/**
 * Hook برای درخواست Upload URL
 */
export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: async (data: RequestUploadUrlInput) => {
      const response = await axios.post<
        ApiSuccessResponse<{
          uploadUrl: string;
          videoId: string;
          storagePath: string;
          uniqueFileName: string;
          expiresAt: number;
        }>
      >("/api/admin/videos/upload-url", data);
      return response.data.data;
    },
  });
}

/**
 * Hook برای آپلود فایل ویدیو به storage
 */
export function useUploadVideo() {
  return useMutation({
    mutationFn: async ({
      uploadUrl,
      file,
      onProgress,
    }: {
      uploadUrl: string;
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
    },
  });
}

/**
 * Hook برای ایجاد رکورد ویدیو در دیتابیس
 */
export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateVideoInput & { startProcessing?: boolean }
    ) => {
      const response = await axios.post<ApiSuccessResponse<Video>>(
        "/api/admin/videos",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate لیست ویدیوها
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook برای بروزرسانی ویدیو
 */
export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      data,
    }: {
      videoId: string;
      data: UpdateVideoInput;
    }) => {
      const response = await axios.put<ApiSuccessResponse<Video>>(
        `/api/admin/videos/${videoId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate لیست و detail
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: videoKeys.detail(data.videoId),
      });
    },
  });
}

/**
 * Hook برای حذف ویدیو
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await axios.delete<
        ApiSuccessResponse<{ videoId: string }>
      >(`/api/admin/videos/${videoId}`);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate لیست ویدیوها
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook کامل برای آپلود ویدیو (شامل تمام مراحل)
 */
export function useCompleteVideoUpload() {
  const requestUploadUrl = useRequestUploadUrl();
  const uploadVideo = useUploadVideo();
  const createVideo = useCreateVideo();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      onProgress,
    }: {
      file: File;
      title: string;
      description?: string;
      onProgress?: (stage: string, progress: number) => void;
    }) => {
      // مرحله 1: درخواست Upload URL
      onProgress?.("requesting_url", 0);

      const fileExtension = file.name.split(".").pop() || "mp4";

      const uploadUrlData = await requestUploadUrl.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        fileFormat: fileExtension,
        title,
        description,
      });

      // مرحله 2: آپلود فایل
      onProgress?.("uploading", 0);

      await uploadVideo.mutateAsync({
        uploadUrl: uploadUrlData.uploadUrl,
        file,
        onProgress: (progress) => {
          onProgress?.("uploading", progress);
        },
      });

      // مرحله 3: ایجاد رکورد در دیتابیس
      onProgress?.("saving", 100);

      const videoRecord = await createVideo.mutateAsync({
        title,
        description,
        videoId: uploadUrlData.videoId,
        originalPath: uploadUrlData.storagePath,
        fileSize: file.size,
        fileFormat: fileExtension,
        startProcessing: true,
      });

      onProgress?.("completed", 100);

      return videoRecord;
    },
  });
}
