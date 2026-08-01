'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
}

/**
 * Generic admin list-page table: columns/data in, sorting/visibility handled
 * by @tanstack/react-table, pagination driven by the server via
 * lib/api-response.ts's paginatedResponse() shape (PaginationMeta) so it
 * drops onto any existing or new admin list endpoint unchanged.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  emptyTitle = 'داده‌ای یافت نشد',
  emptyDescription,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
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
