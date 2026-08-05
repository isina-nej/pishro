"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_NAVBAR_ITEMS,
  type NavbarItem,
} from "@/lib/site/chrome-content";

type NavbarItemsSectionProps = {
  items: NavbarItem[];
  onChange: (items: NavbarItem[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function NavbarItemsSection({
  items,
  onChange,
  onSave,
  saving,
}: NavbarItemsSectionProps) {
  const updateItem = (index: number, patch: Partial<NavbarItem>) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, { label: "صفحه جدید", link: "/" }]);
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">گزینه‌های منوی صفحات</h2>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              نام نمایشی و مسیر هر گزینه منو را ویرایش کنید. ترتیب همین‌جا مشخص
              می‌شود و در دسکتاپ/موبایل اعمال می‌گردد.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                onChange(DEFAULT_NAVBAR_ITEMS.map((item) => ({ ...item })))
              }
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بازگشت به پیش‌فرض
            </Button>
            <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={addItem}>
              <Plus className="h-3.5 w-3.5" />
              افزودن
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={saving || items.length === 0}
              onClick={() => void onSave()}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              ذخیره منو
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={`${item.link}-${index}`} className="grid gap-3 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">نام گزینه</Label>
              <Input
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                placeholder="مثلاً دوره‌ها"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">مسیر / لینک</Label>
              <Input
                value={item.link}
                dir="ltr"
                onChange={(e) => updateItem(index, { link: e.target.value })}
                placeholder="/courses"
                className="font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="بالا"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="پایین"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="حذف"
                disabled={items.length <= 1}
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
