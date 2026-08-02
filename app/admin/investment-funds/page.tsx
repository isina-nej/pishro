'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { AdminEmptyState, AdminLoadingState, AdminPageShell } from '@/components/admin/AdminPageShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import {
  type AdminInvestmentFund,
  type InvestmentFundFormData,
  useAdminInvestmentFunds,
  useCreateAdminInvestmentFund,
  useDeleteAdminInvestmentFund,
  useUpdateAdminInvestmentFund,
} from '@/lib/hooks/useAdminInvestmentFunds';
import { InvestmentFundCreateSchema } from '@/lib/schemas/investment-fund-schema';

const numberFormatter = new Intl.NumberFormat('fa-IR');

function FundFormSheet({
  fund,
  open,
  onOpenChange,
}: {
  fund: AdminInvestmentFund | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEdit = Boolean(fund);
  const createMutation = useCreateAdminInvestmentFund();
  const updateMutation = useUpdateAdminInvestmentFund(fund?.id ?? '');

  const form = useForm<InvestmentFundFormData>({
    resolver: zodResolver(InvestmentFundCreateSchema),
    values: fund
      ? {
          key: fund.key,
          name: fund.name,
          description: fund.description ?? '',
          monthlyRate: fund.monthlyRate,
          minDuration: fund.minDuration,
          maxDuration: fund.maxDuration,
          durationStep: fund.durationStep,
          minAmount: fund.minAmount,
          maxAmount: fund.maxAmount,
          amountStep: fund.amountStep,
          order: fund.order,
          active: fund.active,
        }
      : {
          key: '',
          name: '',
          description: '',
          monthlyRate: 0.08,
          minDuration: 1,
          maxDuration: 12,
          durationStep: 1,
          minAmount: 1_000_000,
          maxAmount: 5_000_000_000,
          amountStep: 1_000_000,
          order: 0,
          active: true,
        },
  });

  const onSubmit = async (values: InvestmentFundFormData) => {
    if (isEdit && fund) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'ویرایش صندوق' : 'صندوق جدید'}</SheetTitle>
          <SheetDescription>
            نرخ سود، محدوده مبلغ و مدت سرمایه‌گذاری این صندوق را تنظیم کنید — این مقادیر مستقیماً روی ماشین‌حساب عمومی سایت اثر می‌گذارد.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شناسه (انگلیسی، یکتا)</FormLabel>
                  <FormControl>
                    <Input placeholder="fixed-income-monthly" {...field} disabled={isEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام صندوق</FormLabel>
                  <FormControl>
                    <Input placeholder="صندوق درآمد ثابت ماهیانه" {...field} />
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
                  <FormLabel>توضیح (زیر نتیجه محاسبه نمایش داده می‌شود)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نرخ سود ماهیانه (بین ۰ تا ۱، مثلاً ۰.۰۸ برای ۸٪)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="minDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حداقل مدت (ماه)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حداکثر مدت (ماه)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationStep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گام مدت</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حداقل مبلغ (تومان)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حداکثر مبلغ (تومان)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountStep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گام مبلغ (تومان)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border p-3">
                  <FormLabel className="!mt-0">فعال (روی ماشین‌حساب عمومی نمایش داده شود)</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ایجاد صندوق'}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default function InvestmentFundsPage() {
  const { user, isLoading: isAuthLoading } = useAdminAuth();
  const { data: funds, isLoading } = useAdminInvestmentFunds();
  const deleteMutation = useDeleteAdminInvestmentFund();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<AdminInvestmentFund | null>(null);

  if (isAuthLoading) {
    return <AdminLoadingState />;
  }
  if (!user) {
    return null;
  }

  const openCreate = () => {
    setEditingFund(null);
    setSheetOpen(true);
  };

  const openEdit = (fund: AdminInvestmentFund) => {
    setEditingFund(fund);
    setSheetOpen(true);
  };

  const handleDelete = (fund: AdminInvestmentFund) => {
    if (window.confirm(`آیا از حذف «${fund.name}» اطمینان دارید؟`)) {
      deleteMutation.mutate(fund.id);
    }
  };

  return (
    <AdminPageShell
      title="صندوق‌های سرمایه‌گذاری"
      description="نرخ سود و محدوده مبلغ/مدت هر صندوق که در ماشین‌حساب عمومی سایت نمایش داده می‌شود را از اینجا مدیریت کنید."
      actions={
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          صندوق جدید
        </Button>
      }
    >
      {isLoading ? (
        <AdminLoadingState label="در حال دریافت صندوق‌ها..." />
      ) : !funds || funds.length === 0 ? (
        <AdminEmptyState
          title="صندوقی یافت نشد"
          description="یک صندوق جدید ایجاد کنید تا در ماشین‌حساب عمومی نمایش داده شود."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              ایجاد اولین صندوق
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {funds.map((fund) => (
            <Card key={fund.id} className="p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{fund.name}</p>
                    <p className="text-xs text-muted-foreground">{fund.key}</p>
                  </div>
                </div>
                <Badge variant={fund.active ? 'success' : 'outline'}>
                  {fund.active ? 'فعال' : 'غیرفعال'}
                </Badge>
              </div>

              {fund.description && (
                <p className="mb-3 text-sm text-muted-foreground">{fund.description}</p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">نرخ ماهیانه</p>
                  <p className="font-bold text-foreground">
                    {(fund.monthlyRate * 100).toFixed(1)}٪
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">مدت</p>
                  <p className="font-bold text-foreground">
                    {numberFormatter.format(fund.minDuration)}-{numberFormatter.format(fund.maxDuration)} ماه
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">گام مدت</p>
                  <p className="font-bold text-foreground">{numberFormatter.format(fund.durationStep)} ماه</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(fund)}>
                  <Pencil className="h-4 w-4" />
                  ویرایش
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(fund)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FundFormSheet fund={editingFund} open={sheetOpen} onOpenChange={setSheetOpen} />
    </AdminPageShell>
  );
}
