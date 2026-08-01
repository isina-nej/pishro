"use client";

import React, { forwardRef, useImperativeHandle, useState, useRef } from "react";
import Image from "next/image";
import { ProfileIcon } from "@/public/svgr-icons";
import { useUploadAvatar, useCurrentUser } from "@/lib/hooks/useUser";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfileAvatarForm = forwardRef((props, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadAvatar();
  const { data: userResponse } = useCurrentUser();
  const user = userResponse?.data;

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (selectedFile) {
        try {
          await uploadMutation.mutateAsync(selectedFile);
          // پاک کردن فایل انتخاب شده بعد از آپلود موفق
          setSelectedFile(null);
          setPreviewUrl(null);
        } catch (err) {
          console.error("Upload error:", err);
        }
      }
    },
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("فقط فرمت‌های JPG، PNG و WebP مجاز هستند");
      return;
    }

    // بررسی حجم فایل (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("حجم فایل نباید بیشتر از 2 مگابایت باشد");
      return;
    }

    setSelectedFile(file);

    // ایجاد پیش‌نمایش
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-muted/40 w-full rounded">
      <div className="w-full p-5 border-b border-border">
        <h6 className="font-irsans text-xs text-muted-foreground mb-5 flex items-center">
          <ProfileIcon className="size-4 stroke-foreground" />
          <span className="mr-3">تصویر پروفایل</span>
        </h6>
        <p className="text-xs text-muted-foreground">
          یک تصویر برای پروفایل خود آپلود کنید (حداکثر 2 مگابایت)
        </p>
      </div>
      <div className="p-5 w-full">
        <div className="p-5 bg-card rounded flex flex-col md:flex-row gap-6 items-start">
          {/* نمایش تصویر فعلی یا پیش‌نمایش */}
          <div className="relative">
            <div className="size-[120px] rounded-full bg-muted relative overflow-hidden border-2 border-border">
              {previewUrl ? (
                <Image
                  alt="پیش‌نمایش"
                  src={previewUrl}
                  fill
                  className="object-cover"
                />
              ) : user?.avatarUrl ? (
                <Image
                  alt="آواتار فعلی"
                  src={user.avatarUrl}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Upload className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {/* دکمه‌ها و اطلاعات */}
          <div className="flex-1 flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleButtonClick}
                variant="outline"
                className="text-xs"
                disabled={uploadMutation.isPending}
              >
                <Upload className="w-4 h-4 ml-2" />
                انتخاب تصویر
              </Button>

              {selectedFile && (
                <Button
                  type="button"
                  onClick={handleRemoveFile}
                  variant="ghost"
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  <X className="w-4 h-4 ml-1" />
                  حذف
                </Button>
              )}
            </div>

            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                فایل انتخاب شده: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              فرمت‌های مجاز: JPG، PNG، WebP | حداکثر حجم: 2 مگابایت
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileAvatarForm.displayName = "ProfileAvatarForm";
export default ProfileAvatarForm;
