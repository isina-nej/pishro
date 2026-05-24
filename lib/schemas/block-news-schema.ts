/**
 * Zod Validation Schemas for Block-Based News
 * 
 * Provides reusable validation for:
 * - News article creation/update
 * - Content block creation/update (polymorphic by type)
 * - Reordering operations
 */

import { z } from 'zod';

/**
 * Text Block Schema
 */
const TextBlockSchema = z.object({
  type: z.literal('TEXT'),
  content: z.object({
    text: z.string().min(1, 'متن نمی‌تواند خالی باشد').max(10000, 'متن نمی‌تواند بیش از 10000 کاراکتر باشد'),
  }),
});

/**
 * Heading Block Schema
 */
const HeadingBlockSchema = z.object({
  type: z.literal('HEADING'),
  content: z.object({
    level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    text: z.string().min(1, 'عنوان نمی‌تواند خالی باشد').max(500, 'عنوان نمی‌تواند بیش از 500 کاراکتر باشد'),
  }),
});

/**
 * Image Block Schema
 */
const ImageBlockSchema = z.object({
  type: z.literal('IMAGE'),
  content: z.object({
    url: z.string().url('آدرس تصویر معتبر نیست'),
    alt: z.string().max(500, 'متن جایگزین نمی‌تواند بیش از 500 کاراکتر باشد').default(''),
    caption: z.string().max(500, 'توضیح تصویر نمی‌تواند بیش از 500 کاراکتر باشد').optional(),
    width: z.number().int().positive('عرض تصویر باید مثبت باشد').optional(),
    height: z.number().int().positive('ارتفاع تصویر باید مثبت باشد').optional(),
  }),
});

/**
 * Gallery Block Schema (Multiple images)
 */
const GalleryBlockSchema = z.object({
  type: z.literal('GALLERY'),
  content: z.object({
    layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
    images: z.array(
      z.object({
        url: z.string().url('آدرس تصویر معتبر نیست'),
        alt: z.string().max(500).default(''),
        caption: z.string().max(500).optional(),
      })
    ).min(1, 'نگارخانه باید حداقل یک تصویر داشته باشد').max(50, 'نگارخانه نمی‌تواند بیش از 50 تصویر داشته باشد'),
  }),
});

/**
 * Quote Block Schema
 */
const QuoteBlockSchema = z.object({
  type: z.literal('QUOTE'),
  content: z.object({
    text: z.string().min(1, 'متن نقل‌قول نمی‌تواند خالی باشد').max(1000, 'متن نقل‌قول نمی‌تواند بیش از 1000 کاراکتر باشد'),
    author: z.string().max(300, 'نام نویسنده نمی‌تواند بیش از 300 کاراکتر باشد').optional(),
  }),
});

/**
 * List Block Schema (Ordered or unordered)
 */
const ListBlockSchema = z.object({
  type: z.literal('LIST'),
  content: z.object({
    style: z.enum(['ordered', 'unordered']).default('unordered'),
    items: z.array(
      z.string().min(1, 'هر مورد باید حداقل یک کاراکتر داشته باشد').max(500, 'هر مورد نمی‌تواند بیش از 500 کاراکتر باشد')
    ).min(1, 'لیست باید حداقل یک مورد داشته باشد').max(100, 'لیست نمی‌تواند بیش از 100 مورد داشته باشد'),
  }),
});

/**
 * Discriminated union of all block types
 */
export const BlockContentSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  HeadingBlockSchema,
  ImageBlockSchema,
  GalleryBlockSchema,
  QuoteBlockSchema,
  ListBlockSchema,
]);

/**
 * Schema for creating a new content block
 * (type + content validated together)
 */
export const BlockInputSchema = BlockContentSchema;

/**
 * Schema for News article creation
 * Accepts both old naming (description/thumbnail) and new naming (excerpt/coverImage)
 */
export const CreateNewsSchema = z.object({
  title: z.string()
    .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
    .max(500, 'عنوان نمی‌تواند بیش از 500 کاراکتر باشد'),
  // Accept both excerpt and description
  excerpt: z.string()
    .max(2000, 'خلاصه نمی‌تواند بیش از 2000 کاراکتر باشد')
    .optional(),
  description: z.string()
    .max(2000, 'توضیح نمی‌تواند بیش از 2000 کاراکتر باشد')
    .optional(),
  // Accept both content and full text
  content: z.string()
    .max(500000, 'محتوا نمی‌تواند بیش از 500000 کاراکتر باشد')
    .optional(),
  // Accept both coverImage and thumbnail
  coverImage: z.string()
    .refine(
      (val) => {
        // Accept relative paths (starting with /) or absolute URLs
        return val.startsWith('/') || val.match(/^https?:\/\//);
      },
      'آدرس تصویر معتبر نیست'
    )
    .optional()
    .nullable()
    .transform((val) => val === null ? undefined : val),
  thumbnail: z.string()
    .refine(
      (val) => {
        // Accept relative paths (starting with /) or absolute URLs
        return val.startsWith('/') || val.match(/^https?:\/\//);
      },
      'آدرس تصویر معتبر نیست'
    )
    .optional()
    .nullable()
    .transform((val) => val === null ? undefined : val),
  categoryId: z.string()
    .trim()
    .refine((val) => val === '' || val.length > 0, {
      message: 'شناسه دسته‌بندی معتبر نیست'
    })
    .transform((val) => val === '' ? undefined : val)
    .optional(),
  author: z.string()
    .max(255, 'نام نویسنده نمی‌تواند بیش از 255 کاراکتر باشد')
    .optional(),
  authorId: z.string()
    .min(1, 'شناسه نویسنده الزامی است')
    .optional(),
  publishedAt: z.string()
    .datetime('تاریخ انتشار معتبر نیست')
    .optional()
    .nullable(),
}).transform((data) => ({
  // Normalize: description → excerpt, thumbnail → coverImage
  ...data,
  excerpt: data.excerpt || data.description,
  coverImage: data.coverImage || data.thumbnail,
}));

/**
 * Schema for updating News article metadata
 * Accepts both old naming (description/thumbnail) and new naming (excerpt/coverImage)
 */
export const UpdateNewsSchema = z.object({
  title: z.string()
    .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
    .max(500, 'عنوان نمی‌تواند بیش از 500 کاراکتر باشد')
    .optional(),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'آدرس باید شامل حروف انگلیسی، اعداد و خط‌فاصله باشد')
    .max(500, 'آدرس نمی‌تواند بیش از 500 کاراکتر باشد')
    .optional(),
  // Accept both excerpt and description
  excerpt: z.string()
    .max(2000, 'خلاصه نمی‌تواند بیش از 2000 کاراکتر باشد')
    .optional(),
  description: z.string()
    .max(2000, 'توضیح نمی‌تواند بیش از 2000 کاراکتر باشد')
    .optional(),
  content: z.string()
    .max(500000, 'محتوا نمی‌تواند بیش از 500000 کاراکتر باشد')
    .optional(),
  categoryId: z.string()
    .regex(/^[a-f\d]{24}$/i, 'شناسه دسته‌بندی معتبر نیست')
    .nullable()
    .optional()
    .or(z.literal(''))  // Allow empty string
    .transform((val) => val === '' ? undefined : val),
  // Accept both coverImage and thumbnail
  coverImage: z.string()
    .refine(
      (val) => {
        // Accept relative paths (starting with /) or absolute URLs
        return val.startsWith('/') || val.match(/^https?:\/\//);
      },
      'آدرس تصویر معتبر نیست'
    )
    .optional()
    .nullable()
    .transform((val) => val === null ? undefined : val),
  thumbnail: z.string()
    .refine(
      (val) => {
        // Accept relative paths (starting with /) or absolute URLs
        return val.startsWith('/') || val.match(/^https?:\/\//);
      },
      'آدرس تصویر معتبر نیست'
    )
    .optional()
    .nullable()
    .transform((val) => val === null ? undefined : val),
  publishedAt: z.string()
    .datetime('تاریخ انتشار باید یک ISO datetime معتبر باشد')
    .nullable()
    .optional(),
  author: z.string()
    .max(255, 'نام نویسنده نمی‌تواند بیش از 255 کاراکتر باشد')
    .optional(),
}).transform((data) => ({
  // Normalize: description → excerpt, thumbnail → coverImage
  ...data,
  excerpt: data.excerpt || data.description,
  coverImage: data.coverImage || data.thumbnail,
}));

/**
 * Schema for reordering blocks
 */
export const ReorderBlocksSchema = z.array(
  z.object({
    blockId: z.string()
      .regex(/^[a-f\d]{24}$/i, 'شناسه بلاک معتبر نیست'),
    sortOrder: z.number()
      .int('ترتیب باید عدد صحیح باشد')
      .nonnegative('ترتیب نمی‌تواند منفی باشد'),
  })
).min(1, 'باید حداقل یک بلاک برای تغییر ترتیب وجود داشته باشد');

/**
 * Export types inferred from schemas
 */
export type BlockContent = z.infer<typeof BlockContentSchema>;
export type TextBlock = z.infer<typeof TextBlockSchema>;
export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;
export type ImageBlock = z.infer<typeof ImageBlockSchema>;
export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;
export type QuoteBlock = z.infer<typeof QuoteBlockSchema>;
export type ListBlock = z.infer<typeof ListBlockSchema>;
export type CreateNewsInput = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsInput = z.infer<typeof UpdateNewsSchema>;
export type ReorderBlocksInput = z.infer<typeof ReorderBlocksSchema>;
