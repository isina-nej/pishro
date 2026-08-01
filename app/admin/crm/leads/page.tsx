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
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_BADGE_VARIANT,
  LEAD_STATUS_LABELS,
  useCrmLeadsList,
  type CrmLeadListItem,
  type CrmLeadSource,
  type CrmLeadStatus,
} from '@/lib/hooks/useCrmLeads';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS: Array<CrmLeadStatus | 'ALL'> = [
  'ALL',
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST',
];

const SOURCE_FILTERS: Array<CrmLeadSource | 'ALL'> = [
  'ALL',
  'WEBSITE',
  'REFERRAL',
  'ADS',
  'SOCIAL',
  'PHONE',
  'OTHER',
];

function leadFullName(lead: CrmLeadListItem) {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim();
  return name || '—';
}

const columns: ColumnDef<CrmLeadListItem>[] = [
  {
    accessorKey: 'name',
    header: 'نام',
    cell: ({ row }) => (
      <Link
        href={`/admin/crm/leads/${row.original.id}`}
        className="font-medium text-foreground hover:text-primary hover:underline"
      >
        {leadFullName(row.original)}
      </Link>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'شماره تماس',
    cell: ({ row }) => <span dir="ltr">{row.original.phone}</span>,
  },
  {
    accessorKey: 'email',
    header: 'ایمیل',
    cell: ({ row }) => row.original.email || '—',
  },
  {
    accessorKey: 'source',
    header: 'منبع',
    cell: ({ row }) => <Badge variant="outline">{LEAD_SOURCE_LABELS[row.original.source]}</Badge>,
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => (
      <Badge variant={LEAD_STATUS_BADGE_VARIANT[row.original.status]}>
        {LEAD_STATUS_LABELS[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'مسئول',
    cell: ({ row }) => row.original.assignedTo?.name || '—',
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ ثبت',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('fa-IR'),
  },
  {
    id: 'actions',
    header: 'عملیات',
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/crm/leads/${row.original.id}`}>مشاهده</Link>
      </Button>
    ),
  },
];

export default function AdminCrmLeadsPage() {
  const { user, isLoading } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CrmLeadStatus | 'ALL'>('ALL');
  const [source, setSource] = useState<CrmLeadSource | 'ALL'>('ALL');

  const { data, isLoading: isLeadsLoading } = useCrmLeadsList(page, 20, {
    search,
    status: status === 'ALL' ? undefined : status,
    source: source === 'ALL' ? undefined : source,
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

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="سرنخ‌ها"
      description="سرنخ‌های ورودی را مدیریت، پیگیری و به فرصت فروش تبدیل کنید."
      actions={
        <Button asChild>
          <Link href="/admin/crm/leads/new">
            <Plus className="h-4 w-4" />
            سرنخ جدید
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        <DataTableToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="جستجو در نام یا شماره تماس..."
          filters={
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setStatus(s);
                  }}
                >
                  <Badge
                    variant={status === s ? 'default' : 'outline'}
                    className="cursor-pointer"
                  >
                    {s === 'ALL' ? 'همه وضعیت‌ها' : LEAD_STATUS_LABELS[s]}
                  </Badge>
                </button>
              ))}
              <span className="mx-1 hidden h-4 w-px bg-border sm:inline-block" />
              {SOURCE_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setSource(s);
                  }}
                >
                  <Badge
                    variant={source === s ? 'default' : 'outline'}
                    className="cursor-pointer"
                  >
                    {s === 'ALL' ? 'همه منابع' : LEAD_SOURCE_LABELS[s]}
                  </Badge>
                </button>
              ))}
            </div>
          }
        />

        <DataTable
          columns={columns}
          data={items}
          isLoading={isLeadsLoading}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="سرنخی یافت نشد"
          emptyDescription={search ? 'عبارت جستجو را تغییر دهید یا یک سرنخ جدید ثبت کنید.' : 'هنوز سرنخی ثبت نشده است.'}
        />
      </div>
    </AdminPageShell>
  );
}
