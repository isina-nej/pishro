"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  applyPaletteTokensToElement,
  type PaletteMode,
  type PaletteTokens,
} from "@/lib/theme/landing-palettes";
import { cn } from "@/lib/utils";

type UserPanelThemeShellProps = {
  paletteId: string;
  light: PaletteTokens;
  dark: PaletteTokens;
  className?: string;
  children: React.ReactNode;
};

/**
 * Profile shell: `.royal-theme` scope + admin-selected panel palette tokens.
 */
export default function UserPanelThemeShell({
  paletteId,
  light,
  dark,
  className,
  children,
}: UserPanelThemeShellProps) {
  const { resolvedTheme } = useTheme();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const mode: PaletteMode = resolvedTheme === "dark" ? "dark" : "light";
    const tokens = mode === "dark" ? dark : light;
    applyPaletteTokensToElement(el, tokens);
    el.dataset.userPanelPalette = paletteId;
  }, [paletteId, light, dark, resolvedTheme]);

  return (
    <div ref={shellRef} className={cn("royal-theme", className)}>
      {children}
    </div>
  );
}
