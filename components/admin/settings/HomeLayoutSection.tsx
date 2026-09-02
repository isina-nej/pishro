"use client";

import { Check, LayoutTemplate, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  HOME_LAYOUT_LABELS,
  HOME_LAYOUTS,
  type HomeLayout,
} from "@/lib/site/home-layout";

type HomeLayoutSectionProps = {
  homeLayout: HomeLayout;
  savedHomeLayout: HomeLayout;
  onChange: (layout: HomeLayout) => void;
  onSave: () => void;
  saving: boolean;
};

export default function HomeLayoutSection({
  homeLayout,
  savedHomeLayout,
  onChange,
  onSave,
  saving,
}: HomeLayoutSectionProps) {
  const dirty = homeLayout !== savedHomeLayout;

  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-sm font-bold">طرح صفحه اصلی</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              بین لندینگ کلاسیک و نسخه ۳۲ (سرمایه ساده) سوییچ کنید. رنگ‌ها از
              پالت همین تب اعمال می‌شوند.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onSave}
          disabled={!dirty || saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          ذخیره طرح
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {HOME_LAYOUTS.map((id) => {
          const active = homeLayout === id;
          const meta = HOME_LAYOUT_LABELS[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "rounded-2xl border p-4 text-right transition",
                active
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{meta.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {meta.description}
                  </p>
                  {id === "v32" && (
                    <p className="mt-2 text-[10px] font-medium text-primary">
                      پیش‌نمایش: pishro-web-design.vercel.app/32/
                    </p>
                  )}
                </div>
                {active && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
