'use client';

import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
  dir = 'rtl',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  dir?: 'rtl' | 'ltr';
}) {
  return (
    <Field label={label}>
      {multiline ? (
        <Textarea
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="resize-y"
        />
      ) : (
        <Input dir={dir} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function JsonField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  hint?: string;
}) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 2);
  return (
    <Field label={label}>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <Textarea
        dir="ltr"
        className="font-mono text-xs"
        rows={6}
        value={text}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value || '[]'));
          } catch {
            // keep typing; parent can validate on save
            onChange(e.target.value);
          }
        }}
      />
    </Field>
  );
}

export function PublishedSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <Label>منتشر شده</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SaveBar({
  onSave,
  saving,
  label = 'ذخیره تغییرات',
}: {
  onSave: () => void;
  saving?: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 flex justify-end border-t bg-background/95 py-3 backdrop-blur">
      <Button type="button" onClick={onSave} disabled={saving}>
        {saving ? 'در حال ذخیره...' : label}
      </Button>
    </div>
  );
}
