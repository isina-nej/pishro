# Detailed Specifications

## File Deletion List & Safety Checks

### Root Level Scripts (SAFE TO DELETE - 0 imports)

```
check-password.js               0 imports  ✓ Safe
check-user.mjs                  0 imports  ✓ Safe
verify-user-password.js         0 imports  ✓ Safe
query-users.js                  0 imports  ✓ Safe
query-users.mjs                 0 imports  ✓ Safe
query_admins.js                 0 imports  ✓ Safe
query_admins.mjs                0 imports  ✓ Safe
create-admin.mjs                0 imports  ✓ Safe
find-admin-users.mjs            0 imports  ✓ Safe
seed-admin.js                   0 imports  ✓ Safe
seed-admin-user.js              0 imports  ✓ Safe
test-upload.js                  0 imports  ✓ Safe
```

### Security Files (MUST DELETE)

```
yes                             SSH private key        SECURITY RISK
yes.pub                         SSH public key         SECURITY RISK
```

### Backup/Outdated Files (SAFE - review before delete)

```
backup-before-migration.sql     Old backup              Review for info
cleanup-database.sql            Old cleanup script      Review for info
HARDCODED_COLORS_REPORT.csv     Report from audit       Archive
HARDCODED_COLORS_REPORT.md      Report from audit       Archive
HARDCODED_COLORS_STATISTICS.md  Statistics              Archive
MIGRATION_SUMMARY.md            Old migration summary   Archive if documented elsewhere
tree-structure.txt              Old reference           Not needed
darkmide.md                      Typo/unused doc         Remove
```

## Component Consolidation Matrix

### Duplicate: pageContent.tsx (7 copies)

| Current Location | Status | Action |
|-----------------|--------|--------|
| components/aboutUs/PageContent.tsx | ✓ Active | Delete after migration |
| components/business-consulting/PageContent.tsx | ✓ Active | Delete after migration |
| components/checkout/PageContent.tsx | ✓ Active | Delete after migration |
| components/class/PageContent.tsx | ✓ Active | Delete after migration |
| components/faq/PageContent.tsx | ✓ Active | Delete after migration |
| components/investment-plans/PageContent.tsx | ✓ Active | Delete after migration |
| components/investmentPortfolios/PageContent.tsx | ✓ Active | Delete after migration |

**Consolidation Target**: `shared/ui/PageContent.tsx`

**Parameterization needed**:
- Analyze each copy for differences
- Extract variant props
- Create flexible component that handles all 7 use cases

### Duplicate: calculatorSection.tsx (2 copies)

| Current Location | Status | Action |
|-----------------|--------|--------|
| components/investment-plans/calculatorSection.tsx | ✓ Active | Delete after migration |
| components/investmentPortfolios/calculatorSection.tsx | ✓ Active | Delete after migration |

**Consolidation Target**: `features/investment/components/CalculatorSection.tsx`

### Duplicate: courseCard.tsx (2 copies)

| Current Location | Status | Action |
|-----------------|--------|--------|
| components/courses/courseCard.tsx | ✓ Active | Delete after migration |
| components/library/CourseCard.tsx | ✓ Active | Delete after migration |

**Consolidation Target**: `shared/ui/CourseCard.tsx`

### Duplicate: ctaSection.tsx (2 copies)

**Consolidation Target**: `shared/ui/CTASection.tsx`

### Duplicate: header.tsx (2 copies)

**Consolidation Target**: `shared/ui/Header.tsx` (or keep in appropriate feature)

### Duplicate: videoPlayer.tsx (2 copies)

**Consolidation Target**: `shared/ui/VideoPlayer.tsx`

### Duplicate: slider.tsx, ThemeToggle.tsx

**Consolidation Target**: `shared/ui/`

## Service Layer Flattening

### Service: News

**Current Structure**:
```
lib/services/news-mysql.ts     ← Database layer
lib/services/news-service.ts   ← Wrapper
```

**New Structure**:
```
features/news/services/news.ts ← Combined
```

**Changes**:
- Remove MySQL wrapper indirection
- Call Prisma directly in service
- Simplify service API

### Service: Library

**Current Structure**:
```
lib/services/library-mysql.ts
lib/services/library-service.ts
```

**New Structure**:
```
features/library/services/library.ts
```

### Service: Investment Models

**Current Structure**:
```
lib/services/investment-models-mysql.ts
lib/services/investment-models-service.ts
```

**New Structure**:
```
features/investment/services/models.ts
```

### Service: Skyroom

**Current Structure**:
```
lib/services/skyroom-mysql.ts
lib/services/skyroom-service.ts
```

**New Structure**:
```
features/skyroom/services/skyroom.ts
```

## Large Component Refactoring

### Component: RichNewsEditor.tsx (574 lines)

**Current**: `lib/components/admin/RichNewsEditor.tsx`

**Target**: `features/news/components/editor/`

**Split Strategy**:
1. **Editor.tsx** (300 lines)
   - Main editor wrapper
   - State management
   - Toolbar integration

2. **Toolbar.tsx** (150 lines)
   - Formatting controls
   - Style buttons
   - Color picker

3. **Preview.tsx** (100 lines)
   - Content preview
   - HTML rendering
   - Export functionality

4. **hooks.ts** (50 lines)
   - useEditor hook
   - useEditorState hook
   - useToolbar hook

5. **index.ts**
   - Export public API

**Import Updates**:
```typescript
// OLD
import { RichNewsEditor } from '@/components/admin/RichNewsEditor'

// NEW
import { RichNewsEditor } from '@/features/news/components/editor'
```

### Component: NewsEditor.tsx (499 lines)

**Current**: `lib/components/admin/NewsEditor.tsx`

**Target**: `features/news/components/NewsEditor/`

**Split Strategy**:
1. Extract form logic to separate component
2. Extract validation to schemas/
3. Extract API calls to hooks/
4. Keep UI component lean (<200 lines)

### Component: investmentModelsSection.tsx (485 lines)

**Current**: `components/investment-plans/investmentModelsSection.tsx`

**Target**: `features/investment/components/`

**Split Strategy**:
1. **Calculator.tsx** - Calculator logic
2. **Display.tsx** - Results display
3. **Form.tsx** - Input form
4. **index.ts** - Composition

### Component: CourseDetailModal.tsx (436 lines)

**Current**: `components/courses/CourseDetailModal.tsx`

**Target**: `features/courses/components/CourseDetail/`

**Split Strategy**:
1. **Header.tsx** - Course header info
2. **Content.tsx** - Course content tabs
3. **Sidebar.tsx** - Purchase section
4. **Modal.tsx** - Wrapper component

## Import Path Changes

### Comprehensive Mapping

**Auth-related**:
```typescript
// Old → New
@/lib/auth → @/server/auth
@/components/auth → @/features/auth/components
@/lib/hooks/useAuth → @/features/auth/hooks
```

**Course-related**:
```typescript
// Old → New
@/components/courses → @/features/courses/components
@/lib/hooks/useCourses → @/features/courses/hooks
@/lib/services/course-service → @/server/services
@/lib/types/course → @/types
```

**News-related**:
```typescript
// Old → New
@/components/admin/NewsEditor → @/features/news/components/editor
@/lib/services/news-service → @/server/services
@/lib/hooks/useNews → @/features/news/hooks
```

**Admin-related**:
```typescript
// Old → New
@/components/admin → @/features/admin/components
@/lib/admin-auth → @/server/auth/admin
```

**Utilities**:
```typescript
// Old → New
@/lib/utils/* → @/utils/*
@/lib/helpers/* → @/utils/*
@/lib/constants/* → @/constants/*
@/lib/types/* → @/types/*
@/lib/schemas/* → @/schemas/*
@/lib/hooks/* → @/hooks/* or @/features/*/hooks
```

**Server-only**:
```typescript
// Old → New
@/lib/db → @/server/db
@/lib/prisma → @/server/db
@/lib/cors → @/infrastructure/cors
@/lib/security → @/infrastructure/security
```

## TypeScript Configuration Updates

### Current tsconfig.json paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### New tsconfig.json paths

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
      "@/ui/*": ["./shared/ui/*"],
      "@/hooks/*": ["./shared/hooks/*"],
      "@/utils/*": ["./shared/utils/*"],
      "@/types/*": ["./shared/types/*"],
      "@/schemas/*": ["./shared/schemas/*"],
      "@/constants/*": ["./shared/constants/*"],
      "@/providers/*": ["./shared/providers/*"],
      "@/tests/*": ["./tests/*"]
    }
  }
}
```

## Safety Validation Checklist

### Before Each Deletion

- [ ] Search entire codebase for imports of file
- [ ] Search for TypeScript references
- [ ] Search for dynamic imports using that file
- [ ] Search route handlers for file usage
- [ ] Search middleware for file usage
- [ ] Search tests for file usage
- [ ] Search .env or config files
- [ ] Verify result shows 0 references OR all references will be updated

### Before Each Move

- [ ] Create destination directory
- [ ] Update all import paths first (or prepare list)
- [ ] Run TypeScript check
- [ ] Run ESLint
- [ ] Then move/delete old file
- [ ] Run TypeScript check again
- [ ] Commit

### After Each Phase

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] All imports are correctly resolved

## Rollback Strategy

If any phase fails:

1. **Check git status**: What changed?
2. **Run TypeScript**: Any type errors?
3. **Run ESLint**: Any lint errors?
4. **Review git diff**: What went wrong?
5. **Rollback if needed**: `git reset --hard HEAD~1`
6. **Debug specific issue**: Fix and retry

All work is committed frequently (after each task), so rollback is safe and easy.

## Estimated Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Missed import reference | Medium | High | Search before delete, frequent commits |
| Circular dependency introduced | Low | High | Run TypeScript after each move |
| Route handler breaks | Low | High | Search route files before moving |
| API endpoint breaks | Low | High | No API changes, only file moves |
| Build fails | Medium | High | Run build after each phase |
| Tests fail | Low | Medium | Run tests after each phase |
| Prisma breaks | Low | Medium | No schema changes, safe to refactor |

**Overall Risk Level**: MEDIUM (manageable with discipline)

