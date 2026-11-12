"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Only show progress when navigation is truly slow. The old indicator fired
 * after the new pathname had already rendered, producing a false loading flash.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      delayTimer.current = null;
      safetyTimer.current = null;
    };

    // A committed route means the pending navigation is done.
    setVisible(false);
    clearTimers();

    const start = () => {
      clearTimers();
      delayTimer.current = setTimeout(() => setVisible(true), 180);
      // A cancelled/failed route must never leave an overlay on the screen.
      safetyTimer.current = setTimeout(() => {
        setVisible(false);
        clearTimers();
      }, 15000);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") ||
          anchor.dataset.noProgress !== undefined ||
          (anchor.target && anchor.target !== "_self")) return;

      let url: URL;
      try { url = new URL(anchor.href, window.location.href); } catch { return; }
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
        start();
      }
    };

    const onPopState = () => {
      if (window.location.pathname !== pathname) start();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [pathname]);

  if (!visible) return null;
  return (
    <div className="route-progress-track" role="progressbar" aria-label="در حال باز کردن صفحه">
      <span className="route-progress-bar" />
    </div>
  );
}
