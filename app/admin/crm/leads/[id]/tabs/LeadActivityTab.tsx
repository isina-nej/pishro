'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquare, Phone, Mail, Users, History as HistoryIcon, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminEmptyState } from '@/components/admin/AdminPageShell';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAddLeadActivity, type CrmLeadActivity } from '@/lib/hooks/useCrmLeads';
import { LeadActivityCreateSchema, type LeadActivityCreateInput } from '@/lib/schemas/crm-lead-schema';

interface LeadActivityTabProps {
  leadId: string;
  activities: CrmLeadActivity[];
}

const ACTIVITY_TYPE_LABELS: Record<CrmLeadActivity['type'], string> = {
  NOTE: 'یادداشت',
  CALL: 'تماس تلفنی',
  EMAIL: 'ایمیل',
  MEETING: 'جلسه',
  STATUS_CHANGE: 'تغییر وضعیت',
  SYSTEM: 'سیستمی',
};

const ACTIVITY_TYPE_ICONS: Record<CrmLeadActivity['type'], typeof MessageSquare> = {
  NOTE: MessageSquare,
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  STATUS_CHANGE: HistoryIcon,
  SYSTEM: Settings,
};

export default function LeadActivityTab({ leadId, activities }: LeadActivityTabProps) {
  const addActivity = useAddLeadActivity();

  const form = useForm<LeadActivityCreateInput>({
    resolver: zodResolver(LeadActivityCreateSchema),
    defaultValues: {
      content: '',
      type: 'NOTE',
    },
  });

  const onSubmit = async (values: LeadActivityCreateInput) => {
    await addActivity.mutateAsync({ id: leadId, data: values });
    form.reset({ content: '', type: 'NOTE' });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="mb-3 text-base font-semibold text-foreground">افزودن یادداشت</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="یادداشت یا نتیجه تماس را بنویسید..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={addActivity.isPending}>
                {addActivity.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                ثبت یادداشت
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="mb-3 text-base font-semibold text-foreground">تاریخچه فعالیت‌ها</h2>
        {activities.length === 0 ? (
          <AdminEmptyState title="فعالیتی ثبت نشده است" description="یادداشت‌ها و تعاملات با این سرنخ اینجا نمایش داده می‌شود." />
        ) : (
          <ol className="space-y-3">
            {activities.map((activity) => {
              const Icon = ACTIVITY_TYPE_ICONS[activity.type];
              return (
                <li key={activity.id} className="flex gap-3 rounded-lg border border-border p-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ACTIVITY_TYPE_LABELS[activity.type]}</Badge>
                        {activity.admin?.name && (
                          <span className="text-xs text-muted-foreground">{activity.admin.name}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-foreground">{activity.content}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </div>
  );
}
