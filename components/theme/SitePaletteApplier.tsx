"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  applyPaletteTokens,
  type PaletteMode,
  type PaletteTokens,
} from "@/lib/theme/landing-palettes";

type SitePaletteApplierProps = {
  paletteId: string;
  light: PaletteTokens;
  dark: PaletteTokens;
};

/**
 * Applies the admin-selected palette tokens to the document.
 * Light/dark token set follows the user's resolved next-themes mode.
 */
export default function SitePaletteApplier({
  paletteId,
  light,
  dark,
}: SitePaletteApplierProps) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const mode: PaletteMode = resolvedTheme === "dark" ? "dark" : "light";
    const tokens = mode === "dark" ? dark : light;

    const apply = () => {
      applyPaletteTokens(document.documentElement, tokens);
      document.documentElement.dataset.sitePalette = paletteId;
    };

    apply();
    const raf = requestAnimationFrame(apply);
    const t = window.setTimeout(apply, 50);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [paletteId, light, dark, resolvedTheme, pathname]);

  return null;
}
