'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Loader2, Upload, X } from 'lucide-react';

interface BookFormData {
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

const categories = [
  'بورس و سهام',
  'ارز دیجیتال',
  'سرمایه‌ گذاری',
  'کسب و کار',
  'اقتصاد',
  'تحلیل تکنیکال',
  'مدیریت مالی',
];

const formats = ['جلد سخت', 'جلد نرم', 'الکترونیکی', 'صوتی'];
const statuses = ['جدید', 'پرفروش', 'ویژه'];

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookFormData>({
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
    category: categories[0],
    formats: [],
    status: [],
    tags: '',
    readingTime: '',
    isFeatured: false,
    price: '',
    fileUrl: '',
    audioUrl: '',
  });

  // Load book data
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/library/${bookId}`);

        if (!response.ok) {
          setError('کتاب یافت نشد');
          return;
        }

        const data = await response.json();
        const book = data.data || data;

        setFormData({
          title: book.title || '',
          slug: book.slug || '',
          author: book.author || '',
          description: book.description || '',
          cover: book.cover || '',
          publisher: book.publisher || '',
          year: book.year?.toString() || new Date().getFullYear().toString(),
          pages: book.pages?.toString() || '',
          isbn: book.isbn || '',
          language: book.language || 'فارسی',
          category: book.category || categories[0],
          formats: Array.isArray(book.formats) ? book.formats : [],
          status: Array.isArray(book.status) ? book.status : [],
          tags: Array.isArray(book.tags) ? book.tags.join(', ') : '',
          readingTime: book.readingTime || '',
          isFeatured: book.isFeatured || false,
          price: book.price?.toString() || '',
          fileUrl: book.fileUrl || '',
          audioUrl: book.audioUrl || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت کتاب');
        console.error('Error loading book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormatChange = (format: string) => {
    setFormData((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cover' | 'pdf' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadingFile(fileType);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      const response = await fetch('/api/library/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update form data with uploaded file URL
        const fieldMap = { cover: 'cover', pdf: 'fileUrl', audio: 'audioUrl' };
        setFormData((prev) => ({
          ...prev,
          [fieldMap[fileType]]: data.url,
        }));
      } else {
        setError(data.message || 'خطا در بارگذاری فایل');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setIsUploading(false);
      setUploadingFile(null);
      // Clear input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title || !formData.author || !formData.category) {
      setError('لطفاً فیلدهای الزامی را پر کنید');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...formData,
        year: parseInt(formData.year),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const response = await fetch(`/api/library/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('کتاب با موفقیت ویرایش شد');
        router.push('/admin/library');
      } else {
        setError(data.message || 'خطا در ویرایش کتاب');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد');
      console.error('Error updating book:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/library"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            ویرایش کتاب
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            اطلاعات کتاب را ویرایش کنید
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 md:p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              اطلاعات پایه‌ای
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  عنوان کتاب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="عنوان کتاب را وارد کنید"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                  required
                />
              </div>

              {/* Slug (Read-only) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 outline-none cursor-not-allowed"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  نویسنده <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="نام نویسنده"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                  required
                />
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  ناشر
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="نام ناشر"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  سال انتشار
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="سال انتشار"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Pages */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  تعداد صفحات
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="تعداد صفحات"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  زبان
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500"
                >
                  <option value="فارسی">فارسی</option>
                  <option value="انگلیسی">انگلیسی</option>
                  <option value="چند‌زبانه">چند‌زبانه</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  قیمت
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="قیمت"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Reading Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  زمان مطالعه
                </label>
                <input
                  type="text"
                  name="readingTime"
                  value={formData.readingTime}
                  onChange={handleChange}
                  placeholder="مثال: 10 ساعت"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات کتاب را وارد کنید"
              rows={5}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400 resize-vertical"
            />
          </section>

          {/* Media */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              رسانه
            </h2>
            <div className="grid md:grid-cols-1 gap-6">
              {/* Cover Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition">
                <label className="block mb-3">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    جلد کتاب
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <div className="cursor-pointer">
                    {formData.cover ? (
                      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                        <div className="text-green-600 dark:text-green-400">✓</div>
                        <span className="text-sm text-green-700 dark:text-green-300 flex-1 break-all">{formData.cover.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, cover: '' }))}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`text-center py-4 ${uploadingFile === 'cover' ? 'opacity-50' : ''}`}>
                        {uploadingFile === 'cover' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            درحال بارگذاری...
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">تصویر جلد را انتخاب کنید</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">JPG, PNG یا WebP (حداکثر 5MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* PDF Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition">
                <label className="block mb-3">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    فایل PDF
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <div className="cursor-pointer">
                    {formData.fileUrl ? (
                      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                        <div className="text-green-600 dark:text-green-400">✓</div>
                        <span className="text-sm text-green-700 dark:text-green-300 flex-1 break-all">{formData.fileUrl.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, fileUrl: '' }))}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`text-center py-4 ${uploadingFile === 'pdf' ? 'opacity-50' : ''}`}>
                        {uploadingFile === 'pdf' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            درحال بارگذاری...
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">فایل PDF را انتخاب کنید</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">PDF (حداکثر 100MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Audio Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition">
                <label className="block mb-3">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    فایل صوتی
                  </div>
                  <input
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/m4a,audio/ogg"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <div className="cursor-pointer">
                    {formData.audioUrl ? (
                      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200 dark:border-green-800">
                        <div className="text-green-600 dark:text-green-400">✓</div>
                        <span className="text-sm text-green-700 dark:text-green-300 flex-1 break-all">{formData.audioUrl.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, audioUrl: '' }))}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`text-center py-4 ${uploadingFile === 'audio' ? 'opacity-50' : ''}`}>
                        {uploadingFile === 'audio' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            درحال بارگذاری...
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">فایل صوتی را انتخاب کنید</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">MP3, WAV, M4A یا OGG (حداکثر 200MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Formats */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              فرمت‌های موجود
            </h2>
            <div className="flex flex-wrap gap-3">
              {formats.map((format) => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.formats.includes(format)}
                    onChange={() => handleFormatChange(format)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{format}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Status */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              وضعیت
            </h2>
            <div className="flex flex-wrap gap-3">
              {statuses.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{status}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Tags & Featured */}
          <section>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  برچسب‌ها (جدا شده با کاما)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="تکنولوژی، بورس، سرمایه‌گذاری"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>

              {/* Featured */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    منتخب (Highlighted)
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
            <Link
              href="/admin/library"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition"
            >
              انصراف
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
