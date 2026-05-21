# Enterprise Architecture Design

## Architecture Principles

1. **Domain-Driven Design**: Organize by feature, not by file type
2. **Clear Boundaries**: Each domain owns its logic, UI, and services
3. **Shared vs. Private**: Only truly shared code goes in shared/
4. **Server/Client Separation**: Clear markers for 'use server' code
5. **Single Responsibility**: Each file has one reason to change
6. **Type Safety**: Centralized types and schemas
7. **Testability**: Components and services independently testable

## Directory Structure

### Root Level
```
/
├── app/                    # Next.js App Router - only routes & layouts
├── prisma/                 # Database
├── public/                 # Static assets
├── openspec/              # Architecture documentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json
├── eslint.config.mjs
├── .env.local
└── [other config files]
```

### app/ Directory (App Router)
```
app/
├── layout.tsx             # Root layout
├── not-found.tsx
├── (routes)/
│   ├── page.tsx          # Home page
│   ├── login/
│   │   └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   ├── admin/
│   │   └── (admin)/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── [feature]/
│   ├── api/              # API routes (minimal)
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── news/
│   │   └── [...rest]
│   └── [feature pages]
└── styles/
```

### features/ Directory (Domain Modules)
Each feature is completely self-contained:

```
features/
├── auth/
│   ├── components/        # Auth-specific UI
│   ├── hooks/            # useAuth, useSession, etc.
│   ├── types/            # Auth types
│   ├── schemas/          # Zod schemas
│   ├── utils/            # Auth utilities
│   └── index.ts          # Public API
│
├── courses/
│   ├── components/
│   │   ├── CourseCard.tsx      # Shared across courses
│   │   ├── CourseDetail.tsx
│   │   ├── CourseListing.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useCourses.ts
│   │   ├── useCourseDetail.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── schemas/
│   │   └── index.ts
│   └── index.ts
│
├── news/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── schemas/
│   └── index.ts
│
├── admin/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── schemas/
│   └── index.ts
│
├── checkout/
├── library/
├── profile/
└── investment/
```

### shared/ Directory (Truly Shared)
```
shared/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Form.tsx
│   ├── Table.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx         # Global navbar
│   ├── Footer.tsx         # Global footer
│   └── index.ts
│
├── hooks/                # Custom hooks used across features
│   ├── useTheme.ts
│   ├── usePagination.ts
│   ├── useInfiniteScroll.ts
│   ├── useFetch.ts
│   └── index.ts
│
├── utils/               # General utilities
│   ├── formatting.ts
│   ├── validation.ts
│   ├── date-utils.ts
│   ├── math-utils.ts
│   └── index.ts
│
├── constants/          # App-wide constants
│   ├── api.ts
│   ├── routes.ts
│   ├── limits.ts
│   └── index.ts
│
├── types/             # Global types
│   ├── common.ts
│   ├── api.ts
│   └── index.ts
│
├── schemas/           # Zod schemas for validation
│   ├── user.ts
│   ├── course.ts
│   └── index.ts
│
├── providers/         # React context providers
│   ├── ThemeProvider.tsx
│   ├── ToastProvider.tsx
│   └── index.ts
│
└── styles/           # Global styles
    ├── globals.css
    └── theme.css
```

### server/ Directory (Server-Only Code)
```
server/
├── auth/
│   ├── jwt.ts
│   ├── session.ts
│   ├── permissions.ts
│   └── index.ts
│
├── db/
│   ├── client.ts       # Prisma client
│   ├── queries/        # DB query functions
│   │   ├── courses.ts
│   │   ├── users.ts
│   │   └── index.ts
│   └── index.ts
│
├── services/          # Business logic
│   ├── auth-service.ts
│   ├── course-service.ts
│   ├── news-service.ts
│   ├── payment-service.ts
│   ├── upload-service.ts
│   └── index.ts
│
├── storage/          # File storage (S3, local, etc)
│   ├── s3-client.ts
│   ├── upload.ts
│   └── index.ts
│
└── api-helpers/      # API utilities
    ├── middleware.ts
    ├── response.ts
    ├── validation.ts
    └── index.ts
```

### infrastructure/ Directory (Cross-Cutting)
```
infrastructure/
├── cors.ts
├── security.ts
├── logging.ts
├── monitoring.ts
└── index.ts
```

### tests/ Directory
```
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── hooks/
├── integration/
│   ├── api/
│   └── features/
└── e2e/
```

## Files to Delete

### Root-level scripts (delete immediately)
- ✂️ check-password.js
- ✂️ check-user.mjs
- ✂️ verify-user-password.js
- ✂️ query-users.js
- ✂️ query-users.mjs
- ✂️ query_admins.js
- ✂️ query_admins.mjs
- ✂️ create-admin.mjs
- ✂️ find-admin-users.mjs
- ✂️ seed-admin.js
- ✂️ seed-admin-user.js
- ✂️ test-upload.js

### Security risk
- ✂️ yes
- ✂️ yes.pub

### Old/backup files
- ✂️ backup-before-migration.sql
- ✂️ cleanup-database.sql

### Report/reference files to remove (after reviewing)
- ✂️ HARDCODED_COLORS_REPORT.csv
- ✂️ HARDCODED_COLORS_REPORT.md
- ✂️ HARDCODED_COLORS_STATISTICS.md
- ✂️ MIGRATION_SUMMARY.md
- ✂️ tree-structure.txt
- ✂️ darkmide.md (seems like typo)

## Files to Consolidate

### Duplicate Components (merge into shared/ui/)
1. **pageContent.tsx** (7 copies)
   - Location: aboutUs/, business-consulting/, checkout/, class/, faq/, investment-plans/, investmentPortfolios/
   - Action: Create single shared/ui/PageContent.tsx with props for variations

2. **calculatorSection.tsx** (2 copies)
   - Locations: investment-plans/, investmentPortfolios/
   - Action: Merge into features/investment/components/CalculatorSection.tsx

3. **courseCard.tsx** (2 copies)
   - Locations: courses/, library/
   - Action: Create shared/ui/CourseCard.tsx

4. **ctaSection.tsx** (2 copies)
   - Action: Create shared/ui/CTASection.tsx

5. **header.tsx**, **videoPlayer.tsx** (2 copies each)
   - Action: Consolidate to single source

6. **slider.tsx**, **ThemeToggle.tsx**
   - Locations: Duplicated across ui/ and utils/
   - Action: Consolidate in shared/ui/

### Service Layer (flatten structure)
1. **news-mysql.ts + news-service.ts** → features/news/services/news.ts
2. **library-mysql.ts + library-service.ts** → features/library/services/library.ts
3. **investment-models-mysql.ts + investment-models-service.ts** → features/investment/services/models.ts
4. **skyroom-mysql.ts + skyroom-service.ts** → features/skyroom/services/skyroom.ts

## Large Components to Split

### RichNewsEditor.tsx (574 lines)
- Split into: Editor, Controls, Toolbar, Preview
- Move to: features/news/components/

### NewsEditor.tsx (499 lines)
- Extract: Form logic, validation, API calls
- Move to: features/news/components/

### investmentModelsSection.tsx (485 lines)
- Split: Calculator, Display, Form
- Move to: features/investment/components/

### CourseDetailModal.tsx (436 lines)
- Extract: Content, Purchase, Details
- Move to: features/courses/components/

## Import Strategy

### From → To Examples
```typescript
// Old
import PageContent from '@/components/aboutUs/PageContent'
// New
import PageContent from '@/shared/ui/PageContent'

// Old
import { useCourses } from '@/lib/hooks/useCourses'
// New
import { useCourses } from '@/features/courses/hooks'

// Old
import { newsService } from '@/lib/services/news-service'
// New
import { newsService } from '@/server/services'

// Old
import { NewsEditor } from '@/components/admin/NewsEditor'
// New
import { NewsEditor } from '@/features/news/components/editor'
```

### Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/app/*": ["./app/*"],
      "@/features/*": ["./features/*"],
      "@/shared/*": ["./shared/*"],
      "@/server/*": ["./server/*"],
      "@/infrastructure/*": ["./infrastructure/*"],
      "@/types/*": ["./shared/types/*"],
      "@/schemas/*": ["./shared/schemas/*"],
      "@/hooks/*": ["./shared/hooks/*"],
      "@/utils/*": ["./shared/utils/*"],
      "@/ui/*": ["./shared/ui/*"]
    }
  }
}
```

## Safety Measures

1. **Pre-deletion checks**:
   - Search all imports for each file
   - Check TypeScript references
   - Check route handlers
   - Check dynamic imports
   - Check middleware

2. **Pre-move checks**:
   - Update all import paths first
   - Run TypeScript check
   - Run ESLint
   - Run build

3. **Incremental execution**:
   - One feature domain at a time
   - Validate after each domain
   - Commit to git frequently

4. **Validation gates**:
   - TypeScript strict check passes
   - ESLint clean
   - Next.js build succeeds
   - No runtime errors

## Feature Domain Boundaries

### Auth Domain
- Login/Register UI
- Session management
- JWT/Session logic
- User roles/permissions
- Protected routes

### Courses Domain
- Course listing
- Course details
- Course enrollment
- Course content delivery
- Progress tracking

### News Domain
- News list
- News detail
- News editor
- Comments

### Admin Domain
- Dashboard
- User management
- Content management
- Analytics
- Settings

### Checkout Domain
- Cart
- Payment
- Order management
- Invoices

### Library Domain
- Library content
- Bookmarks
- Search
- Collections

### Investment Domain
- Investment plans
- Portfolio
- Calculator
- Analysis

### Profile Domain
- User profile
- Preferences
- Settings
- Account management

## Implementation Order

1. **Delete unused root files** (Low risk, immediate cleanup)
2. **Create new directory structure** (No changes to existing code)
3. **Consolidate duplicates** (Copy to shared, then remove copies)
4. **Extract concerns from giant components** (Refactor within feature)
5. **Move files to new locations** (Update imports as you move)
6. **Flatten service layers** (Combine MySQL + service wrappers)
7. **Validate and test** (Full check)
8. **Update documentation** (README, architecture docs)

