"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // زمان stale برای تمام query ها (5 دقیقه)
            staleTime: 5 * 60 * 1000,
            // زمان نگهداری cache (10 دقیقه)
            gcTime: 10 * 60 * 1000,
            // retry فقط یک بار در صورت خطا
            retry: 1,
            // refetch کردن وقتی window focus می‌شود
            refetchOnWindowFocus: false,
            // refetch کردن وقتی اینترنت دوباره وصل می‌شود
            refetchOnReconnect: true,
          },
          mutations: {
            // retry نکردن برای mutation ها به صورت پیش‌فرض
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
