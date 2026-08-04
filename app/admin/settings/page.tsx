"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Moon, Palette, Save, Sun, Monitor } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLoadingState, AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import {
  LANDING_PALETTES,
  DEFAULT_PALETTE_ID,
  DEFAULT_THEME_MODE,
  type SiteThemeMode,
} from "@/lib/theme/landing-palettes";
import { cn } from "@/lib/utils";

type SettingsPayload = {
  paletteId?: string;
  themeMode?: string;
  siteName?: string | null;
  supportPhone?: string | null;
  zarinpalMerchantId?: string | null;
};

async function fetchSettings(): Promise<SettingsPayload> {
  const res = await fetch("/api/admin/settings", { credentials: "include" });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در دریافت تنظیمات");
  }
  return json.data as SettingsPayload;
}

async function saveSettings(body: {
  paletteId: string;
  themeMode: SiteThemeMode;
}): Promise<SettingsPayload> {
  const res = await fetch("/api/admin/settings", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "خطا در ذخیره تنظیمات");
  }
  return json.data as SettingsPayload;
}

export default function AdminSettingsPage() {
  const { user, isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [themeMode, setThemeMode] = useState<SiteThemeMode>(DEFAULT_THEME_MODE);
  const [savedPaletteId, setSavedPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [savedThemeMode, setSavedThemeMode] =
    useState<SiteThemeMode>(DEFAULT_THEME_MODE);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSettings();
        if (cancelled) return;
        const nextPalette = data.paletteId || DEFAULT_PALETTE_ID;
        const nextMode =
          data.themeMode === "light" ||
          data.themeMode === "dark" ||
          data.themeMode === "system"
            ? data.themeMode
            : DEFAULT_THEME_MODE;
        setPaletteId(nextPalette);
        setThemeMode(nextMode);
        setSavedPaletteId(nextPalette);
        setSavedThemeMode(nextMode);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "خطا در بارگذاری");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const dirty =
    paletteId !== savedPaletteId || themeMode !== savedThemeMode;

  const selected = useMemo(
    () => LANDING_PALETTES.find((p) => p.id === paletteId) ?? LANDING_PALETTES[0],
    [paletteId]
  );

  const previewTokens =
    previewMode === "dark" ? selected.dark : selected.light;

  const onSave = async () => {
    setSaving(true);
    try {
      const data = await saveSettings({ paletteId, themeMode });
      setSavedPaletteId(data.paletteId || paletteId);
      setSavedThemeMode(
        (data.themeMode as SiteThemeMode) || themeMode
      );
      toast.success("پالت رنگی سایت ذخیره شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <AdminLoadingState label="در حال بارگذاری تنظیمات..." />;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <AdminPageShell title="تنظیمات" description="دسترسی محدود">
        <Card className="p-6 text-sm text-muted-foreground">
          فقط ادمین می‌تواند ظاهر سایت را مدیریت کند.
        </Card>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="ظاهر سایت"
      description="پالت رنگی عمومی سایت را انتخاب و ذخیره کنید. پس از ذخیره، روی لندینگ و صفحات عمومی اعمال می‌شود."
      actions={
        <Button
          onClick={onSave}
          disabled={!dirty || saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره تغییرات
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">پالت رنگی</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {LANDING_PALETTES.map((palette, index) => {
              const active = palette.id === paletteId;
              const swatch = palette.light;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setPaletteId(palette.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-right transition",
                    active
                      ? "border-primary ring-2 ring-primary/25"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className="mb-3 h-16 overflow-hidden rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${swatch.homeDeep} 0%, ${swatch.homeGlow} 55%, ${swatch.homeGold} 100%)`,
                    }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">
                        {index + 1}. {palette.nameFa}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {palette.name} — {palette.description}
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

        <div className="space-y-4">
          <Card className="space-y-4 p-4 sm:p-5">
            <h2 className="text-sm font-bold">حالت پیش‌فرض تم</h2>
            <p className="text-xs leading-6 text-muted-foreground">
              برای بازدیدکنندهٔ جدید اعمال می‌شود. کاربر همچنان می‌تواند با
              دکمهٔ تم در هدر بین لایت و دارک جابه‌جا شود؛ پالت ذخیره‌شده برای
              هر دو حالت استفاده می‌شود.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "light", label: "لایت", icon: Sun },
                  { id: "dark", label: "دارک", icon: Moon },
                  { id: "system", label: "سیستم", icon: Monitor },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThemeMode(id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition",
                    themeMode === id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-bold">پیش‌نمایش پالت</h2>
              <div className="flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("light")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-bold",
                    previewMode === "light"
                      ? "bg-card shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  لایت
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("dark")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-bold",
                    previewMode === "dark"
                      ? "bg-card shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  دارک
                </button>
              </div>
            </div>
            <div
              className="space-y-4 p-5"
              style={{
                background: previewTokens.homeBg,
                color: previewTokens.homeInk,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-lg font-extrabold"
                  style={{ color: previewTokens.homeDeep }}
                >
                  پیشرو
                </span>
                <span
                  className="text-xs"
                  style={{ color: previewTokens.homeMuted }}
                >
                  {selected.nameFa}
                </span>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{
                  background: `linear-gradient(145deg, ${previewTokens.homeDeep}, ${previewTokens.homeGlow})`,
                  color: previewTokens.homeOnDark,
                }}
              >
                <p className="text-sm font-bold">مسیر رشد مالی با پیشرو</p>
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: previewTokens.homeOnDarkMuted }}
                >
                  آموزش و سرمایه‌گذاری در یک تجربهٔ یکپارچه
                </p>
                <div className="mt-3 flex gap-2">
                  <span
                    className="rounded-full px-3 py-1.5 text-[11px] font-bold"
                    style={{
                      background: previewTokens.homeBg,
                      color: previewTokens.homeDeep,
                    }}
                  >
                    شروع یادگیری
                  </span>
                  <span
                    className="rounded-full border px-3 py-1.5 text-[11px] font-bold"
                    style={{
                      borderColor: "rgba(255,255,255,0.35)",
                      color: previewTokens.homeOnDark,
                    }}
                  >
                    طرح‌ها
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  previewTokens.homeBg,
                  previewTokens.homeDeep,
                  previewTokens.homeGlow,
                  previewTokens.homeGold,
                ].map((hex) => (
                  <span
                    key={hex}
                    className="h-8 flex-1 rounded-lg border border-black/5"
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </Card>

          {dirty && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              تغییرات ذخیره نشده‌اند. برای اعمال روی سایت عمومی «ذخیره تغییرات»
              را بزنید.
            </p>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
