'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/lib/api-response';

interface DataTablePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function DataTablePagination({ pagination, onPageChange }: DataTablePaginationProps) {
  const { page, totalPages, total, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
      <p>
        صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')} — {total.toLocaleString('fa-IR')} مورد
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={!hasPrevPage} onClick={() => onPageChange(page - 1)}>
          <ChevronRight className="h-4 w-4" />
          قبلی
        </Button>
        <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => onPageChange(page + 1)}>
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
