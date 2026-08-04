"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  getLandingPalette,
  resolvePaletteId,
  applyPaletteTokens,
  type PaletteMode,
} from "@/lib/theme/landing-palettes";

type SitePaletteApplierProps = {
  paletteId: string;
};

/**
 * Applies the admin-selected palette tokens to the document.
 * Light/dark token set follows the user's resolved next-themes mode.
 */
export default function SitePaletteApplier({
  paletteId,
}: SitePaletteApplierProps) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const id = resolvePaletteId(paletteId);

  useEffect(() => {
    const palette = getLandingPalette(id);
    if (!palette) return;

    const mode: PaletteMode = resolvedTheme === "dark" ? "dark" : "light";
    const tokens = mode === "dark" ? palette.dark : palette.light;

    const apply = () => {
      applyPaletteTokens(document.documentElement, tokens);
      document.documentElement.dataset.sitePalette = id;
    };

    apply();
    // home-shell may mount a frame later on soft navigations
    const raf = requestAnimationFrame(apply);
    const t = window.setTimeout(apply, 50);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [id, resolvedTheme, pathname]);

  return null;
}
