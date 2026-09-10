'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCrmLead, type CrmLeadListItem } from '@/lib/hooks/useCrmLeads';

function leadDisplayName(lead: CrmLeadListItem) {
  return [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim() || lead.phone;
}

/** منوی عملیات هر ردیف: مشاهده، ویرایش، حذف تکی با تأیید. */
export default function LeadRowActions({ lead }: { lead: CrmLeadListItem }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteLead = useDeleteCrmLead();

  const handleConfirmDelete = () => {
    deleteLead.mutate(lead.id, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label={`عملیات ${leadDisplayName(lead)}`}>
            <MoreHorizontal className="h-4 w-4" />
            عملیات
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/crm/leads/${lead.id}`} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              مشاهده و پیگیری
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/crm/leads/${lead.id}?tab=edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              ویرایش اطلاعات
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            حذف سرنخ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف سرنخ فروش</DialogTitle>
            <DialogDescription>
              «{leadDisplayName(lead)}» برای همیشه حذف می‌شود؛ فعالیت‌ها و فرصت‌های
              مرتبطش هم از لیست جدا می‌شوند. اگر فقط بدردنخور است، بهتر است وضعیتش را
              «از دست‌رفته» کنید تا آمار تبدیل درست بماند.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteLead.isPending}
            >
              {deleteLead.isPending && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              بله، حذف کن
            </Button>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
