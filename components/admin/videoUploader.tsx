// @/components/admin/videoUploader.tsx
"use client";

import { useState, useRef } from "react";
import { useCompleteVideoUpload } from "@/lib/hooks/useVideos";
import type { Video } from "@prisma/client";

interface VideoUploaderProps {
  onUploadComplete?: (video: Video) => void;
  onError?: (error: Error) => void;
}

export function VideoUploader({
  onUploadComplete,
  onError,
}: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStage, setUploadStage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useCompleteVideoUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // بررسی نوع فایل
      const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
      if (!allowedTypes.includes(file.type)) {
        alert("فرمت فایل پشتیبانی نمی‌شود. لطفاً MP4, MOV, AVI, MKV یا WebM انتخاب کنید.");
        return;
      }

      // بررسی حجم فایل (حداکثر 5GB)
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
      if (file.size > maxSize) {
        alert("حجم فایل نباید بیشتر از 5 گیگابایت باشد.");
        return;
      }

      setSelectedFile(file);
      // اگر عنوان خالی است، از نام فایل استفاده کن
      if (!title) {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileNameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      alert("لطفاً فایل و عنوان ویدیو را وارد کنید.");
      return;
    }

    try {
      const video = await uploadMutation.mutateAsync({
        file: selectedFile,
        title: title.trim(),
        description: description.trim() || undefined,
        onProgress: (stage, progress) => {
          setUploadStage(stage);
          setUploadProgress(progress);
        },
      });

      // پاکسازی فرم
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setUploadStage("");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadComplete?.(video as Video);
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error as Error);
      alert("خطا در آپلود ویدیو. لطفاً دوباره تلاش کنید.");
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case "requesting_url":
        return "درخواست URL آپلود...";
      case "uploading":
        return "در حال آپلود...";
      case "saving":
        return "ذخیره اطلاعات...";
      case "completed":
        return "تکمیل شد!";
      default:
        return "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + "KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        آپلود ویدیوی جدید
      </h2>

      <div className="space-y-4">
        {/* انتخاب فایل */}
        <div>
          <label
            htmlFor="video-file"
            className="block text-sm font-medium text-foreground mb-2"
          >
            فایل ویدیو *
          </label>
          <input
            ref={fileInputRef}
            id="video-file"
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-muted-foreground">
              فایل انتخاب شده: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </p>
          )}
        </div>

        {/* عنوان */}
        <div>
          <label
            htmlFor="video-title"
            className="block text-sm font-medium text-foreground mb-2"
          >
            عنوان ویدیو *
          </label>
          <input
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            placeholder="عنوان ویدیو را وارد کنید"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* توضیحات */}
        <div>
          <label
            htmlFor="video-description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            توضیحات
          </label>
          <textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            placeholder="توضیحات ویدیو (اختیاری)"
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {getStageText(uploadStage)}
              </span>
              <span className="text-sm font-medium text-foreground">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* دکمه آپلود */}
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile || !title.trim()}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {isUploading ? "در حال آپلود..." : "آپلود ویدیو"}
        </button>

        {/* راهنما */}
        <div className="mt-4 p-4 bg-muted rounded-md border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            نکات مهم:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>فرمت‌های پشتیبانی شده: MP4, MOV, AVI, MKV, WebM</li>
            <li>حداکثر حجم فایل: 5 گیگابایت</li>
            <li>
              پس از آپلود، ویدیو به صورت خودکار به فرمت HLS تبدیل می‌شود
            </li>
            <li>فرآیند تبدیل ممکن است چند دقیقه طول بکشد</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
