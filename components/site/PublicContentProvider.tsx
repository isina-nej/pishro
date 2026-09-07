"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { PublicContentOverrides } from "@/lib/site/public-content";

const PublicContentContext = createContext<PublicContentOverrides>({});

export function PublicContentProvider({
  content,
  children,
}: {
  content: PublicContentOverrides;
  children: ReactNode;
}) {
  return (
    <PublicContentContext.Provider value={content}>
      {children}
    </PublicContentContext.Provider>
  );
}

export function usePublicContent(pageId: string) {
  const content = useContext(PublicContentContext);
  return content[pageId] ?? {};
}

export function usePublicCopy(pageId: string) {
  const page = usePublicContent(pageId);
  return useMemo(
    () => (key: string, fallback = "") => page[key] ?? fallback,
    [page]
  );
}
