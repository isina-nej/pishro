I want to migrate all my static category pages in Next.js 15 to a fully dynamic SSR/ISR setup using Prisma. Key points:

1. Current pages are static, hardcoded, and share tags across pages (like components/airdrop/pageContent.tsx).
2. Goal:
   - Fetch content, tags, courses, and FAQs from the database per category (airdrop, NFT, crypto, stock, etc.) using Prisma.
   - Each category page: /courses/[categorySlug]/page.tsx
   - Include Landing component, TagsList, Courses list, FAQ section.
   - ISR: revalidate every 1 hour.
3. Admin can edit category content via API, then call /api/admin/revalidate to update cache immediately.
4. Metadata for SEO should be dynamic per category.
5. Database: 5 new CMS models added, 3 existing models updated, unified tagging system.
6. Requirements:
   - Generate static params for all categories
   - SSR page rendering with automatic revalidation
   - Fetch dynamic tags for category and popular tags
   - Scalable for future categories without code changes
7. Provide a plan/code for:
   - Prisma queries (getCategoryBySlug, getCategoryTags)
   - SSR category page in the app folder
   - Revalidate API route
   - Metadata generation
