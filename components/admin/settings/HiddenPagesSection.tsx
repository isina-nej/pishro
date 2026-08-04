"use client";

import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HIDABLE_PAGES } from "@/lib/site/hidable-pages";
import { cn } from "@/lib/utils";

type HiddenPagesSectionProps = {
  hiddenPages: string[];
  onChange: (pages: string[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function HiddenPagesSection({
  hiddenPages,
  onChange,
  onSave,
  saving,
}: HiddenPagesSectionProps) {
  const toggle = (path: string) => {
    if (hiddenPages.includes(path)) {
      onChange(hiddenPages.filter((p) => p !== path));
    } else {
      onChange([...hiddenPages, path]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">نمایش صفحات اصلی</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            صفحات مخفی از منو و فوتر حذف می‌شوند و با باز کردن مستقیم آدرس، صفحهٔ
            ۴۰۴ نمایش داده می‌شود.
          </p>
        </div>
        <Button onClick={() => void onSave()} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره نمایش صفحات
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {HIDABLE_PAGES.map((page) => {
          const hidden = hiddenPages.includes(page.path);
          return (
            <button
              key={page.path}
              type="button"
              onClick={() => toggle(page.path)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-4 text-right transition",
                hidden
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div>
                <p className="text-sm font-bold">{page.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground ltr text-left" dir="ltr">
                  {page.path}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold",
                  hidden
                    ? "bg-destructive/15 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                {hidden ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    مخفی
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    نمایش
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {hiddenPages.length > 0 && (
        <Card className="p-3 text-xs text-muted-foreground">
          {hiddenPages.length} صفحه مخفی است.
        </Card>
      )}
    </div>
  );
}
