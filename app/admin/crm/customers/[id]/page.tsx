'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Receipt, User, History } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import CustomerOverviewTab from './tabs/CustomerOverviewTab';
import CustomerOrdersTab from './tabs/CustomerOrdersTab';
import CustomerActivityTab from './tabs/CustomerActivityTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrmCustomerDetail } from '@/lib/hooks/useCrmCustomer';

export const dynamic = 'force-dynamic';

export default function CrmCustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const { data, isLoading, error } = useCrmCustomerDetail(customerId, Boolean(customerId));

  if (isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات مشتری..." />;
  }

  if (error || !data) {
    return (
      <AdminPageShell
        title="مشتری یافت نشد"
        description="مشتری مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/customers">
              بازگشت به مشتریان
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات مشتری قابل دریافت نیست.
        </Card>
      </AdminPageShell>
    );
  }

  const { user } = data;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'بدون نام';

  return (
    <AdminPageShell
      title={fullName}
      description={user.phone}
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge variant={user.role === 'ADMIN' ? 'premium' : 'secondary'}>
            {user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
          </Badge>
          <Badge variant={user.phoneVerified ? 'success' : 'outline'}>
            {user.phoneVerified ? 'تلفن تایید شده' : 'تلفن تایید نشده'}
          </Badge>
          <Button asChild variant="outline">
            <Link href="/admin/crm/customers">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-3">
          <TabsTrigger value="overview" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4" />
            پروفایل
          </TabsTrigger>
          <TabsTrigger value="orders" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Receipt className="h-4 w-4" />
            سفارش‌ها و مالی
          </TabsTrigger>
          <TabsTrigger value="activity" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-4 w-4" />
            فعالیت‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CustomerOverviewTab customerId={customerId} user={user} tags={data.tags} />
        </TabsContent>
        <TabsContent value="orders">
          <CustomerOrdersTab
            orders={data.orders}
            transactions={data.transactions}
            investmentPortfolios={data.investmentPortfolios}
          />
        </TabsContent>
        <TabsContent value="activity">
          <CustomerActivityTab customerId={customerId} activities={data.activities} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
