"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_FAVICON_URL,
  DEFAULT_LOGO_URL,
  DEFAULT_OG_IMAGE_URL,
} from "@/lib/site/branding";

type BrandingSectionProps = {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  onChange: (patch: {
    siteName?: string;
    siteDescription?: string;
    logoUrl?: string;
    faviconUrl?: string;
    ogImageUrl?: string;
  }) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

async function uploadBranding(file: File, kind: "logo" | "favicon" | "og") {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  const res = await fetch("/api/admin/settings/upload-branding", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در آپلود");
  }
  return json.data.url as string;
}

function AssetRow({
  label,
  hint,
  value,
  fallback,
  kind,
  onUploaded,
  onClear,
}: {
  label: string;
  hint: string;
  value: string;
  fallback: string;
  kind: "logo" | "favicon" | "og";
  onUploaded: (url: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const src = value?.trim() || fallback;

  const onPick = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBranding(file, kind);
      onUploaded(url);
      toast.success("تصویر آپلود شد — ذخیره را بزنید");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در آپلود");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{label}</h3>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {hint}
          </p>
        </div>
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={src}
            alt={label}
            fill
            className="object-contain p-1"
            unoptimized
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico"
        className="hidden"
        onChange={(e) => void onPick(e.target.files?.[0] || null)}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          آپلود
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-destructive"
            onClick={onClear}
          >
            <Trash2 className="h-3.5 w-3.5" />
            بازگشت به پیش‌فرض
          </Button>
        )}
      </div>
      <div className="space-y-1">
        <Label className="text-[11px]">آدرس تصویر</Label>
        <Input
          dir="ltr"
          value={value}
          onChange={(e) => onUploaded(e.target.value)}
          placeholder={fallback}
          className="text-xs"
        />
      </div>
    </Card>
  );
}

export default function BrandingSection({
  siteName,
  siteDescription,
  logoUrl,
  faviconUrl,
  ogImageUrl,
  onChange,
  onSave,
  saving,
}: BrandingSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">لوگو و آیکن سایت</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            لوگو در نوار و فوتر، آیکن در تب مرورگر و نتایج گوگل، و تصویر اشتراک‌گذاری
            (OG) نمایش داده می‌شود.
          </p>
        </div>
        <Button onClick={() => void onSave()} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره برندینگ
        </Button>
      </div>

      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>نام سایت</Label>
          <Input
            value={siteName}
            onChange={(e) => onChange({ siteName: e.target.value })}
            placeholder="پیشرو سرمایه"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>توضیح کوتاه (سئو / اشتراک)</Label>
          <Input
            value={siteDescription}
            onChange={(e) => onChange({ siteDescription: e.target.value })}
            placeholder="پیشرو - آموزش و سرمایه‌گذاری"
          />
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-3">
        <AssetRow
          label="لوگوی سایت"
          hint="نمایش در هدر و فوتر تمام صفحات"
          value={logoUrl}
          fallback={DEFAULT_LOGO_URL}
          kind="logo"
          onUploaded={(url) => onChange({ logoUrl: url })}
          onClear={() => onChange({ logoUrl: "" })}
        />
        <AssetRow
          label="آیکن / Favicon"
          hint="تب کروم، بوکمارک و نتایج جستجوی گوگل"
          value={faviconUrl}
          fallback={DEFAULT_FAVICON_URL}
          kind="favicon"
          onUploaded={(url) => onChange({ faviconUrl: url })}
          onClear={() => onChange({ faviconUrl: "" })}
        />
        <AssetRow
          label="تصویر OG"
          hint="پیش‌نمایش هنگام اشتراک‌گذاری لینک"
          value={ogImageUrl}
          fallback={DEFAULT_OG_IMAGE_URL}
          kind="og"
          onUploaded={(url) => onChange({ ogImageUrl: url })}
          onClear={() => onChange({ ogImageUrl: "" })}
        />
      </div>
    </div>
  );
}
