'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  useCrmLead,
  useUpdateCrmLead,
} from '@/lib/hooks/useCrmLeads';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  LeadUpdateSchema,
  type LeadUpdateInput,
} from '@/lib/schemas/crm-lead-schema';

interface LeadEditTabProps {
  leadId: string;
}

/**
 * تب ویرایش سرنخ فروش: همان اسکیمای ایجاد، ولی مقادیر اولیه از سرور.
 * ?tab=edit مستقیم همین تب را باز می‌کند (لینک «ویرایش» جدول).
 */
export default function LeadEditTab({ leadId }: LeadEditTabProps) {
  const router = useRouter();
  const { data: lead, isLoading } = useCrmLead(leadId, Boolean(leadId));
  const updateLead = useUpdateCrmLead();

  const form = useForm<LeadUpdateInput>({
    resolver: zodResolver(LeadUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      source: 'OTHER',
      status: 'NEW',
      score: null,
      notes: '',
    },
  });

  useEffect(() => {
    if (!lead) return;
    form.reset({
      firstName: lead.firstName ?? '',
      lastName: lead.lastName ?? '',
      phone: lead.phone,
      email: lead.email ?? '',
      source: lead.source,
      status: lead.status,
      score: lead.score,
      notes: lead.notes ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  const onSubmit = (values: LeadUpdateInput) => {
    updateLead.mutate(
      { id: leadId, data: { ...values, email: values.email || null, notes: values.notes || null } },
      { onSuccess: () => router.push(`/admin/crm/leads/${leadId}`) }
    );
  };

  if (isLoading || !lead) {
    return (
      <Card className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        در حال دریافت اطلاعات سرنخ...
      </Card>
    );
  }

  return (
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
                    <Input placeholder="09xxxxxxxxx" dir="ltr" {...field} value={field.value ?? ''} />
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
                      {LEAD_SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LEAD_SOURCE_LABELS[s]}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وضعیت</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب وضعیت" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
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
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>امتیاز (۰ تا ۱۰۰)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="مثلا ۷۰"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
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
                  <Textarea rows={4} placeholder="یادداشت درباره این سرنخ..." {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href={`/admin/crm/leads/${leadId}`}>
                انصراف
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button type="submit" disabled={updateLead.isPending}>
              {updateLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
