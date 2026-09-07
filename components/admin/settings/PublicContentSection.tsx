"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PUBLIC_CONTENT_GROUP_LABELS,
  PUBLIC_CONTENT_PAGES,
  getPublicContentDefaults,
  type PublicContentFieldType,
  type PublicContentOverrides,
} from "@/lib/site/public-content";
import { cn } from "@/lib/utils";

type PublicContentSectionProps = {
  content: PublicContentOverrides;
  onChange: (content: PublicContentOverrides) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

function FieldInput({
  fieldKey,
  label,
  hint,
  type,
  value,
  onChange,
}: {
  fieldKey: string;
  label: string;
  hint?: string;
  type: PublicContentFieldType;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = `public-content-${fieldKey}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs font-semibold">
        {label}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={inputId}
          value={value}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hint}
        />
      ) : (
        <Input
          id={inputId}
          value={value}
          dir={type === "link" || type === "image" ? "ltr" : undefined}
          placeholder={hint}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && type === "textarea" && (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export default function PublicContentSection({
  content,
  onChange,
  onSave,
  saving,
}: PublicContentSectionProps) {
  const [pageId, setPageId] = useState(PUBLIC_CONTENT_PAGES[0]?.id ?? "");
  const page = useMemo(
    () => PUBLIC_CONTENT_PAGES.find((p) => p.id === pageId) ?? PUBLIC_CONTENT_PAGES[0],
    [pageId]
  );
  const pageKey = page?.id ?? PUBLIC_CONTENT_PAGES[0]?.id ?? "";
  const defaults = useMemo(() => getPublicContentDefaults(pageKey), [pageKey]);
  const pageValues = (pageKey && content[pageKey]) || {};

  const setField = (key: string, value: string) => {
    if (!pageKey) return;
    onChange({
      ...content,
      [pageKey]: { ...pageValues, [key]: value },
    });
  };

  const resetPage = () => {
    if (!pageKey) return;
    onChange({ ...content, [pageKey]: { ...defaults[pageKey] } });
  };

  if (!page) return null;

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-bold">متن‌های قابل‌ویرایش صفحات عمومی</h2>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            خالی = مقدار پیش‌فرض سایت. ذخیره از همین تب انجام می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PUBLIC_CONTENT_PAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPageId(p.id)}
              title={p.route}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                p.id === page.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {p.title}
              <span className="mr-1.5 font-normal opacity-70">
                {PUBLIC_CONTENT_GROUP_LABELS[p.group]}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {page.description} — مسیر: <span dir="ltr">{page.route}</span>
        </p>
      </Card>

      {page.sections.map((section) => (
        <Card key={section.id} className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold">{section.title}</h3>
              {section.description && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {section.description}
                </p>
              )}
            </div>
            {section.id === page.sections[0]?.id && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={resetPage}
                className="gap-1.5 text-[11px]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                بازگردانی پیش‌فرض
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.fields.map((item) => (
              <div
                key={item.key}
                className={cn(item.type === "textarea" && "sm:col-span-2")}
              >
                <FieldInput
                  fieldKey={`${page.id}.${item.key}`}
                  label={item.label}
                  hint={item.hint}
                  type={item.type ?? "text"}
                  value={pageValues[item.key] ?? defaults[page.id]?.[item.key] ?? ""}
                  onChange={(value) => setField(item.key, value)}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          ذخیره متن‌ها
        </Button>
      </div>
    </div>
  );
}
