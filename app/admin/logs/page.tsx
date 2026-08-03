/**
 * Admin Activity Log
 *
 * Page: /admin/logs
 * گزارش تمام عملیات ثبت‌شده در پنل، با فیلتر بر اساس نوع عمل، بخش، ادمین و بازه زمانی.
 */

'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns-jalali';
import { RefreshCw, Search, X } from 'lucide-react';
import { AdminPageShell, AdminEmptyState } from '@/components/admin/AdminPageShell';
import { AdminLoadingState } from '@/components/admin/AdminPageShell';
import { DataTable } from '@/components/admin/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useAuditLogs,
  useAuditFilterOptions,
  type AuditLogEntry,
  type AuditLogFilterState,
  type AuditActionValue,
} from '@/lib/hooks/useAuditLogs';
import type { ColumnDef } from '@tanstack/react-table';

/** برچسب فارسی و رنگ هر عمل */
const ACTION_META: Record<
  AuditActionValue,
  { label: string; className: string }
> = {
  CREATE: { label: 'ایجاد', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  UPDATE: { label: 'ویرایش', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  DELETE: { label: 'حذف', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  ARCHIVE: { label: 'آرشیو', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  RESTORE: { label: 'فعال‌سازی', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  PUBLISH: { label: 'انتشار', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
  UNPUBLISH: { label: 'لغو انتشار', className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
  LOGIN: { label: 'ورود', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  LOGIN_FAILED: { label: 'ورود ناموفق', className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  LOGOUT: { label: 'خروج', className: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
};

/** نام فارسی مدل‌ها، برای اینکه ستون «بخش» به کاربر «NewsArticle» نشان ندهد */
const ENTITY_LABELS: Record<string, string> = {
  NewsArticle: 'خبر',
  Course: 'دوره',
  DigitalBook: 'کتاب',
  InvestmentFund: 'صندوق سرمایه‌گذاری',
  User: 'مشتری',
  Lead: 'سرنخ',
  Deal: 'معامله',
  SupportTicket: 'تیکت',
  CustomerSegment: 'بخش مشتریان',
  AdminUser: 'کاربر ادمین',
};

const ALL = '__all__';

export default function AdminLogsPage() {
  const { user, isLoading: isLoadingUser } = useAdminAuth();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<AuditLogFilterState>({});

  const { data, isLoading, isFetching, refetch } = useAuditLogs(page, 50, filters);
  const { data: options } = useAuditFilterOptions();

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const setFilter = (key: keyof AuditLogFilterState, value: string) => {
    setPage(1);
    setFilters((prev) => {
      const next = { ...prev };
      if (!value || value === ALL) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const applySearch = () => setFilter('search', searchInput.trim());

  const clearAll = () => {
    setSearchInput('');
    setFilters({});
    setPage(1);
  };

  const hasFilters = Object.keys(filters).length > 0;

  const columns = useMemo<ColumnDef<AuditLogEntry, unknown>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'زمان',
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return (
            <div className="whitespace-nowrap text-xs leading-5">
              <div>{format(date, 'yyyy/MM/dd')}</div>
              <div className="text-slate-500">{format(date, 'HH:mm:ss')}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'عمل',
        cell: ({ row }) => {
          const meta = ACTION_META[row.original.action];
          return (
            <Badge variant="secondary" className={meta?.className}>
              {meta?.label ?? row.original.action}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'entityType',
        header: 'بخش',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            {ENTITY_LABELS[row.original.entityType] ?? row.original.entityType}
          </span>
        ),
      },
      {
        accessorKey: 'entityLabel',
        header: 'رکورد',
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="truncate text-sm" title={row.original.entityLabel ?? ''}>
              {row.original.entityLabel || '—'}
            </p>
            {row.original.entityId && (
              <p className="truncate font-mono text-[11px] text-slate-400">
                {row.original.entityId}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'adminName',
        header: 'ادمین',
        cell: ({ row }) => (
          // نام فعلی حساب را ترجیح می‌دهیم، ولی اگر حساب حذف شده باشد
          // snapshot لحظه‌ی عمل تنها چیزی است که مانده.
          <span className="whitespace-nowrap text-sm">
            {row.original.admin?.name || row.original.adminName || 'نامشخص'}
          </span>
        ),
      },
      {
        accessorKey: 'batchSize',
        header: 'گروهی',
        cell: ({ row }) =>
          row.original.batchSize && row.original.batchSize > 1 ? (
            <Badge variant="outline">
              {row.original.batchSize.toLocaleString('fa-IR')} تایی
            </Badge>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      {
        accessorKey: 'ip',
        header: 'IP',
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-mono text-xs text-slate-500">
            {row.original.ip || '—'}
          </span>
        ),
      },
    ],
    []
  );

  if (isLoadingUser) {
    return <AdminLoadingState label="در حال بارگذاری گزارش..." />;
  }

  if (!user) return null;

  return (
    <AdminPageShell
      title="گزارش فعالیت‌ها"
      description="هر عملیاتی که در پنل انجام می‌شود اینجا ثبت می‌شود — چه کسی، چه زمانی، روی چه رکوردی."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`ml-1 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          به‌روزرسانی
        </Button>
      }
    >
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-background p-3">
        <div className="flex min-w-52 flex-1 items-center gap-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            placeholder="جستجو در عنوان رکورد، نام ادمین یا شناسه"
            className="h-9"
          />
          <Button size="sm" variant="secondary" onClick={applySearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={filters.action ?? ALL}
          onValueChange={(v) => setFilter('action', v)}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="نوع عمل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>همه عمل‌ها</SelectItem>
            {(Object.keys(ACTION_META) as AuditActionValue[]).map((a) => (
              <SelectItem key={a} value={a}>
                {ACTION_META[a].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.entityType ?? ALL}
          onValueChange={(v) => setFilter('entityType', v)}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="بخش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>همه بخش‌ها</SelectItem>
            {(options?.entityTypes ?? []).map((t) => (
              <SelectItem key={t} value={t}>
                {ENTITY_LABELS[t] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.adminId ?? ALL}
          onValueChange={(v) => setFilter('adminId', v)}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue placeholder="ادمین" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>همه ادمین‌ها</SelectItem>
            {(options?.admins ?? []).map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.from ?? ''}
          onChange={(e) => setFilter('from', e.target.value)}
          className="h-9 w-40"
          aria-label="از تاریخ"
        />
        <Input
          type="date"
          value={filters.to ?? ''}
          onChange={(e) => setFilter('to', e.target.value)}
          className="h-9 w-40"
          aria-label="تا تاریخ"
        />

        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={clearAll}>
            <X className="ml-1 h-4 w-4" />
            پاک کردن فیلترها
          </Button>
        )}
      </div>

      {!isLoading && items.length === 0 ? (
        <AdminEmptyState
          title={hasFilters ? 'با این فیلترها چیزی پیدا نشد' : 'هنوز فعالیتی ثبت نشده'}
          description={
            hasFilters
              ? 'فیلترها را تغییر دهید یا پاکشان کنید.'
              : 'به محض اولین عملیات در پنل، اینجا ثبت می‌شود.'
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="گزارشی یافت نشد"
        />
      )}
    </AdminPageShell>
  );
}
