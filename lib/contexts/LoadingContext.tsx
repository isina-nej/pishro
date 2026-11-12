"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Manual pending work tracking. No global MutationObserver, artificial
 * 2-second auto-hide, or route-change polling that can leave ghost loaders.
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const pending = useRef(0);

  const setIsLoading = useCallback((value: boolean) => {
    pending.current = value ? 1 : 0;
    setLoading(value);
  }, []);

  const startLoading = useCallback(() => {
    pending.current += 1;
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    pending.current = Math.max(0, pending.current - 1);
    if (pending.current === 0) setLoading(false);
  }, []);

  const context = useMemo(
    () => ({ isLoading, setIsLoading, startLoading, stopLoading }),
    [isLoading, setIsLoading, startLoading, stopLoading]
  );

  return <LoadingContext.Provider value={context}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
}
