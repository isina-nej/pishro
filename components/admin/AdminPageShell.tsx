import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdminPageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPageShell({
  title,
  description,
  actions,
  children,
}: AdminPageShellProps) {
  return (
    <section className="min-h-full space-y-4 lg:space-y-5" dir="rtl">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2 text-right">
          <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function AdminLoadingState({ label }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950" dir="rtl">
      <Card className="flex items-center gap-3 px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-label={label || 'بارگذاری'} />
      </Card>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      {description && (
        <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action}
    </Card>
  );
}
