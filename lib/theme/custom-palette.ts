/**
 * Custom admin palettes — editable hex colors expanded into full PaletteTokens.
 */

import type { PaletteMode, PaletteTokens } from "@/lib/theme/landing-palettes";

export const CUSTOM_PALETTE_PREFIX = "custom:";

export type EditablePaletteColors = {
  /** Page / body background */
  bg: string;
  /** Cards / elevated surfaces */
  surface: string;
  /** Primary text */
  ink: string;
  /** Secondary / muted text */
  muted: string;
  /** Brand primary (buttons, deep) */
  primary: string;
  /** Hover / glow */
  secondary: string;
  /** Accent / premium / gold */
  accent: string;
  /** Borders */
  border: string;
};

export const EDITABLE_COLOR_FIELDS: Array<{
  key: keyof EditablePaletteColors;
  label: string;
  hint: string;
}> = [
  { key: "bg", label: "پس‌زمینه", hint: "رنگ کلی صفحه" },
  { key: "surface", label: "سطح / کارت", hint: "کارت‌ها و پنل‌ها" },
  { key: "ink", label: "متن اصلی", hint: "تیتر و متن پررنگ" },
  { key: "muted", label: "متن فرعی", hint: "توضیحات و متن کم‌رنگ" },
  { key: "primary", label: "اصلی برند", hint: "دکمه‌ها و لینک فعال" },
  { key: "secondary", label: "فرعی / هاور", hint: "حالت هاور و درخشش" },
  { key: "accent", label: "لهجه / پرمیوم", hint: "طلایی یا تأکید ویژه" },
  { key: "border", label: "حاشیه", hint: "خطوط و بوردرها" },
];

export const DEFAULT_EDITABLE_LIGHT: EditablePaletteColors = {
  bg: "#F4F7F5",
  surface: "#FFFFFF",
  ink: "#14201B",
  muted: "#5A6B62",
  primary: "#0C3F32",
  secondary: "#2A7A58",
  accent: "#C4A35A",
  border: "#CDD8D2",
};

export const DEFAULT_EDITABLE_DARK: EditablePaletteColors = {
  bg: "#0B1210",
  surface: "#121A16",
  ink: "#E7EEE9",
  muted: "#9AADA2",
  primary: "#2F9E68",
  secondary: "#1B6B4A",
  accent: "#D4B06A",
  border: "#243028",
};

export function isCustomPaletteId(id: string): boolean {
  return id.startsWith(CUSTOM_PALETTE_PREFIX);
}

export function toCustomPaletteId(dbId: string): string {
  return `${CUSTOM_PALETTE_PREFIX}${dbId}`;
}

export function customPaletteDbId(id: string): string | null {
  if (!isCustomPaletteId(id)) return null;
  const dbId = id.slice(CUSTOM_PALETTE_PREFIX.length);
  return dbId.length > 0 ? dbId : null;
}

export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const expanded = raw
      .split("")
      .map((c) => c + c)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toUpperCase()}`;
  }
  return null;
}

export function isValidEditableColors(
  value: unknown
): value is EditablePaletteColors {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return EDITABLE_COLOR_FIELDS.every((field) => {
    const hex = obj[field.key];
    return typeof hex === "string" && normalizeHex(hex) !== null;
  });
}

export function normalizeEditableColors(
  value: EditablePaletteColors
): EditablePaletteColors {
  return {
    bg: normalizeHex(value.bg)!,
    surface: normalizeHex(value.surface)!,
    ink: normalizeHex(value.ink)!,
    muted: normalizeHex(value.muted)!,
    primary: normalizeHex(value.primary)!,
    secondary: normalizeHex(value.secondary)!,
    accent: normalizeHex(value.accent)!,
    border: normalizeHex(value.border)!,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex) ?? "#000000";
  const n = normalized.slice(1);
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function hexToHslChannels(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToRgbCss(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r},${g},${b}`;
}

function mixHex(a: string, b: string, amountB: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t = Math.max(0, Math.min(1, amountB));
  return rgbToHex(
    A.r + (B.r - A.r) * t,
    A.g + (B.g - A.g) * t,
    A.b + (B.b - A.b) * t
  );
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function contrastingForeground(bg: string): string {
  return relativeLuminance(bg) > 0.45 ? "#0A0A0A" : "#FFFFFF";
}

/** Expand 8 editable hex colors into the full runtime token set. */
export function buildTokensFromEditable(
  colors: EditablePaletteColors,
  mode: PaletteMode
): PaletteTokens {
  const c = normalizeEditableColors(colors);
  const onPrimary = contrastingForeground(c.primary);
  const onAccent = contrastingForeground(c.accent);
  const bgMid =
    mode === "dark" ? mixHex(c.bg, c.primary, 0.35) : mixHex(c.bg, c.border, 0.55);
  const secondaryHover =
    mode === "dark" ? mixHex(c.border, c.ink, 0.15) : mixHex(c.border, c.muted, 0.25);
  const onDark = mode === "dark" ? c.ink : "#E8F0EB";
  const onDarkMuted = mode === "dark" ? c.muted : "#B8C5BC";

  return {
    background: hexToHslChannels(c.bg),
    foreground: hexToHslChannels(c.ink),
    card: hexToHslChannels(c.surface),
    cardForeground: hexToHslChannels(c.ink),
    primary: hexToHslChannels(c.primary),
    primaryForeground: hexToHslChannels(onPrimary),
    secondary: hexToHslChannels(
      mode === "dark" ? mixHex(c.bg, c.border, 0.6) : mixHex(c.bg, c.border, 0.8)
    ),
    secondaryForeground: hexToHslChannels(c.ink),
    muted: hexToHslChannels(
      mode === "dark" ? mixHex(c.bg, c.border, 0.6) : mixHex(c.bg, c.border, 0.8)
    ),
    mutedForeground: hexToHslChannels(c.muted),
    accent: hexToHslChannels(
      mode === "dark" ? mixHex(c.bg, c.primary, 0.2) : mixHex(c.bg, c.secondary, 0.12)
    ),
    accentForeground: hexToHslChannels(c.primary),
    border: hexToHslChannels(c.border),
    input: hexToHslChannels(c.border),
    ring: hexToHslChannels(c.primary),
    premium: hexToHslChannels(c.accent),
    premiumForeground: hexToHslChannels(onAccent),
    success: hexToHslChannels(c.secondary),
    successForeground: hexToHslChannels(contrastingForeground(c.secondary)),
    surfaceSelected: hexToHslChannels(
      mode === "dark" ? mixHex(c.bg, c.primary, 0.22) : mixHex(c.bg, c.secondary, 0.15)
    ),
    navActiveBg: hexToHslChannels(
      mode === "dark" ? mixHex(c.bg, c.primary, 0.28) : mixHex(c.bg, c.secondary, 0.18)
    ),
    iconBrand: hexToHslChannels(c.secondary),
    chart1: hexToHslChannels(c.primary),
    chart2: hexToHslChannels(c.secondary),
    chart3: hexToHslChannels(c.accent),

    brandColor: c.accent,
    bodyBackground: c.bg,
    headerBackground: withAlpha(c.bg, 0.88),
    textPrimary: c.ink,
    textSecondary: c.muted,
    btnPrimaryBg: c.primary,
    btnPrimaryHover: c.secondary,
    btnSecondaryBg: mode === "dark" ? mixHex(c.bg, c.border, 0.7) : mixHex(c.bg, c.border, 0.85),
    btnSecondaryHover: secondaryHover,
    cardBackground: c.surface,
    borderColor: c.border,
    footerBackground: mode === "dark" ? c.surface : mixHex(c.bg, c.border, 0.85),
    textMuted: c.muted,

    homeInk: c.ink,
    homeMuted: c.muted,
    homeDeep: mode === "dark" ? mixHex(c.bg, c.primary, 0.45) : c.primary,
    homeGlow: c.secondary,
    homeGold: c.accent,
    homeOnDark: onDark,
    homeOnDarkMuted: onDarkMuted,
    homeGlass: withAlpha(c.surface, 0.9),
    homeGlassBorder: withAlpha(c.border, 0.92),
    homeBg: c.bg,
    homeBgMid: bgMid,
    homeGlowRgb: hexToRgbCss(c.secondary),
    homeGoldRgb: hexToRgbCss(c.accent),
  };
}
