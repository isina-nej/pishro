'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteCrmLead } from '@/lib/hooks/useCrmLeads';

/** دکمه حذف سرنخ در هدر صفحه جزئیات — با تأیید و برگشت به لیست. */
export default function DeleteLeadButton({ leadId, leadName }: { leadId: string; leadName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteLead = useDeleteCrmLead();

  const handleConfirm = () => {
    deleteLead.mutate(leadId, {
      onSuccess: () => {
        setOpen(false);
        router.push('/admin/crm/leads');
      },
    });
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        حذف
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف سرنخ فروش</DialogTitle>
            <DialogDescription>
              «{leadName}» برای همیشه حذف می‌شود. اگر فقط بدردنخور است، بهتر است
              وضعیتش را «از دست‌رفته» کنید تا آمار تبدیل درست بماند.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="destructive" onClick={handleConfirm} disabled={deleteLead.isPending}>
              {deleteLead.isPending && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              بله، حذف کن
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
