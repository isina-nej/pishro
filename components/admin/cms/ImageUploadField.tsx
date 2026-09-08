"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, ExternalLink, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  "/images/home/news-club/news-club.svg",
  "/images/courses/landing.jpg",
  "/images/library/landing.jpg",
  "/images/news/header.jpg",
  "/images/investment-consulting/landing.jpg",
  "/logo/logo.png",
];

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", "logo"); // accepted by /api/admin/settings/upload-branding

  const res = await fetch("/api/admin/settings/upload-branding", {
    method: "POST",
    credentials: "include",
    body: form,
  });

  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در آپلود تصویر");
  }

  return json.data.url as string;
}

export default function ImageUploadField({
  value,
  onChange,
  label,
  hint,
  presets = DEFAULT_PRESETS,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("تصویر با موفقیت آپلود شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  const hasImage = Boolean(value?.trim());

  return (
    <div className="space-y-1.5" dir="rtl">
      {label && <Label className="text-xs font-semibold text-foreground">{label}</Label>}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        {/* Visual Thumbnail */}
        <div className="relative group size-20 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/40 shadow-inner">
          {hasImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label || "پیش‌نمایش"}
                className="size-full object-cover object-center transition duration-200 group-hover:scale-105"
                onError={(e) => {
                  // Fallback visual on broken image
                  (e.target as HTMLImageElement).src = "/images/courses/placeholder.png";
                }}
              />
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"
                title="بزرگ‌نمایی تصویر"
              >
                <Eye className="size-5 text-white drop-shadow" />
              </button>
            </>
          ) : (
            <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
              <ImagePlus className="size-6 stroke-1 text-muted-foreground/60" />
              <span className="mt-1 text-[9px]">بدون تصویر</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              dir="ltr"
              placeholder="/images/... یا https://..."
              className="h-9 text-xs font-mono"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-9 shrink-0 gap-1.5 px-3 text-xs"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ImagePlus className="size-3.5" />
              )}
              آپلود
            </Button>

            {hasImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                title="حذف تصویر"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>

          {/* Quick presets */}
          {presets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">پیشنهادها:</span>
              {presets.slice(0, 4).map((p) => {
                const isCurrent = value === p;
                const fileName = p.split("/").pop() || p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange(p)}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] transition ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {fileName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}

      {/* Enlarged preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">پیش‌نمایش تصویر</DialogTitle>
          </DialogHeader>
          <div className="relative flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl bg-black/5 p-2 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="بزرگ‌نمایی"
              className="max-h-[60vh] max-w-full rounded-lg object-contain shadow"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono" dir="ltr">
            <span>{value}</span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="size-3" />
              باز کردن در تب جدید
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
