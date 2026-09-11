"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Show a loader only if the pending state persists longer than `delayMs`.
 * Avoids spinner flash on fast (<300ms) loads.
 */
export function useDelayedLoading(active: boolean, delayMs = 350) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(t);
  }, [active, delayMs]);

  return show;
}

/**
 * Icon-only spinner. No visible text by design —
 * screen readers get the aria-label.
 */
export function LoadingSpinner({
  className,
  size = 40,
  label = "بارگذاری",
}: {
  className?: string;
  size?: number;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
