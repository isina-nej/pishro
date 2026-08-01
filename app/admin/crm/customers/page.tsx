'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { DataTable } from '@/components/admin/data-table/DataTable';
import DataTableToolbar from '@/components/admin/data-table/DataTableToolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CrmCustomerListItem,
  useCrmCustomersList,
} from '@/lib/hooks/useCrmCustomer';

export const dynamic = 'force-dynamic';

const ROLE_OPTIONS = [
  { value: 'all', label: 'همه نقش‌ها' },
  { value: 'USER', label: 'کاربر' },
  { value: 'ADMIN', label: 'مدیر' },
];

const VERIFIED_OPTIONS = [
  { value: 'all', label: 'وضعیت تلفن' },
  { value: 'true', label: 'تایید شده' },
  { value: 'false', label: 'تایید نشده' },
];

export default function CrmCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [phoneVerified, setPhoneVerified] = useState('all');
  const limit = 20;

  const filters = useMemo(
    () => ({
      ...(search ? { search } : {}),
      ...(role !== 'all' ? { role } : {}),
      ...(phoneVerified !== 'all' ? { phoneVerified } : {}),
    }),
    [search, role, phoneVerified]
  );

  const { data, isLoading } = useCrmCustomersList(page, limit, filters);

  const columns = useMemo<ColumnDef<CrmCustomerListItem, unknown>[]>(
    () => [
      {
        id: 'name',
        header: 'نام مشتری',
        cell: ({ row }) => {
          const c = row.original;
          const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ');
          return (
            <div className="text-right">
              <p className="font-medium text-foreground">{fullName || 'بدون نام'}</p>
              <p className="text-xs text-muted-foreground">{c.email || '—'}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'شماره تلفن',
        cell: ({ row }) => (
          <div className="text-right">
            <p>{row.original.phone}</p>
            <Badge variant={row.original.phoneVerified ? 'success' : 'outline'} className="mt-1">
              {row.original.phoneVerified ? 'تایید شده' : 'تایید نشده'}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'نقش',
        cell: ({ row }) => (
          <Badge variant={row.original.role === 'ADMIN' ? 'premium' : 'secondary'}>
            {row.original.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
          </Badge>
        ),
      },
      {
        id: 'activity',
        header: 'فعالیت',
        cell: ({ row }) => {
          const { _count } = row.original;
          return (
            <div className="text-right text-xs text-muted-foreground">
              <p>{_count.orders.toLocaleString('fa-IR')} سفارش</p>
              <p>{_count.enrollments.toLocaleString('fa-IR')} ثبت‌نام</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'تاریخ عضویت',
        cell: ({ row }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString('fa-IR')
            : '—',
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/crm/customers/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              مشاهده
            </Link>
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <AdminPageShell
      title="مشتریان"
      description="مدیریت پروفایل مشتریان، سفارش‌ها، تراکنش‌ها و فعالیت‌های CRM."
    >
      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="جستجو بر اساس نام، شماره تلفن یا ایمیل..."
          filters={
            <>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="نقش" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={phoneVerified}
                onValueChange={(value) => {
                  setPhoneVerified(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="وضعیت تلفن" />
                </SelectTrigger>
                <SelectContent>
                  {VERIFIED_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          }
        />

        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          pagination={data?.pagination}
          onPageChange={setPage}
          emptyTitle="مشتری‌ای یافت نشد"
          emptyDescription="با تغییر جستجو یا فیلترها دوباره تلاش کنید."
        />
      </div>
    </AdminPageShell>
  );
}
