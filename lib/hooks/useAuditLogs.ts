/**
 * React Query hooks برای گزارش فعالیت‌های پنل ادمین
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { PaginatedData } from '@/lib/api-response';

export type AuditActionValue =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT';

export interface AuditLogEntry {
  id: string;
  action: AuditActionValue;
  entityType: string;
  entityId: string | null;
  entityLabel: string | null;
  adminId: string | null;
  adminName: string | null;
  batchSize: number | null;
  meta: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: { id: string; name: string; email: string } | null;
}

export interface AuditLogFilterState {
  action?: string;
  entityType?: string;
  adminId?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface AuditFilterOptions {
  entityTypes: string[];
  admins: { id: string; name: string }[];
}

interface Envelope<T> {
  status?: string;
  message?: string;
  data?: T;
}

export const auditLogKeys = {
  all: ['auditLogs'] as const,
  list: (page: number, limit: number, filters?: AuditLogFilterState) =>
    [...auditLogKeys.all, 'list', page, limit, filters] as const,
  options: () => [...auditLogKeys.all, 'options'] as const,
};

export function useAuditLogs(
  page = 1,
  limit = 50,
  filters: AuditLogFilterState = {}
) {
  return useQuery({
    queryKey: auditLogKeys.list(page, limit, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
      }

      const response = await api.get<Envelope<PaginatedData<AuditLogEntry>>>(
        `/api/admin/logs?${params.toString()}`
      );
      return response.data?.data;
    },
    // گزارش مدام رشد می‌کند، پس تازه نگه داشتنش کوتاه‌مدت است — ولی نه آن‌قدر
    // که هر بار برگشتن به تب یک درخواست بزند.
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAuditFilterOptions() {
  return useQuery({
    queryKey: auditLogKeys.options(),
    queryFn: async () => {
      const response = await api.get<Envelope<AuditFilterOptions>>(
        '/api/admin/logs?options=1'
      );
      return response.data?.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
