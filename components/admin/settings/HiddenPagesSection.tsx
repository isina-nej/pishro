"use client";

import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HIDABLE_PAGES,
  HIDABLE_SECTIONS,
  type HidableItem,
} from "@/lib/site/hidable-pages";
import { cn } from "@/lib/utils";

type HiddenPagesSectionProps = {
  hiddenPages: string[];
  onChange: (pages: string[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

function ToggleGrid({
  items,
  hiddenPages,
  onToggle,
}: {
  items: HidableItem[];
  hiddenPages: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const hidden = hiddenPages.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl border p-4 text-right transition",
              hidden
                ? "border-destructive/30 bg-destructive/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold">{item.label}</p>
              {item.description ? (
                <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              <p
                className="mt-1 text-[10px] text-muted-foreground/80"
                dir="ltr"
              >
                {item.id}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold",
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
  );
}

export default function HiddenPagesSection({
  hiddenPages,
  onChange,
  onSave,
  saving,
}: HiddenPagesSectionProps) {
  const toggle = (id: string) => {
    if (hiddenPages.includes(id)) {
      onChange(hiddenPages.filter((p) => p !== id));
    } else {
      onChange([...hiddenPages, id]);
    }
  };

  const hiddenPageCount = hiddenPages.filter((id) => id.startsWith("/")).length;
  const hiddenSectionCount = hiddenPages.filter((id) =>
    id.startsWith("home:")
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">نمایش صفحات و بخش‌ها</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            صفحات مخفی از منو و فوتر حذف می‌شوند و با آدرس مستقیم ۴۰۴ می‌گیرند.
            بخش‌های صفحه اصلی فقط از لندینگ حذف می‌شوند و خود مسیر `/` باز
            می‌ماند.
          </p>
        </div>
        <Button onClick={() => void onSave()} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره نمایش
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground">صفحات اصلی سایت</h3>
        <ToggleGrid
          items={HIDABLE_PAGES}
          hiddenPages={hiddenPages}
          onToggle={toggle}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground">
          بخش‌های صفحه اصلی (Hide options)
        </h3>
        <ToggleGrid
          items={HIDABLE_SECTIONS}
          hiddenPages={hiddenPages}
          onToggle={toggle}
        />
      </div>

      {(hiddenPageCount > 0 || hiddenSectionCount > 0) && (
        <Card className="p-3 text-xs text-muted-foreground">
          {hiddenPageCount} صفحه و {hiddenSectionCount} بخش مخفی است.
        </Card>
      )}
    </div>
  );
}
