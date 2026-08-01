'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  useCreateCrmTicket,
  lookupCustomerByPhone,
  type CrmTicketCustomer,
} from '@/lib/hooks/useCrmTickets';
import {
  TicketCreateSchema,
  type TicketCreateInput,
} from '@/lib/schemas/crm-ticket-schema';

export const dynamic = 'force-dynamic';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'کم' },
  { value: 'NORMAL', label: 'عادی' },
  { value: 'HIGH', label: 'بالا' },
  { value: 'URGENT', label: 'فوری' },
] as const;

export default function NewCrmTicketPage() {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();
  const createTicket = useCreateCrmTicket();

  const [matchedCustomer, setMatchedCustomer] = useState<CrmTicketCustomer | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const form = useForm<TicketCreateInput>({
    resolver: zodResolver(TicketCreateSchema),
    defaultValues: {
      subject: '',
      description: '',
      priority: 'NORMAL',
      customerPhone: '',
    },
  });

  const handlePhoneBlur = async (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setMatchedCustomer(null);
      return;
    }

    setIsLookingUp(true);
    const customer = await lookupCustomerByPhone(trimmed);
    setMatchedCustomer(customer);
    setIsLookingUp(false);
  };

  const onSubmit = (data: TicketCreateInput) => {
    createTicket.mutate(
      {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        customerId: matchedCustomer?.id ?? undefined,
        customerPhone: data.customerPhone || undefined,
      },
      {
        onSuccess: (ticket) => {
          router.push(`/admin/crm/tickets/${ticket.id}`);
        },
      }
    );
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="تیکت جدید"
      description="یک تیکت پشتیبانی جدید برای مشتری ثبت کنید."
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/crm/tickets">
            بازگشت
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <Card className="max-w-2xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موضوع تیکت</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: مشکل در پرداخت سفارش" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="شرح کامل درخواست یا مشکل مشتری..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اولویت</FormLabel>
                  <Select value={field.value ?? 'NORMAL'} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تلفن مشتری</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="09xxxxxxxxx"
                      {...field}
                      value={field.value ?? ''}
                      onBlur={(e) => {
                        field.onBlur();
                        void handlePhoneBlur(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isLookingUp && (
                    <p className="text-xs text-muted-foreground">در حال جستجوی مشتری...</p>
                  )}
                  {!isLookingUp && matchedCustomer && (
                    <p className="flex items-center gap-1.5 text-xs text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      مشتری یافت شد: {[matchedCustomer.firstName, matchedCustomer.lastName].filter(Boolean).join(' ') || matchedCustomer.phone}
                    </p>
                  )}
                  {!isLookingUp && !matchedCustomer && field.value && (
                    <p className="text-xs text-muted-foreground">
                      مشتری‌ای با این شماره یافت نشد؛ شماره تماس در توضیحات تیکت ثبت می‌شود.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/crm/tickets')}>
                انصراف
              </Button>
              <Button type="submit" disabled={createTicket.isPending}>
                {createTicket.isPending ? 'در حال ثبت...' : 'ثبت تیکت'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AdminPageShell>
  );
}
