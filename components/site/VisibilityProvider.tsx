"use client";

import { createContext, useContext, useMemo } from "react";
import { createVisibility } from "@/lib/site/hidable-pages";

type VisibilityApi = ReturnType<typeof createVisibility>;

const VisibilityContext = createContext<VisibilityApi | null>(null);

export function VisibilityProvider({
  hiddenPages,
  children,
}: {
  hiddenPages: string[];
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => createVisibility(hiddenPages),
    [hiddenPages]
  );
  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility(): VisibilityApi {
  const ctx = useContext(VisibilityContext);
  if (!ctx) {
    return createVisibility([]);
  }
  return ctx;
}

export function useIsVisible(id: string): boolean {
  const { show } = useVisibility();
  return show(id);
}
