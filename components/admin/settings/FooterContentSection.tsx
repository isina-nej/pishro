"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_ENAMAD,
  DEFAULT_FOOTER_CONTENT,
  type ChromeLink,
  type FooterColumnContent,
  type FooterContent,
} from "@/lib/site/chrome-content";
import { cn } from "@/lib/utils";

type FooterContentSectionProps = {
  content: FooterContent;
  onChange: (content: FooterContent) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

const MAX_COLUMNS = 8;

function newColumn(index: number): FooterColumnContent {
  return {
    id: `column-${Date.now().toString(36)}-${index}`,
    title: `ستون ${index + 1}`,
    links: [{ label: "لینک جدید", link: "/" }],
  };
}

function LinkEditor({
  title,
  links,
  onChange,
}: {
  title: string;
  links: ChromeLink[];
  onChange: (links: ChromeLink[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-muted-foreground">{title}</p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 gap-1 px-2 text-[11px]"
          onClick={() => onChange([...links, { label: "لینک جدید", link: "/" }])}
        >
          <Plus className="h-3 w-3" />
          افزودن
        </Button>
      </div>
      {links.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground">
          لینکی ثبت نشده — با «افزودن» لینک جدید بسازید.
        </p>
      )}
      {links.map((link, index) => (
        <div key={`${link.link}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={link.label}
            onChange={(e) =>
              onChange(
                links.map((row, i) =>
                  i === index ? { ...row, label: e.target.value } : row
                )
              )
            }
            placeholder="عنوان"
          />
          <Input
            value={link.link}
            dir="ltr"
            className="font-mono text-xs"
            onChange={(e) =>
              onChange(
                links.map((row, i) =>
                  i === index ? { ...row, link: e.target.value } : row
                )
              )
            }
            placeholder="/path یا https://…"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="حذف لینک"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

async function uploadEnamadImage(file: File): Promise<string> {
  const { api } = await import("@/lib/api-client");
  const form = new FormData();
  form.append("file", file);
  form.append("kind", "logo");
  const { data } = await api.post("/api/admin/settings/upload-branding", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.url as string;
}

function EnamadEditor({
  enabled,
  linkUrl,
  imageUrl,
  onChange,
}: {
  enabled: boolean;
  linkUrl: string;
  imageUrl: string;
  onChange: (patch: { enabled?: boolean; linkUrl?: string; imageUrl?: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onPick = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadEnamadImage(file);
      onChange({ imageUrl: url });
      toast.success("تصویر اینماد آپلود شد — ذخیره فوتر را بزنید");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در آپلود");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold">نماد اعتماد (اینماد)</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              لینک trustseal و تصویر نماد — خاموش شود از فوتر حذف می‌شود.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {enabled ? (
            <Eye className="h-4 w-4 text-primary" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => onChange({ enabled: checked })}
            aria-label="نمایش اینماد"
          />
        </div>
      </div>

      <div className={cn("space-y-3", !enabled && "pointer-events-none opacity-50")}>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">لینک trustseal اینماد</Label>
          <Input
            value={linkUrl}
            dir="ltr"
            className="font-mono text-xs"
            onChange={(e) => onChange({ linkUrl: e.target.value })}
            placeholder="https://trustseal.enamad.ir/?id=…"
          />
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="پیش‌نمایش اینماد"
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                بدون تصویر
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
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
                آپلود تصویر
              </Button>
              {imageUrl && imageUrl !== DEFAULT_ENAMAD.imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive"
                  onClick={() => onChange({ imageUrl: DEFAULT_ENAMAD.imageUrl })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  بازگشت به تصویر پیش‌فرض
                </Button>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">آدرس تصویر اینماد</Label>
              <Input
                dir="ltr"
                value={imageUrl}
                onChange={(e) => onChange({ imageUrl: e.target.value })}
                placeholder={DEFAULT_ENAMAD.imageUrl}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FooterContentSection({
  content,
  onChange,
  onSave,
  saving,
}: FooterContentSectionProps) {
  const patch = (partial: Partial<FooterContent>) =>
    onChange({ ...content, ...partial });

  const columns = content.columns ?? [];

  const patchColumn = (index: number, column: FooterColumnContent) => {
    onChange({
      ...content,
      columns: columns.map((col, i) => (i === index ? column : col)),
    });
  };

  const addColumn = () => {
    if (columns.length >= MAX_COLUMNS) {
      toast.error(`حداکثر ${MAX_COLUMNS} ستون مجاز است`);
      return;
    }
    onChange({ ...content, columns: [...columns, newColumn(columns.length)] });
  };

  const removeColumn = (index: number) => {
    const target = columns[index];
    if (!target) return;
    if (
      !window.confirm(
        `ستون «${target.title || `ستون ${index + 1}`}» حذف شود؟ لینک‌های آن هم حذف می‌شوند.`
      )
    ) {
      return;
    }
    onChange({ ...content, columns: columns.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">اطلاعات فوتر</h2>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              متن درباره، راه‌های تماس، شبکه‌های اجتماعی، ستون‌های لینک (حذف/اضافه/ویرایش)،
              نماد اعتماد و لینک‌های حقوقی پایین فوتر را کامل ویرایش کنید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onChange(structuredClone(DEFAULT_FOOTER_CONTENT))}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بازگشت به پیش‌فرض
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={saving}
              onClick={() => void onSave()}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              ذخیره فوتر
            </Button>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">متن معرفی</h3>
        <Textarea
          rows={4}
          value={content.aboutText}
          onChange={(e) => patch({ aboutText: e.target.value })}
          placeholder="متن کوتاه درباره برند در فوتر"
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">پسوند کپی‌رایت</Label>
          <Input
            value={content.copyrightSuffix}
            onChange={(e) => patch({ copyrightSuffix: e.target.value })}
            placeholder="تمامی حقوق محفوظ است."
          />
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">تماس و آدرس</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["phone", "تلفن ثابت (نمایش)", "۰۱۱…"],
              ["phoneTel", "تلفن ثابت (tel:)", "011…"],
              ["mobile", "موبایل (نمایش)", "۰۹۱…"],
              ["mobileTel", "موبایل (tel:)", "091…"],
              ["email", "ایمیل", "info@…"],
              ["address", "آدرس", "تهران، …"],
              ["weekdaysHours", "ساعات روزهای کاری", "۹ تا ۱۸"],
              ["weekendsHours", "ساعات آخر هفته", "تعطیل"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold">{label}</Label>
              <Input
                value={content[key]}
                dir={key.endsWith("Tel") || key === "email" ? "ltr" : undefined}
                onChange={(e) => patch({ [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">شبکه‌های اجتماعی</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["instagram", "اینستاگرام"],
              ["telegram", "تلگرام"],
              ["twitter", "ایکس / لینکدین"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold">{label}</Label>
              <Input
                value={content[key]}
                dir="ltr"
                className="font-mono text-xs"
                onChange={(e) => patch({ [key]: e.target.value })}
                placeholder="https://…"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold">ستون‌های لینک فوتر</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {columns.length} ستون فعال — عنوان و لینک هر ستون را ویرایش کنید، ستون حذف
              یا ستون جدید اضافه کنید (حداکثر {MAX_COLUMNS}).
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={columns.length >= MAX_COLUMNS}
            onClick={addColumn}
          >
            <Plus className="h-3.5 w-3.5" />
            افزودن ستون
          </Button>
        </div>

        {columns.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
            ستونی ثبت نشده — با «افزودن ستون» ستون جدید بسازید.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {columns.map((column, index) => (
              <Card key={column.id || index} className="space-y-3 border-dashed p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-primary">ستون {index + 1}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2 text-[11px] text-destructive hover:text-destructive"
                    onClick={() => removeColumn(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف ستون
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">عنوان ستون</Label>
                  <Input
                    value={column.title}
                    onChange={(e) =>
                      patchColumn(index, { ...column, title: e.target.value })
                    }
                    placeholder="مثلاً کاوش"
                  />
                </div>
                <LinkEditor
                  title="لینک‌های ستون"
                  links={column.links}
                  onChange={(links) => patchColumn(index, { ...column, links })}
                />
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-3 p-4 sm:p-5">
        <EnamadEditor
          enabled={content.enamad?.enabled ?? DEFAULT_ENAMAD.enabled}
          linkUrl={content.enamad?.linkUrl ?? DEFAULT_ENAMAD.linkUrl}
          imageUrl={content.enamad?.imageUrl ?? DEFAULT_ENAMAD.imageUrl}
          onChange={(enamadPatch) =>
            patch({
              enamad: {
                enabled: content.enamad?.enabled ?? DEFAULT_ENAMAD.enabled,
                linkUrl: content.enamad?.linkUrl ?? DEFAULT_ENAMAD.linkUrl,
                imageUrl: content.enamad?.imageUrl ?? DEFAULT_ENAMAD.imageUrl,
                ...enamadPatch,
              },
            })
          }
        />
      </Card>

      <Card className="space-y-3 p-4 sm:p-5">
        <LinkEditor
          title="لینک‌های حقوقی پایین فوتر"
          links={content.legalLinks}
          onChange={(legalLinks) => patch({ legalLinks })}
        />
      </Card>
    </div>
  );
}
