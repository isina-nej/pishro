'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, clearAdminSession } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

interface UseAdminAuthResult {
  user: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const adminAuthKeys = {
  all: ['admin-auth'] as const,
  me: () => [...adminAuthKeys.all, 'me'] as const,
};

/**
 * Backed by React Query so every consumer (the shared admin shell + any
 * individual page that still reads `user`) shares one cached request instead
 * of each page firing its own /api/admin/auth/me call.
 */
export function useAdminAuth(): UseAdminAuthResult {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: adminAuthKeys.me(),
    queryFn: async () => {
      // Deliberately does NOT gate on localStorage having a token. The session
      // also lives in the `admin_access_token` cookie, which the browser sends
      // automatically and which `middleware.ts` treats as authenticated. If the
      // two ever diverge (cleared site data, another tab, an older build), a
      // localStorage-only check declares "logged out" while middleware keeps
      // redirecting /admin/login back here — leaving the shell rendering
      // nothing at all. Let /api/admin/auth/me be the single source of truth:
      // the request interceptor attaches a Bearer token when localStorage has
      // one, and the cookie covers the case where it doesn't.
      try {
        const { data } = await api.get('/api/admin/auth/me');
        return data.user as AdminUser;
      } catch (error) {
        console.error('Error fetching admin user:', error);
        // Clears the cookie too, so /admin/login is actually reachable.
        clearAdminSession();
        router.push('/admin/login');
        return null;
      }
    },
    // Never run (or cache a "logged out" result for) this query while sitting
    // on the login page — otherwise a successful login's client-side redirect
    // to /admin/dashboard lands on a query cache that was poisoned with `null`
    // before the login happened, and stays that way until staleTime expires.
    enabled: pathname !== '/admin/login',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/admin/auth/logout');
    },
    onSettled: () => {
      clearAdminSession();
      queryClient.setQueryData(adminAuthKeys.me(), null);
      router.push('/admin/login');
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync().catch(() => undefined);
  }, [logoutMutation]);

  return { user: user ?? null, isLoading, logout };
}
