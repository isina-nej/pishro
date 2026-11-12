"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";

// Devtools should not be shipped in the main production bundle.
const Devtools = process.env.NODE_ENV === "development"
  ? lazy(() => import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })))
  : null;

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: 0 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {Devtools && (
        <Suspense fallback={null}>
          <Devtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
