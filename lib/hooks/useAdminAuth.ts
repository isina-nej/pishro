'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

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
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: adminAuthKeys.me(),
    queryFn: async () => {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        router.push('/admin/login');
        return null;
      }

      try {
        const { data } = await api.get('/api/admin/auth/me');
        return data.user as AdminUser;
      } catch (error) {
        console.error('Error fetching admin user:', error);
        clearSession();
        router.push('/admin/login');
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/admin/auth/logout');
    },
    onSettled: () => {
      clearSession();
      queryClient.setQueryData(adminAuthKeys.me(), null);
      router.push('/admin/login');
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync().catch(() => undefined);
  }, [logoutMutation]);

  return { user: user ?? null, isLoading, logout };
}
