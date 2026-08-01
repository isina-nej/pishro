'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, MessageSquare, Phone, Mail, Users, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import {
  AddCustomerActivitySchema,
  type AddCustomerActivityInput,
} from '@/lib/schemas/crm-customer-schema';
import {
  useAddCustomerActivity,
  type CrmCustomerDetail,
} from '@/lib/hooks/useCrmCustomer';

interface CustomerActivityTabProps {
  customerId: string;
  activities: CrmCustomerDetail['activities'];
}

const ACTIVITY_ICON: Record<string, typeof MessageSquare> = {
  NOTE: MessageSquare,
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  STATUS_CHANGE: RefreshCcw,
  SYSTEM: Bell,
};

const ACTIVITY_LABEL: Record<string, string> = {
  NOTE: 'یادداشت',
  CALL: 'تماس',
  EMAIL: 'ایمیل',
  MEETING: 'جلسه',
  STATUS_CHANGE: 'تغییر وضعیت',
  SYSTEM: 'سیستمی',
};

export default function CustomerActivityTab({ customerId, activities }: CustomerActivityTabProps) {
  const addActivity = useAddCustomerActivity(customerId);

  const form = useForm<AddCustomerActivityInput>({
    resolver: zodResolver(AddCustomerActivitySchema),
    defaultValues: { content: '' },
  });

  const onSubmit = (values: AddCustomerActivityInput) => {
    addActivity.mutate(values, {
      onSuccess: () => form.reset({ content: '' }),
    });
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">ثبت یادداشت جدید</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="یادداشتی درباره این مشتری بنویسید..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={addActivity.isPending}>
                {addActivity.isPending ? 'در حال ثبت...' : 'ثبت یادداشت'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="text-right text-sm font-semibold text-foreground">تاریخچه فعالیت‌ها</h3>
        {activities.length === 0 ? (
          <AdminEmptyState
            title="فعالیتی ثبت نشده"
            description="هنوز یادداشت یا فعالیتی برای این مشتری ثبت نشده است."
          />
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICON[activity.type] ?? Bell;
              return (
                <li
                  key={activity.id}
                  className="flex flex-row-reverse items-start gap-3 rounded-xl border border-border p-3 text-right"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-row-reverse items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {ACTIVITY_LABEL[activity.type] ?? activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.admin?.name ? `ثبت‌شده توسط ${activity.admin.name}` : 'ثبت‌شده توسط سیستم'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
