'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { DataTable } from '@/components/admin/data-table/DataTable';
import DataTableToolbar from '@/components/admin/data-table/DataTableToolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCrmTicketsList, type CrmTicket } from '@/lib/hooks/useCrmTickets';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'باز' },
  { value: 'IN_PROGRESS', label: 'در حال بررسی' },
  { value: 'WAITING_ON_CUSTOMER', label: 'در انتظار مشتری' },
  { value: 'RESOLVED', label: 'حل شده' },
  { value: 'CLOSED', label: 'بسته شده' },
] as const;

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'کم' },
  { value: 'NORMAL', label: 'عادی' },
  { value: 'HIGH', label: 'بالا' },
  { value: 'URGENT', label: 'فوری' },
] as const;

function statusBadgeVariant(status: CrmTicket['status']): 'default' | 'secondary' | 'outline' | 'success' {
  switch (status) {
    case 'OPEN':
      return 'default';
    case 'IN_PROGRESS':
      return 'secondary';
    case 'RESOLVED':
    case 'CLOSED':
      return 'success';
    default:
      return 'outline';
  }
}

function statusLabel(status: CrmTicket['status']) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function priorityLabel(priority: CrmTicket['priority']) {
  return PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority;
}

export default function CrmTicketsPage() {
  const { user, isLoading } = useAdminAuth();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [assignedToMe, setAssignedToMe] = useState(false);

  const { data, isLoading: isTicketsLoading } = useCrmTicketsList(page, 20, {
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    assignedToMe,
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const columns: ColumnDef<CrmTicket>[] = [
    {
      accessorKey: 'subject',
      header: 'موضوع',
      cell: ({ row }) => (
        <Link
          href={`/admin/crm/tickets/${row.original.id}`}
          className="font-medium text-foreground hover:underline"
        >
          {row.original.subject}
        </Link>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'مشتری',
      cell: ({ row }) => {
        const customer = row.original.customer;
        if (!customer) return <span className="text-muted-foreground">—</span>;
        const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
        return <span>{name || customer.phone}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ row }) => (
        <Badge variant={statusBadgeVariant(row.original.status)}>{statusLabel(row.original.status)}</Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'اولویت',
      cell: ({ row }) => (
        <Badge variant={row.original.priority === 'URGENT' ? 'destructive' : 'outline'}>
          {priorityLabel(row.original.priority)}
        </Badge>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'مسئول',
      cell: ({ row }) => row.original.assignedTo?.name ?? <span className="text-muted-foreground">تخصیص نیافته</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="تیکت‌های پشتیبانی"
      description="مدیریت و پیگیری تیکت‌های پشتیبانی مشتریان."
      actions={
        <Button asChild>
          <Link href="/admin/crm/tickets/new">
            <Plus className="h-4 w-4" />
            تیکت جدید
          </Link>
        </Button>
      }
    >
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <DataTableToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="جستجو در موضوع تیکت..."
          filters={
            <>
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground"
              >
                <option value="">همه وضعیت‌ها</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={priority}
                onChange={(e) => {
                  setPage(1);
                  setPriority(e.target.value);
                }}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground"
              >
                <option value="">همه اولویت‌ها</option>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                size="sm"
                variant={assignedToMe ? 'default' : 'outline'}
                onClick={() => {
                  setPage(1);
                  setAssignedToMe((prev) => !prev);
                }}
              >
                فقط تیکت‌های من
              </Button>
            </>
          }
        />

        <DataTable
          columns={columns}
          data={items}
          isLoading={isTicketsLoading}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="تیکتی یافت نشد"
          emptyDescription="با تغییر فیلترها یا جستجو دوباره تلاش کنید، یا یک تیکت جدید ثبت کنید."
        />

        {!isTicketsLoading && items.length > 0 && (
          <p className="text-xs text-muted-foreground">
            برای مشاهده و مدیریت جزئیات، روی موضوع تیکت کلیک کنید.
          </p>
        )}
      </div>
    </AdminPageShell>
  );
}
