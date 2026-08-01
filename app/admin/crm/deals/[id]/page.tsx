'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Info, MessageSquare } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCrmDeal } from '@/lib/hooks/useCrmDeals';
import DealOverviewTab from './tabs/DealOverviewTab';
import DealActivityTab from './tabs/DealActivityTab';

export const dynamic = 'force-dynamic';

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: deal, isLoading, error } = useCrmDeal(dealId, Boolean(user && dealId));

  if (isAuthLoading || isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات فرصت فروش..." />;
  }

  if (!user) {
    return null;
  }

  if (error || !deal) {
    return (
      <AdminPageShell
        title="فرصت فروش یافت نشد"
        description="فرصت فروش مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/deals">
              بازگشت به فرصت‌های فروش
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات فرصت فروش قابل دریافت نیست.
        </Card>
      </AdminPageShell>
    );
  }

  const stage = deal.stage;

  return (
    <AdminPageShell
      title={`فرصت فروش: ${deal.title}`}
      description="جزئیات، مخاطبین مرتبط و تاریخچه فعالیت‌های این فرصت فروش را مدیریت کنید."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {stage && (
            <Badge variant={stage.isWon ? 'success' : stage.isLost ? 'destructive' : 'outline'}>
              {stage.name}
            </Badge>
          )}
          <Button asChild variant="outline">
            <Link href="/admin/crm/deals">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-2">
          <TabsTrigger
            value="overview"
            className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Info className="h-4 w-4" />
            کلیات
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            فعالیت‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DealOverviewTab deal={deal} />
        </TabsContent>
        <TabsContent value="activity">
          <DealActivityTab dealId={deal.id} activities={deal.activities ?? []} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
