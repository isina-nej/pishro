'use client';

import { Loader2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface BookFormData {
  title: string;
  slug: string;
  author: string;
  description: string;
  cover: string;
  publisher: string;
  year: string;
  pages: string;
  isbn: string;
  language: string;
  category: string;
  formats: string[];
  status: string[];
  tags: string;
  readingTime: string;
  isFeatured: boolean;
  price: string;
  fileUrl: string;
  audioUrl: string;
}

export const BOOK_CATEGORIES = [
  'بورس و سهام',
  'ارز دیجیتال',
  'سرمایه‌ گذاری',
  'کسب و کار',
  'اقتصاد',
  'تحلیل تکنیکال',
  'مدیریت مالی',
];

export const BOOK_FORMATS = ['جلد سخت', 'جلد نرم', 'الکترونیکی', 'صوتی'];
export const BOOK_STATUSES = ['جدید', 'پرفروش', 'ویژه'];
export const BOOK_LANGUAGES = ['فارسی', 'انگلیسی', 'چند‌زبانه'];

export const emptyBookForm = (): BookFormData => ({
  title: '',
  slug: '',
  author: '',
  description: '',
  cover: '',
  publisher: '',
  year: new Date().getFullYear().toString(),
  pages: '',
  isbn: '',
  language: 'فارسی',
  category: BOOK_CATEGORIES[0],
  formats: [],
  status: [],
  tags: '',
  readingTime: '',
  isFeatured: false,
  price: '',
  fileUrl: '',
  audioUrl: '',
});

export const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

interface BookBasicInfoProps {
  formData: BookFormData;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function BookBasicInfo({ formData, disabled, onChange }: BookBasicInfoProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-foreground">اطلاعات پایه‌ای</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>
            عنوان کتاب <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="عنوان کتاب را وارد کنید"
            disabled={disabled}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>نامک (Slug)</Label>
          <Input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            placeholder="نامک انگلیسی برای آدرس صفحه"
            dir="ltr"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>
            نویسنده <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            name="author"
            value={formData.author}
            onChange={onChange}
            placeholder="نام نویسنده"
            disabled={disabled}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>ناشر</Label>
          <Input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={onChange}
            placeholder="نام ناشر"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>دسته‌بندی <span className="text-destructive">*</span></Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              onChange({
                target: { name: 'category', value },
              } as unknown as React.ChangeEvent<HTMLSelectElement>)
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>زبان</Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              onChange({
                target: { name: 'language', value },
              } as unknown as React.ChangeEvent<HTMLSelectElement>)
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب زبان" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>سال انتشار</Label>
          <Input
            type="number"
            name="year"
            value={formData.year}
            onChange={onChange}
            placeholder="سال انتشار"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>تعداد صفحات</Label>
          <Input
            type="number"
            name="pages"
            value={formData.pages}
            onChange={onChange}
            placeholder="تعداد صفحات"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>شابک (ISBN)</Label>
          <Input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={onChange}
            placeholder="ISBN"
            dir="ltr"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>قیمت</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="قیمت"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>زمان مطالعه</Label>
          <Input
            type="text"
            name="readingTime"
            value={formData.readingTime}
            onChange={onChange}
            placeholder="مثال: 10 ساعت"
            disabled={disabled}
          />
        </div>

        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={onChange}
              disabled={disabled}
              className="size-4 cursor-pointer rounded border-input accent-primary"
            />
            <span className="font-medium text-foreground">منتخب (Highlighted)</span>
          </label>
        </div>
      </div>
    </section>
  );
}

interface BookDescriptionProps {
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function BookDescription({ value, disabled, onChange }: BookDescriptionProps) {
  return (
    <section>
      <Label className="mb-2 block">توضیحات</Label>
      <Textarea
        name="description"
        value={value}
        onChange={onChange}
        placeholder="توضیحات کتاب را وارد کنید"
        rows={5}
        disabled={disabled}
      />
    </section>
  );
}

interface BookMediaUploadProps {
  label: string;
  accept: string;
  hint: string;
  currentUrl: string;
  uploading: boolean;
  disabled?: boolean;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function BookMediaUpload({
  label,
  accept,
  hint,
  currentUrl,
  uploading,
  disabled,
  onPick,
  onClear,
}: BookMediaUploadProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border p-6 transition hover:border-primary/50">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Upload className="size-4" />
        {label}
      </div>
      <input
        type="file"
        accept={accept}
        onChange={onPick}
        disabled={disabled || uploading}
        className="hidden"
        id={`upload-${label}`}
      />
      <div className="cursor-pointer" onClick={() => document.getElementById(`upload-${label}`)?.click()}>
        {currentUrl ? (
          <div className="flex items-center gap-3 rounded border border-success/30 bg-success/10 p-3">
            <div className="text-success">✓</div>
            <span className="flex-1 truncate font-mono text-xs text-foreground" dir="ltr">
              {currentUrl}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="rounded p-1 text-muted-foreground transition hover:text-destructive"
              aria-label="حذف فایل"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="py-4 text-center">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                درحال بارگذاری...
              </div>
            ) : (
              <>
                <Upload className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{hint}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface BookChecklistProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function BookChecklist({ title, options, selected, onToggle }: BookChecklistProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-foreground">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="size-4 cursor-pointer rounded border-input accent-primary"
            />
            <span className="text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
