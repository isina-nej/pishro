'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useCreateCrmDeal } from '@/lib/hooks/useCrmDeals';
import { useCrmPipelineStages } from '@/lib/hooks/useCrmPipelineStages';

export const dynamic = 'force-dynamic';

const dealFormSchema = z.object({
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
  leadId: z.string().trim().optional(),
  customerId: z.string().trim().optional(),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

export default function NewDealPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: stages, isLoading: isStagesLoading } = useCrmPipelineStages();
  const createDeal = useCreateCrmDeal();

  const sortedStages = [...(stages ?? [])].sort((a, b) => a.order - b.order);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: '',
      stageId: '',
      amount: '',
      leadId: '',
      customerId: '',
    },
  });

  const onSubmit = (values: DealFormValues) => {
    createDeal.mutate(
      {
        title: values.title,
        stageId: values.stageId,
        amount: values.amount ? Number(values.amount) : null,
        leadId: values.leadId || null,
        customerId: values.customerId || null,
      },
      {
        onSuccess: (deal) => {
          router.push(`/admin/crm/deals/${deal.id}`);
        },
      }
    );
  };

  if (isAuthLoading || isStagesLoading) {
    return <AdminLoadingState label="در حال بارگذاری..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminPageShell
      title="فرصت فروش جدید"
      description="اطلاعات پایه فرصت فروش را وارد کنید؛ جزئیات بیشتر را بعداً می‌توانید از صفحه فرصت ویرایش کنید."
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/crm/deals">
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: فروش دوره سرمایه‌گذاری به آقای احمدی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    مرحله پایپ‌لاین <span className="text-destructive">*</span>
                  </FormLabel>
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
                    <Input inputMode="numeric" placeholder="مثال: 5000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه مشتری (اختیاری)</FormLabel>
                    <FormControl>
                      <Input placeholder="شناسه کاربر مشتری در سیستم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شناسه سرنخ (اختیاری)</FormLabel>
                    <FormControl>
                      <Input placeholder="شناسه سرنخ در CRM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/crm/deals">انصراف</Link>
              </Button>
              <Button type="submit" disabled={createDeal.isPending}>
                {createDeal.isPending ? 'در حال ایجاد...' : 'ایجاد فرصت فروش'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AdminPageShell>
  );
}
