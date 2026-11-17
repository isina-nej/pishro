"use client";

import { useEffect } from "react";

const SPLASH_ID = "site-boot-splash";

/** The splash is dismissed when the client has hydrated, never after an arbitrary dwell time. */
function dismissSplash() {
  const splash = document.getElementById(SPLASH_ID);
  if (!splash || splash.classList.contains("is-done")) return;
  splash.classList.add("is-done");
  window.setTimeout(() => splash.remove(), 240);
}

export default function BootSplashDismiss() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(dismissSplash);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
