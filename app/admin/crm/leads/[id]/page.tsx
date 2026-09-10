'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowRight, History, Pencil, UserRound } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LEAD_STATUS_BADGE_VARIANT, LEAD_STATUS_LABELS, useCrmLead } from '@/lib/hooks/useCrmLeads';
import { LeadsHelpPopover } from '@/components/admin/crm/LeadsHelp';
import DeleteLeadButton from './DeleteLeadButton';
import LeadActivityTab from './tabs/LeadActivityTab';
import LeadEditTab from './tabs/LeadEditTab';
import LeadOverviewTab from './tabs/LeadOverviewTab';

export const dynamic = 'force-dynamic';

function leadFullName(lead: { firstName: string | null; lastName: string | null; phone: string }) {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim();
  return name || lead.phone;
}

export default function CrmLeadDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const leadId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: lead, isLoading, error } = useCrmLead(leadId, Boolean(user && leadId));
  const defaultTab = searchParams.get('tab') === 'edit' ? 'edit' : 'overview';

  if (isAuthLoading || isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات سرنخ..." />;
  }

  if (!user) {
    return null;
  }

  if (error || !lead) {
    return (
      <AdminPageShell
        title="سرنخ فروش یافت نشد"
        description="سرنخ مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/leads">
              بازگشت به سرنخ‌های فروش
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات سرنخ قابل دریافت نیست.
        </Card>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title={`سرنخ فروش: ${leadFullName(lead)}`}
      description="مشتری بالقوه‌ای که هنوز خرید نکرده — اطلاعات و پیگیری‌اش را اینجا مدیریت کن."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
            {LEAD_STATUS_LABELS[lead.status]}
          </Badge>
          <LeadsHelpPopover />
          <DeleteLeadButton leadId={lead.id} leadName={leadFullName(lead)} />
          <Button asChild variant="outline">
            <Link href="/admin/crm/leads">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3">
          <TabsTrigger value="overview" className="justify-center gap-2">
            <UserRound className="h-4 w-4" />
            اطلاعات کلی
          </TabsTrigger>
          <TabsTrigger value="edit" className="justify-center gap-2">
            <Pencil className="h-4 w-4" />
            ویرایش
          </TabsTrigger>
          <TabsTrigger value="activity" className="justify-center gap-2">
            <History className="h-4 w-4" />
            فعالیت‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <LeadOverviewTab lead={lead} />
        </TabsContent>
        <TabsContent value="edit">
          <LeadEditTab leadId={lead.id} />
        </TabsContent>
        <TabsContent value="activity">
          <LeadActivityTab leadId={lead.id} activities={lead.activities} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
