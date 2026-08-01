'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateObject from 'react-date-object';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { useUpdateCrmDeal, type CrmDeal } from '@/lib/hooks/useCrmDeals';
import { useCrmPipelineStages } from '@/lib/hooks/useCrmPipelineStages';

function personLabel(person?: { firstName: string | null; lastName: string | null; phone: string } | null) {
  if (!person) return null;
  const name = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
  return name || person.phone;
}

function formatAmount(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '—';
  return `${amount.toLocaleString('fa-IR')} تومان`;
}

const overviewFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان الزامی است')
    .max(200, 'عنوان نباید بیشتر از 200 کاراکتر باشد'),
  stageId: z.string().min(1, 'مرحله الزامی است'),
  amount: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[0-9]+$/.test(v), { message: 'مبلغ باید عدد صحیح مثبت باشد' }),
  expectedCloseDate: z.instanceof(DateObject).nullable(),
});

type OverviewFormValues = z.infer<typeof overviewFormSchema>;

export default function DealOverviewTab({ deal }: { deal: CrmDeal }) {
  const { data: stages } = useCrmPipelineStages();
  const updateDeal = useUpdateCrmDeal();
  const sortedStages = [...(stages ?? [])].sort((a, b) => a.order - b.order);

  const form = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewFormSchema),
    defaultValues: {
      title: deal.title,
      stageId: deal.stageId,
      amount: deal.amount !== null && deal.amount !== undefined ? String(deal.amount) : '',
      expectedCloseDate: deal.expectedCloseDate ? new DateObject(new Date(deal.expectedCloseDate)) : null,
    },
  });

  useEffect(() => {
    form.reset({
      title: deal.title,
      stageId: deal.stageId,
      amount: deal.amount !== null && deal.amount !== undefined ? String(deal.amount) : '',
      expectedCloseDate: deal.expectedCloseDate ? new DateObject(new Date(deal.expectedCloseDate)) : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal.id]);

  const onSubmit = (values: OverviewFormValues) => {
    updateDeal.mutate({
      id: deal.id,
      data: {
        title: values.title,
        stageId: values.stageId,
        amount: values.amount ? Number(values.amount) : null,
        expectedCloseDate: values.expectedCloseDate ? values.expectedCloseDate.toDate().toISOString() : null,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="space-y-5 p-6 lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="stageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مرحله پایپ‌لاین</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب مرحله" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sortedStages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مبلغ (تومان)</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expectedCloseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ تخمینی بستن</FormLabel>
                  <FormControl>
                    <JalaliDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="انتخاب تاریخ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={updateDeal.isPending}>
                {updateDeal.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <div className="space-y-4">
        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-foreground">مخاطبین مرتبط</h3>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">مشتری</p>
            {deal.customer ? (
              <Link
                href={`/admin/crm/customers/${deal.customer.id}`}
                className="text-sm text-primary hover:underline"
              >
                {personLabel(deal.customer)}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">سرنخ</p>
            {deal.lead ? (
              <Link href={`/admin/crm/leads/${deal.lead.id}`} className="text-sm text-primary hover:underline">
                {personLabel(deal.lead)}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">سفارش</p>
            {deal.order ? (
              <p className="text-sm text-foreground">
                {formatAmount(deal.order.total)}
                <span className="mr-1 text-xs text-muted-foreground">({deal.order.status})</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-foreground">مسئول فرصت فروش</h3>
          <p className="text-sm text-foreground">{deal.ownerAdmin?.name ?? 'تعیین نشده'}</p>
        </Card>

        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-foreground">وضعیت</h3>
          {deal.stage && (
            <Badge variant={deal.stage.isWon ? 'success' : deal.stage.isLost ? 'destructive' : 'outline'}>
              {deal.stage.name}
            </Badge>
          )}
          {deal.closedAt && (
            <p className="text-xs text-muted-foreground">
              بسته شده در {new Date(deal.closedAt).toLocaleDateString('fa-IR')}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
