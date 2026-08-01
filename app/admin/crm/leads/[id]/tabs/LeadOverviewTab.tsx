'use client';

import { useState, type ReactNode } from 'react';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_BADGE_VARIANT,
  LEAD_STATUS_LABELS,
  useConvertLead,
  type CrmLeadDetail,
} from '@/lib/hooks/useCrmLeads';

interface LeadOverviewTabProps {
  lead: CrmLeadDetail;
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function LeadOverviewTab({ lead }: LeadOverviewTabProps) {
  const convertLead = useConvertLead();
  const [convertError, setConvertError] = useState<string | null>(null);

  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim() || '—';
  const alreadyConverted = lead.status === 'CONVERTED';

  const handleConvert = async () => {
    setConvertError(null);
    try {
      await convertLead.mutateAsync({ id: lead.id, linkExistingCustomer: true });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'خطا در تبدیل سرنخ به فرصت فروش';
      setConvertError(message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-4 sm:p-6 lg:col-span-2">
        <h2 className="mb-2 text-base font-semibold text-foreground">اطلاعات سرنخ</h2>
        <div>
          <InfoRow label="نام و نام خانوادگی" value={fullName} />
          <InfoRow label="شماره تماس" value={<span dir="ltr">{lead.phone}</span>} />
          <InfoRow label="ایمیل" value={lead.email || '—'} />
          <InfoRow label="منبع" value={<Badge variant="outline">{LEAD_SOURCE_LABELS[lead.source]}</Badge>} />
          <InfoRow
            label="وضعیت"
            value={
              <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
                {LEAD_STATUS_LABELS[lead.status]}
              </Badge>
            }
          />
          <InfoRow label="امتیاز" value={lead.score ?? '—'} />
          <InfoRow label="مسئول پیگیری" value={lead.assignedTo?.name || 'تخصیص داده نشده'} />
          <InfoRow label="تاریخ ثبت" value={new Date(lead.createdAt).toLocaleDateString('fa-IR')} />
          <InfoRow label="آخرین بروزرسانی" value={new Date(lead.updatedAt).toLocaleDateString('fa-IR')} />
        </div>

        {lead.notes && (
          <div className="mt-4 rounded-lg bg-muted/40 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">یادداشت</p>
            <p className="whitespace-pre-wrap text-sm text-foreground">{lead.notes}</p>
          </div>
        )}
      </Card>

      <Card className="space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-foreground">تبدیل به فرصت فروش</h2>
        <p className="text-sm text-muted-foreground">
          با تبدیل این سرنخ، یک فرصت فروش (Deal) جدید در اولین مرحله قیف فروش ایجاد می‌شود.
        </p>

        {lead.deals.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">فرصت‌های فروش موجود</p>
            {lead.deals.map((deal) => (
              <div key={deal.id} className="rounded-lg border border-border p-2 text-sm">
                {deal.title}
              </div>
            ))}
          </div>
        )}

        {convertError && (
          <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">{convertError}</p>
        )}

        <Button
          onClick={handleConvert}
          disabled={convertLead.isPending || alreadyConverted}
          className="w-full"
        >
          {convertLead.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowLeftRight className="h-4 w-4" />
          )}
          {alreadyConverted ? 'قبلا تبدیل شده است' : 'تبدیل به فرصت فروش'}
        </Button>
      </Card>
    </div>
  );
}
