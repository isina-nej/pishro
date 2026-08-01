'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, MessageSquare, Info } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCrmTicket } from '@/lib/hooks/useCrmTickets';
import TicketConversationTab from './tabs/TicketConversationTab';
import TicketDetailsTab from './tabs/TicketDetailsTab';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  WAITING_ON_CUSTOMER: 'در انتظار مشتری',
  RESOLVED: 'حل شده',
  CLOSED: 'بسته شده',
};

export default function CrmTicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: ticket, isLoading, error } = useCrmTicket(ticketId, Boolean(user && ticketId));

  if (isAuthLoading || isLoading) {
    return <AdminLoadingState label="در حال دریافت اطلاعات تیکت..." />;
  }

  if (!user) {
    return null;
  }

  if (error || !ticket) {
    return (
      <AdminPageShell
        title="تیکت یافت نشد"
        description="تیکت مورد نظر وجود ندارد یا دسترسی به آن ممکن نیست."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/crm/tickets">
              بازگشت به تیکت‌ها
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <Card className="p-6 text-center text-sm text-muted-foreground">
          اطلاعات تیکت قابل دریافت نیست.
        </Card>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title={ticket.subject}
      description="مکالمه، یادداشت‌های داخلی و جزئیات تیکت را از اینجا مدیریت کنید."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{STATUS_LABELS[ticket.status] ?? ticket.status}</Badge>
          <Button asChild variant="outline">
            <Link href="/admin/crm/tickets">
              بازگشت
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="conversation" className="space-y-4">
        <TabsList className="grid gap-2 rounded-2xl border border-border bg-card p-2 sm:grid-cols-2">
          <TabsTrigger value="conversation" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquare className="h-4 w-4" />
            مکالمه
          </TabsTrigger>
          <TabsTrigger value="details" className="justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Info className="h-4 w-4" />
            جزئیات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversation">
          <TicketConversationTab ticket={ticket} />
        </TabsContent>
        <TabsContent value="details">
          <TicketDetailsTab ticket={ticket} />
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  );
}
