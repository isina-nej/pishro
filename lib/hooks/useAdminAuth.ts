'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export function useAdminAuth(): UseAdminAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
      router.push('/admin/login');
    }
  }, [clearSession, router]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');

        if (!token) {
          router.push('/admin/login');
          return;
        }

        const { data } = await api.get('/api/admin/auth/me');
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching admin user:', error);
        clearSession();
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [clearSession, router]);

  return { user, isLoading, logout };
}
