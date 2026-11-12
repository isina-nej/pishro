"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Delay short loading states, preventing distracting flashes on cached responses. */
export function useDelayedLoading(active: boolean, delayMs = 250) {
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

export function LoadingSpinner({
  className,
  size = 40,
  label = "در حال بارگذاری",
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
      className={cn("inline-flex items-center justify-center", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rotate-12 rounded-[35%] border border-primary/25" />
        <div className="absolute inset-[5px] animate-spin rounded-full border-[3px] border-transparent border-r-[hsl(var(--premium))] border-t-primary motion-reduce:animate-none" />
      </div>
    </div>
  );
}
