"use client";

import { Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_FOOTER_CONTENT,
  type ChromeLink,
  type FooterColumnContent,
  type FooterContent,
} from "@/lib/site/chrome-content";

type FooterContentSectionProps = {
  content: FooterContent;
  onChange: (content: FooterContent) => void;
  onSave: () => Promise<void>;
  saving: boolean;
};

type ColumnKey = keyof FooterContent["columns"];

const COLUMN_KEYS: ColumnKey[] = ["discover", "learn", "invest", "support"];

function LinkEditor({
  title,
  links,
  onChange,
}: {
  title: string;
  links: ChromeLink[];
  onChange: (links: ChromeLink[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-muted-foreground">{title}</p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 gap-1 px-2 text-[11px]"
          onClick={() => onChange([...links, { label: "لینک جدید", link: "/" }])}
        >
          <Plus className="h-3 w-3" />
          افزودن
        </Button>
      </div>
      {links.map((link, index) => (
        <div key={`${link.link}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={link.label}
            onChange={(e) =>
              onChange(
                links.map((row, i) =>
                  i === index ? { ...row, label: e.target.value } : row
                )
              )
            }
            placeholder="عنوان"
          />
          <Input
            value={link.link}
            dir="ltr"
            className="font-mono text-xs"
            onChange={(e) =>
              onChange(
                links.map((row, i) =>
                  i === index ? { ...row, link: e.target.value } : row
                )
              )
            }
            placeholder="/path"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="حذف لینک"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function FooterContentSection({
  content,
  onChange,
  onSave,
  saving,
}: FooterContentSectionProps) {
  const patch = (partial: Partial<FooterContent>) =>
    onChange({ ...content, ...partial });

  const patchColumn = (key: ColumnKey, column: FooterColumnContent) => {
    onChange({
      ...content,
      columns: { ...content.columns, [key]: column },
    });
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold">اطلاعات فوتر</h2>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              متن درباره، راه‌های تماس، شبکه‌های اجتماعی، ستون لینک‌ها و لینک‌های
              حقوقی پایین فوتر را کامل ویرایش کنید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onChange(structuredClone(DEFAULT_FOOTER_CONTENT))}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بازگشت به پیش‌فرض
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={saving}
              onClick={() => void onSave()}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              ذخیره فوتر
            </Button>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">متن معرفی</h3>
        <Textarea
          rows={4}
          value={content.aboutText}
          onChange={(e) => patch({ aboutText: e.target.value })}
          placeholder="متن کوتاه درباره برند در فوتر"
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">پسوند کپی‌رایت</Label>
          <Input
            value={content.copyrightSuffix}
            onChange={(e) => patch({ copyrightSuffix: e.target.value })}
            placeholder="تمامی حقوق محفوظ است."
          />
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">تماس و آدرس</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["phone", "تلفن ثابت (نمایش)", "۰۱۱…"],
              ["phoneTel", "تلفن ثابت (tel:)", "011…"],
              ["mobile", "موبایل (نمایش)", "۰۹۱…"],
              ["mobileTel", "موبایل (tel:)", "091…"],
              ["email", "ایمیل", "info@…"],
              ["address", "آدرس", "تهران، …"],
              ["weekdaysHours", "ساعات روزهای کاری", "۹ تا ۱۸"],
              ["weekendsHours", "ساعات آخر هفته", "تعطیل"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold">{label}</Label>
              <Input
                value={content[key]}
                dir={key.endsWith("Tel") || key === "email" ? "ltr" : undefined}
                onChange={(e) => patch({ [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-bold">شبکه‌های اجتماعی</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["instagram", "اینستاگرام"],
              ["telegram", "تلگرام"],
              ["twitter", "ایکس / لینکدین"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold">{label}</Label>
              <Input
                value={content[key]}
                dir="ltr"
                className="font-mono text-xs"
                onChange={(e) => patch({ [key]: e.target.value })}
                placeholder="https://…"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {COLUMN_KEYS.map((key) => {
          const column = content.columns[key];
          return (
            <Card key={key} className="space-y-3 p-4 sm:p-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">عنوان ستون</Label>
                <Input
                  value={column.title}
                  onChange={(e) =>
                    patchColumn(key, { ...column, title: e.target.value })
                  }
                />
              </div>
              <LinkEditor
                title="لینک‌های ستون"
                links={column.links}
                onChange={(links) => patchColumn(key, { ...column, links })}
              />
            </Card>
          );
        })}
      </div>

      <Card className="space-y-3 p-4 sm:p-5">
        <LinkEditor
          title="لینک‌های حقوقی پایین فوتر"
          links={content.legalLinks}
          onChange={(legalLinks) => patch({ legalLinks })}
        />
      </Card>
    </div>
  );
}
