"use client";

import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_USER_PANEL_PALETTE_ID,
  LANDING_PALETTES,
  type LandingPalette,
} from "@/lib/theme/landing-palettes";
import { cn } from "@/lib/utils";

type CustomPaletteItem = {
  paletteId: string;
  nameFa: string;
  description: string;
  light: LandingPalette["light"];
};

type UserPanelPaletteSectionProps = {
  userPanelPaletteId: string;
  customs: CustomPaletteItem[];
  onChange: (id: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

export default function UserPanelPaletteSection({
  userPanelPaletteId,
  customs,
  onChange,
  onSave,
  saving,
}: UserPanelPaletteSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold">پالت رنگی پنل کاربر</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            این پالت فقط روی پنل کاربر (`/profile`) اعمال می‌شود. پالت «سبز
            سلطنتی» همان ظاهر فعلی پنل است؛ می‌توانید از پالت‌های آماده یا سفارشی
            ظاهر سایت هم استفاده کنید.
          </p>
        </div>
        <Button onClick={() => void onSave()} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره پالت پنل
        </Button>
      </div>

      <Card className="space-y-3 p-4">
        <h3 className="text-xs font-bold text-muted-foreground">پالت‌های آماده</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_PALETTES.map((palette) => {
            const active = palette.id === userPanelPaletteId;
            const isDefault = palette.id === DEFAULT_USER_PANEL_PALETTE_ID;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => onChange(palette.id)}
                className={cn(
                  "rounded-2xl border p-3 text-right transition",
                  active
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div
                  className="mb-3 h-12 overflow-hidden rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${palette.light.homeDeep} 0%, ${palette.light.homeGlow} 55%, ${palette.light.homeGold} 100%)`,
                  }}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{palette.nameFa}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {isDefault ? "پیش‌فرض فعلی پنل · " : ""}
                      {palette.description}
                    </p>
                  </div>
                  {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <h3 className="text-xs font-bold text-muted-foreground">
          پالت‌های سفارشی (همان‌هایی که در ظاهر سایت می‌سازید)
        </h3>
        {customs.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            هنوز پالت سفارشی ندارید. از تب «پالت سایت» یکی بسازید.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {customs.map((item) => {
              const active = item.paletteId === userPanelPaletteId;
              return (
                <button
                  key={item.paletteId}
                  type="button"
                  onClick={() => onChange(item.paletteId)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-right",
                    active
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  )}
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${item.light.homeDeep}, ${item.light.homeGlow})`,
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {item.nameFa}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.description || "سفارشی"}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
