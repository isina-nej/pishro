'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import { useAddDealActivity, type CrmActivity } from '@/lib/hooks/useCrmDeals';

const activityTypeLabels: Record<CrmActivity['type'], string> = {
  NOTE: 'یادداشت',
  CALL: 'تماس تلفنی',
  EMAIL: 'ایمیل',
  MEETING: 'جلسه',
  STATUS_CHANGE: 'تغییر وضعیت',
  SYSTEM: 'سیستمی',
};

const activityFormSchema = z.object({
  type: z.enum(['NOTE', 'CALL', 'EMAIL', 'MEETING']),
  content: z
    .string()
    .trim()
    .min(1, 'متن فعالیت الزامی است')
    .max(5000, 'متن فعالیت نباید بیشتر از 5000 کاراکتر باشد'),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('fa-IR');
}

export default function DealActivityTab({
  dealId,
  activities,
}: {
  dealId: string;
  activities: CrmActivity[];
}) {
  const addActivity = useAddDealActivity();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: { type: 'NOTE', content: '' },
  });

  const onSubmit = (values: ActivityFormValues) => {
    addActivity.mutate(
      { dealId, type: values.type, content: values.content },
      {
        onSuccess: () => {
          form.reset({ type: 'NOTE', content: '' });
        },
      }
    );
  };

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="space-y-4 p-6 lg:col-span-1">
        <h3 className="text-sm font-semibold text-foreground">ثبت فعالیت جدید</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع فعالیت</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب نوع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NOTE">یادداشت</SelectItem>
                      <SelectItem value="CALL">تماس تلفنی</SelectItem>
                      <SelectItem value="EMAIL">ایمیل</SelectItem>
                      <SelectItem value="MEETING">جلسه</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>متن</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="توضیحات فعالیت را بنویسید..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={addActivity.isPending}>
              {addActivity.isPending ? 'در حال ثبت...' : 'ثبت فعالیت'}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="space-y-3 lg:col-span-2">
        {sortedActivities.length === 0 ? (
          <AdminEmptyState
            title="فعالیتی ثبت نشده است"
            description="اولین یادداشت یا فعالیت را برای این فرصت فروش ثبت کنید."
          />
        ) : (
          sortedActivities.map((activity) => (
            <Card key={activity.id} className="space-y-1.5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {activityTypeLabels[activity.type]}
                </span>
                <span className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">{activity.content}</p>
              {activity.admin && (
                <p className="text-xs text-muted-foreground">توسط {activity.admin.name}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
