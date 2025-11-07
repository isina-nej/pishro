# Dynamic Category System - Quick Reference

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Prisma)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Category │──│PageContent│  │   Tag    │──│   FAQ    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│       │              │              │              │        │
└───────┼──────────────┼──────────────┼──────────────┼────────┘
        │              │              │              │
        ↓              ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────┐
│                 SERVICE LAYER (lib/services)                │
│  getCategoryBySlug() | getCategoryTags() | getCategoryFAQs()│
└─────────────────────────────────────────────────────────────┘
        │                              │
        ↓                              ↓
┌──────────────────┐          ┌──────────────────┐
│   API ROUTES     │          │   SSR PAGES      │
│ /api/categories/ │          │ /courses/[slug]  │
│     [slug]       │          │    page.tsx      │
└──────────────────┘          └──────────────────┘
        │                              │
        ↓                              ↓
┌─────────────────────────────────────────────────────────────┐
│               CLIENT LAYER (React Query)                    │
│  useCategory() | useCategoryTags() | useCategoryCourses()  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 File Locations

| Component | Path |
|-----------|------|
| Service Layer | [lib/services/category-service.ts](lib/services/category-service.ts) |
| API Route | [app/api/categories/[slug]/route.ts](app/api/categories/[slug]/route.ts) |
| SSR Page | [app/(routes)/courses/[categorySlug]/page.tsx](app/(routes)/courses/[categorySlug]/page.tsx) |
| React Query Hooks | [lib/hooks/useCategory.ts](lib/hooks/useCategory.ts) |
| Revalidate API | [app/api/admin/revalidate/route.ts](app/api/admin/revalidate/route.ts) |
| Prisma Schema | [prisma/schema.prisma](prisma/schema.prisma:260-433) |

---

## 🔑 Key Functions

### Service Layer (`category-service.ts`)

```typescript
// Fetch full category data
getCategoryBySlug(slug: string): Promise<CategoryWithRelations | null>

// Get all category slugs for static generation
getAllCategorySlugs(): Promise<string[]>

// Get category tags with stats
getCategoryTags(categorySlug: string, limit?: number): Promise<Tag[]>

// Get category FAQs
getCategoryFAQs(categorySlug: string, limit?: number): Promise<FAQ[]>

// Get category courses with pagination
getCategoryCourses(categorySlug: string, options): Promise<{ courses, pagination }>

// Get testimonials
getCategoryTestimonials(categorySlug: string, limit?: number): Promise<Testimonial[]>

// Analytics tracking
incrementTagClicks(tagId: string): Promise<void>
incrementFAQViews(faqId: string): Promise<void>
```

### React Query Hooks (`useCategory.ts`)

```typescript
// Main category hook
useCategory(slug: string, options): UseQueryResult<Category>

// Category tags
useCategoryTags(slug: string, limit?: number): UseQueryResult<Tag[]>

// Category FAQs
useCategoryFAQs(slug: string, limit?: number): UseQueryResult<FAQ[]>

// Category courses with pagination
useCategoryCourses(slug: string, options): UseQueryResult<{ courses, pagination }>

// Admin revalidation
useRevalidate(): UseMutationResult

// Prefetch for link hover
usePrefetchCategory(): (slug: string) => void
```

---

## 🌐 API Endpoints

### GET /api/categories/[slug]

**Fetch category data with optional includes**

**Query Parameters:**
- `include`: Comma-separated list (`tags,faqs,testimonials,courses`)
- `limit`: Max items per relation (default: 12)
- `page`: Page number for pagination (default: 1)
- `level`: Filter courses by level (`beginner`, `intermediate`, `advanced`, `expert`)

**Examples:**

```bash
# Get basic category info
GET /api/categories/airdrop

# Get with all relations
GET /api/categories/airdrop?include=all

# Get with specific relations
GET /api/categories/airdrop?include=tags,faqs,courses

# Get paginated courses
GET /api/categories/airdrop?include=courses&page=2&limit=10

# Filter courses by level
GET /api/categories/airdrop?include=courses&level=beginner
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "slug": "airdrop",
    "title": "آموزش ایردراپ",
    "description": "...",
    "icon": "/icons/airdrop.svg",
    "coverImage": "/images/airdrop-cover.jpg",
    "color": "#3B82F6",
    "metaTitle": "دوره‌های آموزش ایردراپ",
    "metaDescription": "...",
    "metaKeywords": "...",
    "featured": true,
    "order": 1,
    "tags": [...],
    "faqs": [...],
    "courses": [...],
    "testimonials": [...],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 12,
      "totalPages": 4
    }
  }
}
```

### POST /api/admin/revalidate

**Manually trigger ISR revalidation (admin only)**

**Body:**

```json
{
  "path": "/courses/airdrop",
  // or
  "path": ["/courses/airdrop", "/api/categories/airdrop"],
  // or
  "tag": "category",
  "type": "tag"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "فرآیند بازخوانی کش با موفقیت انجام شد",
    "revalidated": ["/courses/airdrop"],
    "failed": [],
    "timestamp": "2025-11-07T12:00:00Z"
  }
}
```

---

## 🚀 Usage Examples

### Server-Side (SSR Page)

```tsx
// app/(routes)/courses/[categorySlug]/page.tsx
export const revalidate = 3600; // ISR: 1 hour

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map(slug => ({ categorySlug: slug }));
}

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.categorySlug);
  return {
    title: category.metaTitle,
    description: category.metaDescription,
  };
}

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.categorySlug);
  const [tags, courses] = await Promise.all([
    getCategoryTags(params.categorySlug),
    getCategoryCourses(params.categorySlug, { limit: 12 }),
  ]);

  return (
    <div>
      <Landing3 {...landingData} />
      <CoursesSec courses={courses.courses} />
      <TagsList tags={tags} />
    </div>
  );
}
```

### Client-Side (React Component)

```tsx
'use client';

import { useCategory, useCategoryCourses } from '@/lib/hooks/useCategory';

export default function CategoryFilters({ slug }) {
  const { data: category, isLoading } = useCategory(slug, {
    include: ['tags'],
  });

  const { data: coursesData } = useCategoryCourses(slug, {
    page: 1,
    limit: 12,
    level: 'beginner',
  });

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <h1>{category?.title}</h1>
      <div>{coursesData?.courses.map(course => ...)}</div>
    </div>
  );
}
```

### Admin Revalidation

```tsx
'use client';

import { useRevalidate } from '@/lib/hooks/useCategory';

export default function AdminPanel() {
  const { mutate: revalidate, isPending } = useRevalidate();

  const handleRevalidate = () => {
    revalidate(
      { path: '/courses/airdrop' },
      {
        onSuccess: () => toast.success('بازخوانی موفق'),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <button onClick={handleRevalidate} disabled={isPending}>
      {isPending ? 'در حال بازخوانی...' : 'بازخوانی کش'}
    </button>
  );
}
```

---

## 🗄️ Database Schema Reference

### Category Model

```prisma
model Category {
  id              String        @id @default(cuid())
  slug            String        @unique
  title           String
  description     String?
  icon            String?
  coverImage      String?
  color           String?
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  published       Boolean       @default(false)
  featured        Boolean       @default(false)
  order           Int           @default(0)

  // Relations
  content       PageContent[]
  tags          Tag[]
  courses       Course[]
  news          News[]
  faqs          FAQ[]
  testimonials  Testimonial[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### PageContent Model

```prisma
model PageContent {
  id          String   @id @default(cuid())
  categoryId  String?
  type        String   // 'landing', 'about', 'features', 'faq', 'hero'
  content     Json     // Flexible JSON content
  published   Boolean  @default(false)
  publishAt   DateTime?
  expireAt    DateTime?
  order       Int      @default(0)

  category Category? @relation(fields: [categoryId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Tag Model (Many-to-Many)

```prisma
model Tag {
  id          String  @id @default(cuid())
  slug        String  @unique
  title       String
  description String?
  color       String?
  icon        String?
  published   Boolean @default(false)
  usageCount  Int     @default(0)
  clicks      Int     @default(0)

  categories Category[]
  courses    Course[]
  news       News[]
  books      Book[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## ⚙️ Configuration

### ISR Settings

```typescript
// In page.tsx
export const revalidate = 3600; // Revalidate every 1 hour (3600 seconds)

// Dynamic rendering options
export const dynamic = 'force-static'; // Force static generation
export const dynamicParams = true; // Allow dynamic params at runtime
```

### React Query Settings

```typescript
// In useCategory.ts
staleTime: 5 * 60 * 1000,  // 5 minutes - data considered fresh
gcTime: 10 * 60 * 1000,     // 10 minutes - cache garbage collection
```

---

## 🔍 Query Keys (React Query)

```typescript
categoryKeys.all                              // ['categories']
categoryKeys.detail('airdrop', 'all')         // ['categories', 'detail', 'airdrop', { include: 'all' }]
categoryKeys.tags('airdrop')                  // ['categories', 'airdrop', 'tags']
categoryKeys.faqs('airdrop')                  // ['categories', 'airdrop', 'faqs']
categoryKeys.courses('airdrop', { page: 1 })  // ['categories', 'airdrop', 'courses', { filters: { page: 1 } }]
```

**Invalidation:**

```typescript
// Invalidate all category queries
queryClient.invalidateQueries({ queryKey: categoryKeys.all });

// Invalidate specific category
queryClient.invalidateQueries({ queryKey: categoryKeys.detail('airdrop') });

// Invalidate category tags
queryClient.invalidateQueries({ queryKey: categoryKeys.tags('airdrop') });
```

---

## 🛠️ Common Operations

### Add New Category

```typescript
await prisma.category.create({
  data: {
    slug: 'web3',
    title: 'آموزش وب 3',
    description: '...',
    published: true,
    content: {
      create: {
        type: 'landing',
        content: { title: '...', description: '...' },
        published: true,
      },
    },
  },
});
```

### Update Category Content

```typescript
await prisma.pageContent.update({
  where: { id: 'content-id' },
  data: {
    content: {
      title: 'Updated title',
      description: 'New description',
    },
  },
});

// Then revalidate
await fetch('/api/admin/revalidate', {
  method: 'POST',
  body: JSON.stringify({ path: '/courses/web3' }),
});
```

### Add Tags to Category

```typescript
await prisma.category.update({
  where: { slug: 'airdrop' },
  data: {
    tags: {
      connect: [
        { id: 'tag-1' },
        { id: 'tag-2' },
      ],
    },
  },
});
```

### Track Analytics

```typescript
// Increment tag clicks
await incrementTagClicks('tag-id');

// Increment FAQ views
await incrementFAQViews('faq-id');
```

---

## 📊 Performance Tips

1. **Use Parallel Queries:**
   ```typescript
   const [tags, courses, faqs] = await Promise.all([
     getCategoryTags(slug),
     getCategoryCourses(slug),
     getCategoryFAQs(slug),
   ]);
   ```

2. **Limit Relations:**
   ```typescript
   // Don't fetch all courses, limit to 12
   const courses = await getCategoryCourses(slug, { limit: 12 });
   ```

3. **Use Suspense Boundaries:**
   ```tsx
   <Suspense fallback={<Skeleton />}>
     <CoursesSec courses={courses} />
   </Suspense>
   ```

4. **Prefetch on Hover:**
   ```tsx
   const prefetch = usePrefetchCategory();

   <Link
     href="/courses/airdrop"
     onMouseEnter={() => prefetch('airdrop')}
   >
   ```

5. **Incremental Static Regeneration:**
   - Build time: Generate all categories
   - Runtime: Revalidate every 1 hour
   - Manual: Admin can revalidate immediately

---

## 🐛 Debug Commands

```bash
# Check Prisma schema
npx prisma format
npx prisma validate

# View database
npx prisma studio

# Reset database (⚠️ CAUTION)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Check Next.js cache
ls .next/cache

# Clear Next.js cache
rm -rf .next

# Build and analyze bundle
npm run build
npm run analyze
```

---

## 📞 Support

- **Documentation:** See [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)
- **Project Rules:** See [CLAUDE.md](CLAUDE.md)
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js ISR:** https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **React Query:** https://tanstack.com/query/latest

---

**Quick Reference Version 1.0** | Last Updated: 2025-11-07
