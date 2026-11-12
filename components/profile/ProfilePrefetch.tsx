"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/hooks/useUser";
import { getCurrentUser } from "@/lib/services/user-service";

/**
 * Warm only the shared identity query. The former seven simultaneous
 * prefetches hit every profile endpoint on every entry, even for unused tabs.
 * The mounted tab fetches its own data when it actually needs it.
 */
export default function ProfilePrefetch() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: userKeys.me(),
      queryFn: getCurrentUser,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return null;
}
