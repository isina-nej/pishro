'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { KanbanBoard } from '@/components/admin/kanban/KanbanBoard';
import { DataTable } from '@/components/admin/data-table/DataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useCrmDealsList,
  useMoveDealStage,
  crmDealKeys,
  type CrmDealListItem,
  type CrmPersonRef,
} from '@/lib/hooks/useCrmDeals';
import { BulkActionBar } from '@/components/admin/data-table/BulkActionBar';
import { useBulkSelection } from '@/lib/hooks/useBulkSelection';
import { useCrmPipelineStages } from '@/lib/hooks/useCrmPipelineStages';

export const dynamic = 'force-dynamic';

interface DealKanbanItem extends CrmDealListItem {
  columnId: string;
}

function formatAmount(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '—';
  return `${amount.toLocaleString('fa-IR')} تومان`;
}

function personLabel(person?: CrmPersonRef | null) {
  if (!person) return null;
  const name = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
  return name || person.phone;
}

function DealCard({ deal }: { deal: CrmDealListItem }) {
  const contact = personLabel(deal.customer) ?? personLabel(deal.lead);
  const ownerName = deal.ownerAdmin?.name;
  const ownerInitial = ownerName?.trim()?.charAt(0) || '؟';

  return (
    <Link href={`/admin/crm/deals/${deal.id}`} className="block space-y-2">
      <p className="line-clamp-2 text-sm font-medium text-foreground">{deal.title}</p>
      <p className="text-xs font-medium text-muted-foreground">{formatAmount(deal.amount)}</p>
      {contact && <p className="truncate text-xs text-muted-foreground">{contact}</p>}
      {ownerName && (
        <div className="flex items-center gap-1.5 pt-1">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">{ownerInitial}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{ownerName}</span>
        </div>
      )}
    </Link>
  );
}

export default function DealsPage() {
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [page, setPage] = useState(1);
  const limit = view === 'kanban' ? 200 : 20;

  const { data: stagesData, isLoading: isStagesLoading } = useCrmPipelineStages();
  const { data: dealsData, isLoading: isDealsLoading } = useCrmDealsList(
    view === 'kanban' ? 1 : page,
    limit
  );
  const moveDealStage = useMoveDealStage();
  const { selectedIds, setSelectedIds, clear, onDone } = useBulkSelection(crmDealKeys.all);

  const stages = useMemo(
    () => [...(stagesData ?? [])].sort((a, b) => a.order - b.order),
    [stagesData]
  );
  const columns = useMemo(() => stages.map((s) => ({ id: s.id, title: s.name })), [stages]);

  const items: DealKanbanItem[] = useMemo(
    () => (dealsData?.items ?? []).map((deal) => ({ ...deal, columnId: deal.stageId })),
    [dealsData]
  );

  function handleItemMove(dealId: string, toColumnId: string) {
    moveDealStage.mutate({ id: dealId, stageId: toColumnId });
  }

  const columnsDef: ColumnDef<CrmDealListItem>[] = [
    { accessorKey: 'title', header: 'عنوان' },
    {
      id: 'stage',
      header: 'مرحله',
      cell: ({ row }) => {
        const stage = row.original.stage;
        if (!stage) return '—';
        return (
          <Badge variant={stage.isWon ? 'success' : stage.isLost ? 'destructive' : 'outline'}>
            {stage.name}
          </Badge>
        );
      },
    },
    {
      id: 'amount',
      header: 'مبلغ',
      cell: ({ row }) => formatAmount(row.original.amount),
    },
    {
      id: 'contact',
      header: 'مخاطب',
      cell: ({ row }) => personLabel(row.original.customer) ?? personLabel(row.original.lead) ?? '—',
    },
    {
      id: 'owner',
      header: 'مسئول',
      cell: ({ row }) => row.original.ownerAdmin?.name ?? '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link href={`/admin/crm/deals/${row.original.id}`} className="text-sm text-primary hover:underline">
          مشاهده
        </Link>
      ),
    },
  ];

  if (isAuthLoading) {
    return <AdminLoadingState label="در حال بررسی دسترسی..." />;
  }

  if (!user) {
    return null;
  }

  const isLoading = isStagesLoading || isDealsLoading;

  return (
    <AdminPageShell
      title="فرصت‌های فروش"
      description="پایپ‌لاین فروش را به صورت بورد کانبان یا فهرست مدیریت کنید."
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <Button
              type="button"
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              className={cn(view !== 'kanban' && 'text-muted-foreground')}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
              کانبان
            </Button>
            <Button
              type="button"
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={cn(view !== 'list' && 'text-muted-foreground')}
              onClick={() => setView('list')}
            >
              <ListIcon className="h-4 w-4" />
              فهرست
            </Button>
          </div>
          <Button asChild>
            <Link href="/admin/crm/deals/new">
              <Plus className="h-4 w-4" />
              فرصت جدید
            </Link>
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <AdminLoadingState label="در حال دریافت فرصت‌های فروش..." />
      ) : columns.length === 0 ? (
        <AdminEmptyState
          title="مرحله‌ای در پایپ‌لاین یافت نشد"
          description="پایپ‌لاین فروش هنوز پیکربندی نشده است."
        />
      ) : view === 'kanban' ? (
        <KanbanBoard<DealKanbanItem>
          columns={columns}
          items={items}
          renderCard={(deal) => <DealCard deal={deal} />}
          onItemMove={handleItemMove}
        />
      ) : (
        <>
          <DataTable
            columns={columnsDef}
            data={dealsData?.items ?? []}
            pagination={dealsData?.pagination}
            onPageChange={setPage}
            emptyTitle="فرصت فروشی یافت نشد"
            emptyDescription="با دکمه «فرصت جدید» اولین فرصت فروش را ایجاد کنید."
            enableSelection
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />

          <BulkActionBar
            entity="deal"
            entityLabel="فرصت فروش"
            selectedIds={selectedIds}
            onClear={clear}
            onDone={onDone}
          />
        </>
      )}
    </AdminPageShell>
  );
}
