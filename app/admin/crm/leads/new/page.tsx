'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LEAD_SOURCE_LABELS, useCreateCrmLead } from '@/lib/hooks/useCrmLeads';
import { LEAD_SOURCES, LeadCreateSchema, type LeadCreateInput } from '@/lib/schemas/crm-lead-schema';

export const dynamic = 'force-dynamic';

export default function NewCrmLeadPage() {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();
  const createLead = useCreateCrmLead();

  const form = useForm<LeadCreateInput>({
    resolver: zodResolver(LeadCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      source: 'OTHER',
      notes: '',
    },
  });

  const onSubmit = async (values: LeadCreateInput) => {
    const lead = await createLead.mutateAsync(values);
    router.push(`/admin/crm/leads/${lead.id}`);
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="سرنخ جدید"
      description="اطلاعات سرنخ ورودی را ثبت کنید تا در قیف فروش پیگیری شود."
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/crm/leads">
            بازگشت
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <Card className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام</FormLabel>
                    <FormControl>
                      <Input placeholder="نام" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input placeholder="نام خانوادگی" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      شماره تماس <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="09xxxxxxxxx" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" dir="ltr" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>منبع</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب منبع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEAD_SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            {LEAD_SOURCE_LABELS[source]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>یادداشت</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="یادداشت‌های اولیه درباره این سرنخ..."
                      rows={4}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/crm/leads">انصراف</Link>
              </Button>
              <Button type="submit" disabled={createLead.isPending}>
                {createLead.isPending ? 'در حال ثبت...' : 'ثبت سرنخ'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AdminPageShell>
  );
}
