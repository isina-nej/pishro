"use client";

import React, { useMemo, useState } from "react";
import { Search, Sparkles, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AVAILABLE_ICONS, DynamicIcon } from "@/components/site/DynamicIcon";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  hint?: string;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "finance", label: "مالی و سرمایه" },
  { id: "education", label: "آموزش" },
  { id: "trust", label: "اعتماد و امنیت" },
  { id: "contact", label: "ارتباطات" },
  { id: "social", label: "شبکه‌های اجتماعی" },
  { id: "nav", label: "منو و صفحات" },
  { id: "general", label: "عمومی" },
];

export default function IconPicker({
  value,
  onChange,
  label,
  hint,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const currentMeta = useMemo(
    () => AVAILABLE_ICONS.find((i) => i.name.toLowerCase() === (value || "").toLowerCase()),
    [value]
  );

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AVAILABLE_ICONS.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.labelFa.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  return (
    <div className="space-y-1.5" dir="rtl">
      {label && <span className="block text-xs font-semibold text-foreground">{label}</span>}
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 w-full justify-between gap-2 px-3 text-right font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <DynamicIcon name={value} className="size-4" fallback={Sparkles} />
                </div>
                <span className="truncate text-xs font-medium text-foreground">
                  {currentMeta ? `${currentMeta.labelFa} (${currentMeta.name})` : value || "انتخاب آیکن..."}
                </span>
              </div>
              <span className="text-[11px] text-primary underline">تغییر</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[360px] p-3 shadow-xl sm:w-[420px]" align="start" dir="rtl">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b pb-2">
                <p className="text-xs font-bold text-foreground">انتخاب آیکن</p>
                {value && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                  >
                    <X className="ml-1 size-3" />
                    پاک کردن
                  </Button>
                )}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی آیکن (فارسی یا انگلیسی)..."
                  className="h-8 pr-8 text-xs"
                />
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-lg px-2 py-0.5 text-[11px] font-medium transition",
                      category === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Icons Grid */}
              <div className="grid max-h-[220px] grid-cols-5 gap-1.5 overflow-y-auto p-1 sm:grid-cols-6">
                {filteredIcons.map((item) => {
                  const isSelected = item.name.toLowerCase() === (value || "").toLowerCase();
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      title={`${item.labelFa} (${item.name})`}
                      onClick={() => {
                        onChange(item.name);
                        setOpen(false);
                      }}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2 transition",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                          : "border-border/60 hover:border-primary/50 hover:bg-accent"
                      )}
                    >
                      <IconComp className="size-4 shrink-0 transition group-hover:scale-110" />
                      <span className="w-full truncate text-[10px] text-muted-foreground group-hover:text-foreground">
                        {item.labelFa}
                      </span>
                      {isSelected && (
                        <Check className="absolute -top-1 -right-1 size-3 rounded-full bg-primary text-primary-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  آیکنی با این مشخصات پیدا نشد.
                </div>
              )}

              {/* Direct manual input for any Lucide icon name */}
              <div className="border-t pt-2">
                <p className="mb-1 text-[10px] text-muted-foreground">
                  یا نام دلخواه از کتابخانه Lucide را بنویسید:
                </p>
                <div className="flex gap-1.5">
                  <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    dir="ltr"
                    placeholder="e.g. ShieldCheck"
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
