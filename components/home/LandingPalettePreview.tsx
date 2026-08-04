"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, X, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LANDING_PALETTES,
  PALETTE_STORAGE_KEY,
  applyPaletteTokens,
  clearPaletteTokens,
  type PaletteMode,
} from "@/lib/theme/landing-palettes";
import { cn } from "@/lib/utils";

type StoredPreview = {
  paletteId: string;
  mode: PaletteMode;
  open: boolean;
};

function readStored(): StoredPreview | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PALETTE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPreview;
  } catch {
    return null;
  }
}

function writeStored(value: StoredPreview) {
  try {
    sessionStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function readQuery(): Partial<StoredPreview> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const paletteId = params.get("palette") || undefined;
  const modeParam = params.get("mode");
  const mode =
    modeParam === "light" || modeParam === "dark" ? modeParam : undefined;
  const preview = params.get("previewPalettes");
  const open =
    preview === "0" || preview === "false"
      ? false
      : preview === "1" || preview === "true" || Boolean(paletteId)
        ? true
        : undefined;
  return { paletteId, mode, open };
}

export default function LandingPalettePreview() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [paletteId, setPaletteId] = useState(LANDING_PALETTES[0].id);
  const [mode, setMode] = useState<PaletteMode>("light");

  const palette =
    LANDING_PALETTES.find((p) => p.id === paletteId) ?? LANDING_PALETTES[0];
  const index = LANDING_PALETTES.findIndex((p) => p.id === palette.id);

  const apply = useCallback(
    (id: string, nextMode: PaletteMode) => {
      const p = LANDING_PALETTES.find((item) => item.id === id);
      if (!p) return;
      const tokens = nextMode === "dark" ? p.dark : p.light;
      applyPaletteTokens(document.documentElement, tokens);
      document.documentElement.dataset.previewPalette = id;
      document.documentElement.dataset.previewMode = nextMode;
      setTheme(nextMode);
    },
    [setTheme]
  );

  useEffect(() => {
    const stored = readStored();
    const query = readQuery();
    const nextId =
      query.paletteId && LANDING_PALETTES.some((p) => p.id === query.paletteId)
        ? query.paletteId
        : stored?.paletteId && LANDING_PALETTES.some((p) => p.id === stored.paletteId)
          ? stored.paletteId
          : LANDING_PALETTES[0].id;
    const nextMode: PaletteMode =
      query.mode ?? stored?.mode ?? (resolvedTheme === "dark" ? "dark" : "light");
    const nextOpen = query.open ?? stored?.open ?? true;

    setPaletteId(nextId);
    setMode(nextMode);
    setOpen(nextOpen);
    apply(nextId, nextMode);
    setMounted(true);

    return () => {
      clearPaletteTokens(document.documentElement);
      delete document.documentElement.dataset.previewPalette;
      delete document.documentElement.dataset.previewMode;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once on mount
  }, []);

  useEffect(() => {
    if (!mounted) return;
    writeStored({ paletteId, mode, open });
    const url = new URL(window.location.href);
    url.searchParams.set("previewPalettes", open ? "1" : "0");
    url.searchParams.set("palette", paletteId);
    url.searchParams.set("mode", mode);
    window.history.replaceState({}, "", url.toString());
  }, [mounted, paletteId, mode, open]);

  const selectPalette = (id: string) => {
    setPaletteId(id);
    apply(id, mode);
  };

  const selectMode = (next: PaletteMode) => {
    setMode(next);
    apply(paletteId, next);
  };

  const step = (dir: -1 | 1) => {
    const next =
      LANDING_PALETTES[(index + dir + LANDING_PALETTES.length) % LANDING_PALETTES.length];
    selectPalette(next.id);
  };

  if (!mounted) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[80] flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur-md"
        aria-label="باز کردن پیش‌نمایش پالت‌ها"
      >
        <Palette className="h-4 w-4 text-primary" />
        پالت‌ها ({LANDING_PALETTES.length})
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl sm:right-auto sm:w-[min(100%,28rem)]"
      dir="rtl"
      aria-label="پیش‌نمایش پالت رنگی لندینگ"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold text-premium">
            پیش‌نمایش روی لندینگ واقعی · {index + 1}/{LANDING_PALETTES.length}
          </p>
          <h2 className="mt-0.5 text-sm font-bold">
            {palette.nameFa}
            <span className="mr-2 text-xs font-medium text-muted-foreground">
              {palette.name}
            </span>
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {palette.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="بستن"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => step(-1)}
          className="rounded-lg border border-border p-2 hover:bg-muted"
          aria-label="پالت قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5">
          {LANDING_PALETTES.map((p, i) => {
            const swatch = mode === "dark" ? p.dark : p.light;
            const active = p.id === palette.id;
            return (
              <button
                key={p.id}
                type="button"
                title={`${i + 1}. ${p.nameFa}`}
                onClick={() => selectPalette(p.id)}
                className={cn(
                  "relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 transition",
                  active ? "border-primary ring-2 ring-primary/30" : "border-border"
                )}
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.homeDeep} 0%, ${swatch.homeGlow} 55%, ${swatch.homeGold} 100%)`,
                  }}
                />
                <span className="absolute bottom-0 left-0 right-0 bg-black/35 text-center text-[9px] font-bold text-white">
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          className="rounded-lg border border-border p-2 hover:bg-muted"
          aria-label="پالت بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <div className="flex flex-1 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => selectMode("light")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition",
              mode === "light"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            لایت
          </button>
          <button
            type="button"
            onClick={() => selectMode("dark")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition",
              mode === "dark"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            دارک
          </button>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          {[
            palette[mode].homeBg,
            palette[mode].homeDeep,
            palette[mode].homeGlow,
            palette[mode].homeGold,
          ].map((hex) => (
            <span
              key={hex}
              className="h-6 w-6 rounded-md border border-border"
              style={{ background: hex }}
              title={hex}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
