# Implementation Tasks

## Phase 1: Foundation & Safety (Session 1)

### Task 1.1: Delete Unused Root Scripts (30 min)
**Status**: Not Started
**Files to delete**:
- check-password.js
- check-user.mjs
- verify-user-password.js
- query-users.js
- query-users.mjs
- query_admins.js
- query_admins.mjs
- create-admin.mjs
- find-admin-users.mjs
- seed-admin.js
- seed-admin-user.js
- test-upload.js

**Steps**:
1. Search for imports of each file (should be 0)
2. Search for require/dynamic imports (should be 0)
3. Git commit message: "refactor: remove unused root scripts"
4. Verify: `git status` shows 12 deleted files

### Task 1.2: Remove Security Risk Files (10 min)
**Status**: Not Started
**Files to delete**:
- yes (SSH public key)
- yes.pub (SSH private key)

**Steps**:
1. Check if files are in .gitignore (add if not)
2. Delete from filesystem
3. Git commit: "refactor: remove SSH keys from repo"
4. Note: Consider rotating SSH keys if they were used

### Task 1.3: Remove Old/Backup Files (15 min)
**Status**: Not Started
**Files to delete**:
- backup-before-migration.sql
- cleanup-database.sql
- HARDCODED_COLORS_REPORT.csv
- HARDCODED_COLORS_REPORT.md
- HARDCODED_COLORS_STATISTICS.md
- MIGRATION_SUMMARY.md
- tree-structure.txt
- darkmide.md

**Steps**:
1. Review each file to ensure it's documented elsewhere if needed
2. Delete files
3. Git commit: "refactor: remove outdated backup and report files"

### Task 1.4: Create Root Directory Structure (20 min)
**Status**: Not Started

**Steps**:
1. Create `/src` directory (optional - depends on preference)
2. Create `/features` directory and all subdirs:
   - features/auth/
   - features/courses/
   - features/news/
   - features/admin/
   - features/checkout/
   - features/library/
   - features/profile/
   - features/investment/
3. Create `/shared` directory and all subdirs:
   - shared/ui/
   - shared/hooks/
   - shared/utils/
   - shared/constants/
   - shared/types/
   - shared/schemas/
   - shared/providers/
   - shared/styles/ (or keep at root)
4. Create `/server` directory and all subdirs:
   - server/auth/
   - server/db/
   - server/services/
   - server/storage/
   - server/api-helpers/
5. Create `/infrastructure` directory
6. Create `/tests` directory
7. Commit: "refactor: create enterprise architecture directories"

### Task 1.5: Update TypeScript Paths (20 min)
**Status**: Not Started
**File**: tsconfig.json

**Changes**:
Add to compilerOptions.paths:
```json
{
  "@/features/*": ["./features/*"],
  "@/shared/*": ["./shared/*"],
  "@/server/*": ["./server/*"],
  "@/infrastructure/*": ["./infrastructure/*"],
  "@/ui/*": ["./shared/ui/*"],
  "@/hooks/*": ["./shared/hooks/*"],
  "@/utils/*": ["./shared/utils/*"],
  "@/types/*": ["./shared/types/*"],
  "@/schemas/*": ["./shared/schemas/*"]
}
```

**Commit**: "refactor: update TypeScript path aliases"

## Phase 2: Consolidation (Session 2)

### Task 2.1: Consolidate Duplicate Components - pageContent.tsx (45 min)
**Status**: Not Started
**Risk**: Medium (many files import this)

**Files to consolidate**:
- components/aboutUs/PageContent.tsx
- components/business-consulting/PageContent.tsx
- components/checkout/PageContent.tsx
- components/class/PageContent.tsx
- components/faq/PageContent.tsx
- components/investment-plans/PageContent.tsx
- components/investmentPortfolios/PageContent.tsx

**Steps**:
1. Review all 7 copies for differences
2. Create `shared/ui/PageContent.tsx` with parameterized version
3. Search for all imports: `PageContent` (should find 7 locations)
4. Update imports to use shared version with props for variations
5. Verify TypeScript passes
6. Delete old copies one by one
7. Commit: "refactor: consolidate duplicate PageContent component"

### Task 2.2: Consolidate Duplicate Components - courseCard.tsx (30 min)
**Status**: Not Started

**Files to consolidate**:
- components/courses/courseCard.tsx
- components/library/CourseCard.tsx → shared/ui/CourseCard.tsx

**Steps**:
1. Compare implementations
2. Create unified `shared/ui/CourseCard.tsx`
3. Update imports in both locations
4. Delete old files
5. Commit: "refactor: consolidate CourseCard component"

### Task 2.3: Consolidate Duplicate Components - calculatorSection.tsx (35 min)
**Status**: Not Started

**Files to consolidate**:
- components/investment-plans/calculatorSection.tsx
- components/investmentPortfolios/calculatorSection.tsx → features/investment/components/CalculatorSection.tsx

**Steps**:
1. Compare implementations for differences
2. Create features/investment/components/CalculatorSection.tsx
3. Update imports
4. Delete old files
5. Commit: "refactor: consolidate CalculatorSection component"

### Task 2.4: Consolidate UI Components - ctaSection, header, videoPlayer (40 min)
**Status**: Not Started

**Components**:
- ctaSection.tsx (2 copies)
- header.tsx (2 copies)
- videoPlayer.tsx (2 copies)
- slider.tsx, ThemeToggle.tsx (scattered)

**Steps**:
1. For each component: find all copies
2. Create single shared/ui/ version
3. Update all imports
4. Delete duplicates
5. Commit: "refactor: consolidate UI component duplicates"

### Task 2.5: Flatten Service Layers (50 min)
**Status**: Not Started

**Pattern**: Combine `-mysql.ts` + `-service.ts` into single service

**Services to flatten**:
1. **News**: news-mysql.ts + news-service.ts → features/news/services/news.ts
2. **Library**: library-mysql.ts + library-service.ts → features/library/services/library.ts
3. **Investment**: investment-models-mysql.ts + investment-models-service.ts → features/investment/services/models.ts
4. **Skyroom**: skyroom-mysql.ts + skyroom-service.ts → features/skyroom/services/skyroom.ts

**Steps**:
1. For each service:
   - Combine -mysql.ts and -service.ts logic
   - Remove wrapper layer indirection
   - Use Prisma directly
   - Create features/[domain]/services/[name].ts
2. Search for imports of both files
3. Update all call sites to use new location
4. Delete old files
5. Commit: "refactor: flatten service layers"

### Task 2.6: Extract Large Components (120 min)
**Status**: Not Started

**Component: RichNewsEditor.tsx (574 lines)**
- Location: lib/components/admin/RichNewsEditor.tsx → features/news/components/

**Extract into**:
- Editor.tsx (main editor with hooks)
- Toolbar.tsx (formatting tools)
- Preview.tsx (content preview)
- index.ts (exports)

**Steps**:
1. Analyze component structure
2. Extract each concern
3. Create features/news/components/editor/ directory
4. Update imports
5. Move file
6. Commit: "refactor: extract RichNewsEditor concerns"

**Component: NewsEditor.tsx (499 lines)**
- Extract form logic, validation
- Create features/news/components/NewsEditorForm.tsx
- Commit: "refactor: extract NewsEditor form logic"

**Component: investmentModelsSection.tsx (485 lines)**
- Extract calculator, display, form
- Move to features/investment/components/
- Commit: "refactor: split investmentModelsSection concerns"

**Component: CourseDetailModal.tsx (436 lines)**
- Extract content, purchase, details sections
- Move to features/courses/components/
- Commit: "refactor: split CourseDetailModal concerns"

## Phase 3: File Migration (Session 3)

### Task 3.1: Move Auth Components (60 min)
**Status**: Not Started

**Pattern**: components/auth/* → features/auth/components/

**Steps**:
1. List all files in components/auth/
2. Update imports (search for "@/components/auth")
3. Update to use "@/features/auth/components"
4. Move files to features/auth/components/
5. Verify TypeScript
6. Commit: "refactor: move auth components to features"

### Task 3.2: Move Course Components (60 min)
**Status**: Not Started

**Pattern**: components/courses/* → features/courses/components/

**Steps**:
1. List all course-related components
2. Update imports for all course components
3. Move to features/courses/components/
4. Verify TypeScript
5. Commit: "refactor: move course components to features"

### Task 3.3: Move News Components (60 min)
**Status**: Not Started

**Pattern**: components/admin/NewsEditor → features/news/components/

**Steps**:
1. Move all news-related components
2. Create features/news/components/
3. Update imports
4. Verify TypeScript
5. Commit: "refactor: move news components to features"

### Task 3.4: Move Admin Components (60 min)
**Status**: Not Started

**Pattern**: components/admin/* → features/admin/components/

**Steps**:
1. Move admin-specific components
2. Create features/admin/components/
3. Update imports
4. Verify TypeScript
5. Commit: "refactor: move admin components to features"

### Task 3.5: Centralize Utilities (60 min)
**Status**: Not Started

**Pattern**: lib/utils/*, lib/helpers/* → shared/utils/

**Steps**:
1. List all utilities in lib/utils/ and lib/helpers/
2. Consolidate into shared/utils/ with clear organization
3. Search for all imports
4. Update import paths from:
   - @/lib/utils/X → @/utils/X
   - @/lib/helpers/X → @/utils/X
5. Delete old lib/utils/ and lib/helpers/
6. Commit: "refactor: centralize utilities to shared/"

### Task 3.6: Centralize Types (45 min)
**Status**: Not Started

**Pattern**: lib/types/* → shared/types/

**Steps**:
1. Move all types to shared/types/
2. Update imports from @/lib/types → @/types
3. Update TypeScript paths
4. Verify no circular dependencies
5. Commit: "refactor: centralize types to shared/"

### Task 3.7: Centralize Schemas (45 min)
**Status**: Not Started

**Pattern**: lib/schemas/* → shared/schemas/

**Steps**:
1. Move all Zod schemas to shared/schemas/
2. Update imports
3. Verify TypeScript
4. Commit: "refactor: centralize Zod schemas"

### Task 3.8: Centralize Hooks (60 min)
**Status**: Not Started

**Pattern**: lib/hooks/* → shared/hooks/

**Steps**:
1. Move custom hooks to shared/hooks/
2. Update imports from @/lib/hooks → @/hooks
3. Verify no feature-specific logic in shared hooks
4. Move feature-specific hooks to features/[name]/hooks/
5. Commit: "refactor: organize hooks"

### Task 3.9: Move Server Code (60 min)
**Status**: Not Started

**Pattern**: lib/* (server code) → server/*

**Identify and move**:
- Auth/session logic → server/auth/
- Database queries → server/db/queries/
- Services → server/services/
- Storage/upload → server/storage/
- API helpers → server/api-helpers/

**Steps**:
1. Create server/ directory structure
2. Search for 'use server' directives
3. Move server-only code
4. Update imports
5. Verify build and runtime
6. Commit: "refactor: organize server-side code"

### Task 3.10: Move Tests (30 min)
**Status**: Not Started

**Pattern**: tests/** → organized by feature

**Steps**:
1. Move tests to tests/unit/, tests/integration/, etc.
2. Update import paths in test files
3. Verify tests run
4. Commit: "refactor: organize test files"

## Phase 4: Validation & Testing (Session 4)

### Task 4.1: Full TypeScript Check (20 min)
**Status**: Not Started

**Steps**:
```bash
npm run lint:ts
# Should show 0 errors
```

### Task 4.2: ESLint Validation (15 min)
**Status**: Not Started

**Steps**:
```bash
npm run lint
# Should show 0 errors
```

### Task 4.3: Next.js Build (30 min)
**Status**: Not Started

**Steps**:
```bash
npm run build
# Should succeed with no warnings
```

### Task 4.4: Runtime Validation (60 min)
**Status**: Not Started

**Steps**:
1. Start dev server: `npm run dev`
2. Test all major routes:
   - Home page
   - Login page
   - Course listing
   - News listing
   - Admin dashboard
   - Profile
3. Test key features:
   - Course enrollment
   - Course watching
   - News reading
   - Admin operations
   - File uploads

### Task 4.5: API Validation (30 min)
**Status**: Not Started

**Steps**:
1. Test all API endpoints
2. Verify authentication flows
3. Verify payment integration
4. Test file uploads
5. Verify all responses correct

### Task 4.6: Documentation (45 min)
**Status**: Not Started

**Steps**:
1. Update README with new structure
2. Update architecture documentation
3. Create ARCHITECTURE.md explaining the layout
4. Create MIGRATION.md documenting what changed
5. Create DEV_GUIDE.md for developers

## Summary

| Phase | Tasks | Estimated Time | Status |
|-------|-------|-----------------|--------|
| 1 | 5 tasks | 2 hours | Not Started |
| 2 | 6 tasks | 5 hours | Not Started |
| 3 | 10 tasks | 7 hours | Not Started |
| 4 | 6 tasks | 3.5 hours | Not Started |
| **Total** | **27 tasks** | **17.5 hours** | **Not Started** |

## Risk Mitigation

- ✅ Commit frequently (after each task or subtask)
- ✅ Run TypeScript/ESLint after each phase
- ✅ Git allows easy rollback if needed
- ✅ Incremental validation reduces risk
- ✅ No database schema changes (zero data risk)
- ✅ No API/route changes (backward compatible)
- ✅ No business logic changes (functional safety)

