'use client';

import { useMemo } from 'react';
import {
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import DataTablePagination from './DataTablePagination';
import type { PaginationMeta } from '@/lib/api-response';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** ستون انتخاب را اضافه می‌کند. بدون این، جدول دقیقاً مثل قبل رفتار می‌کند. */
  enableSelection?: boolean;
  /** شناسه‌های انتخاب‌شده (کنترل‌شده از بیرون، تا نوار عملیات به آن دسترسی داشته باشد) */
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** استخراج شناسه از هر ردیف — پیش‌فرض فیلد id */
  getRowId?: (row: TData) => string;
}

/**
 * Generic admin list-page table: columns/data in, sorting/visibility handled
 * by @tanstack/react-table, pagination driven by the server via
 * lib/api-response.ts's paginatedResponse() shape (PaginationMeta) so it
 * drops onto any existing or new admin list endpoint unchanged.
 *
 * انتخاب ردیف اختیاری است و با `enableSelection` روشن می‌شود؛ صفحه‌هایی که
 * آن را پاس نمی‌دهند هیچ تغییری نمی‌بینند.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  emptyTitle = 'داده‌ای یافت نشد',
  emptyDescription,
  enableSelection = false,
  selectedIds,
  onSelectedIdsChange,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const resolveRowId = useMemo(
    () => getRowId ?? ((row: TData) => String((row as { id?: unknown }).id ?? '')),
    [getRowId]
  );

  // انتخاب بیرون از جدول نگهداری می‌شود، ولی react-table با کلید ردیف کار
  // می‌کند — این دو را اینجا به هم می‌رسانیم تا صفحه‌ها فقط با شناسه سروکار
  // داشته باشند و از جزئیات جدول بی‌خبر بمانند.
  const rowSelection: RowSelectionState = useMemo(() => {
    if (!enableSelection || !selectedIds) return {};
    return Object.fromEntries(selectedIds.map((id) => [id, true]));
  }, [enableSelection, selectedIds]);

  const selectionColumn = useMemo<ColumnDef<TData, TValue> | null>(() => {
    if (!enableSelection) return null;
    return {
      id: '__select__',
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="انتخاب همه"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="انتخاب ردیف"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
    } as ColumnDef<TData, TValue>;
  }, [enableSelection]);

  const tableColumns = useMemo(
    () => (selectionColumn ? [selectionColumn, ...columns] : columns),
    [selectionColumn, columns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowId: (row) => resolveRowId(row),
    ...(enableSelection
      ? {
          state: { rowSelection },
          enableRowSelection: true,
          onRowSelectionChange: (updater) => {
            const next =
              typeof updater === 'function' ? updater(rowSelection) : updater;
            onSelectedIdsChange?.(
              Object.keys(next).filter((key) => next[key])
            );
          },
        }
      : {}),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && onPageChange && (
        <DataTablePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
