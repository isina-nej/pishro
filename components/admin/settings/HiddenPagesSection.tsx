"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HIDABLE_GROUPS,
  type HidableGroup,
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
              "flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-right transition",
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

function GroupBlock({
  group,
  open,
  onToggleOpen,
  hiddenPages,
  onToggleItem,
  onHideAll,
  onShowAll,
}: {
  group: HidableGroup;
  open: boolean;
  onToggleOpen: () => void;
  hiddenPages: string[];
  onToggleItem: (id: string) => void;
  onHideAll: () => void;
  onShowAll: () => void;
}) {
  const hiddenCount = group.items.filter((i) =>
    hiddenPages.includes(i.id)
  ).length;

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center justify-between gap-3 p-4 text-right"
      >
        <div>
          <p className="text-sm font-bold">{group.label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {group.description}
            {hiddenCount > 0 ? ` · ${hiddenCount} مخفی` : ""}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-4 pt-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={onHideAll}>
              مخفی کردن همه
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onShowAll}>
              نمایش همه
            </Button>
          </div>
          <ToggleGrid
            items={group.items}
            hiddenPages={hiddenPages}
            onToggle={onToggleItem}
          />
        </div>
      )}
    </Card>
  );
}

export default function HiddenPagesSection({
  hiddenPages,
  onChange,
  onSave,
  saving,
}: HiddenPagesSectionProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([
    "pages",
    "home",
    "profile",
    "chrome",
  ]);

  const toggle = (id: string) => {
    if (hiddenPages.includes(id)) {
      onChange(hiddenPages.filter((p) => p !== id));
    } else {
      onChange([...hiddenPages, id]);
    }
  };

  const toggleGroupOpen = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const hideGroup = (group: HidableGroup) => {
    const ids = new Set(hiddenPages);
    group.items.forEach((i) => ids.add(i.id));
    onChange([...ids]);
  };

  const showGroup = (group: HidableGroup) => {
    const remove = new Set(group.items.map((i) => i.id));
    onChange(hiddenPages.filter((id) => !remove.has(id)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">مدیریت نمایش همه‌چیز</h2>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground">
            صفحات، بخش‌های هر صفحه، منوی پنل کاربر و ابزارهای شناور را از اینجا
            مخفی یا نمایش دهید. ادمین کنترل کامل روی ظاهر سایت و پنل کاربر دارد.
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

      <div className="space-y-2">
        {HIDABLE_GROUPS.map((group) => (
          <GroupBlock
            key={group.id}
            group={group}
            open={openGroups.includes(group.id)}
            onToggleOpen={() => toggleGroupOpen(group.id)}
            hiddenPages={hiddenPages}
            onToggleItem={toggle}
            onHideAll={() => hideGroup(group)}
            onShowAll={() => showGroup(group)}
          />
        ))}
      </div>

      {hiddenPages.length > 0 && (
        <Card className="p-3 text-xs text-muted-foreground">
          مجموعاً {hiddenPages.length} مورد مخفی است.
        </Card>
      )}
    </div>
  );
}
