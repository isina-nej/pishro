'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, History, UserRound } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LEAD_STATUS_BADGE_VARIANT, LEAD_STATUS_LABELS, useCrmLead } from '@/lib/hooks/useCrmLeads';
import LeadActivityTab from './tabs/LeadActivityTab';
import LeadOverviewTab from './tabs/LeadOverviewTab';

export const dynamic = 'force-dynamic';

function leadFullName(lead: { firstName: string | null; lastName: string | null; phone: string }) {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim();
  return name || lead.phone;
}

export default function CrmLeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: lead, isLoading, error } = useCrmLead(leadId, Boolean(user && leadId));

  if (isAuthLoading || isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات سرنخ..." />;
  }

  if (!user) {
    return null;
  }

  if (error || !lead) {
    return (
      <AdminPageShell
        title="سرنخ یافت نشد"
        description="سرنخ مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/leads">
              بازگشت به سرنخ‌ها
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
      title={`سرنخ: ${leadFullName(lead)}`}
      description="اطلاعات، فعالیت‌ها و وضعیت این سرنخ را مدیریت کنید."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={LEAD_STATUS_BADGE_VARIANT[lead.status]}>
            {LEAD_STATUS_LABELS[lead.status]}
          </Badge>
          <Button asChild variant="outline">
            <Link href="/admin/crm/leads">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-2">
          <TabsTrigger value="overview" className="justify-center gap-2">
            <UserRound className="h-4 w-4" />
            اطلاعات کلی
          </TabsTrigger>
          <TabsTrigger value="activity" className="justify-center gap-2">
            <History className="h-4 w-4" />
            فعالیت‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <LeadOverviewTab lead={lead} />
        </TabsContent>
        <TabsContent value="activity">
          <LeadActivityTab leadId={lead.id} activities={lead.activities} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
