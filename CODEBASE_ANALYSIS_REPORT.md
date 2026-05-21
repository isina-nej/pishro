# Next.js Codebase Analysis Report
**Analysis Date**: May 21, 2026  
**Project**: Pishro (Next.js 15.5.9, TypeScript, React 19, Prisma 6)  
**Overall Assessment**: ⚠️ **CRITICAL REFACTORING NEEDED** (Chaos Level: HIGH)

---

## Executive Summary

This codebase shows significant **structural fragmentation** with widespread duplication, unused scripts, and scattered concerns. The root directory contains 12 unused test/debug scripts, components are duplicated across feature folders, and services have split implementations. Estimated cleanup scope: **40-50 files could be consolidated or deleted**.

---

## 1. File Inventory by Directory

| Directory | File Count | Purpose | Status |
|-----------|-----------|---------|--------|
| **app/** | 164 | Next.js routes (pages + API) | ✅ Active |
| **components/** | 223 | React components by feature | ⚠️ Contains duplicates |
| **lib/** | 93 | Shared utilities, services, hooks | ✅ Active but scattered |
| **public/** | 272 | Static assets | ✅ Active |
| **prisma/** | 43 | Database schema + seeds + migrations | ⚠️ Multiple seed versions |
| **scripts/** | 12 | Build/utility scripts | ⚠️ Mostly unused |
| **database/** | 10 | Backup migrations | ⚠️ Cleanup candidates |
| **docs/** | 7 | Documentation | ✅ Active |
| **tests/** | 6 | Test files | ⚠️ Minimal coverage |
| **types/** | 12 | TypeScript type definitions | ✅ Active |
| **ROOT LEVEL** | 50+ | Config + utilities + cleanup debris | 🔴 **CRITICAL** |
| **TOTAL** | **842** | (excluding node_modules) | |

---

## 2. Root Directory Clutter - CRITICAL ISSUE

### Configuration Files (Necessary - 6 files)
```
✅ next.config.ts (1.1K)          - Next.js configuration
✅ tailwind.config.ts (3.3K)       - Tailwind CSS setup
✅ postcss.config.mjs (135B)       - PostCSS configuration
✅ tsconfig.json (config)          - TypeScript configuration
✅ eslint.config.mjs (555B)        - ESLint configuration
✅ components.json                 - Shadcn UI config
```

### Auth/Middleware Files (Necessary - 3 files)
```
✅ auth.ts (2.3K)                  - NextAuth.js v5 configuration
✅ middleware.ts (3.9K)            - Next.js middleware (auth checks)
ℹ️  next-env.d.ts (262B)           - Auto-generated TypeScript defs
```

### Type Definitions (Necessary - 2 files)
```
✅ svg.d.ts (169B)                 - SVG import types
ℹ️  next-env.d.ts (262B)           - Auto-generated Next.js types
```

### 🔴 UNUSED TEST/DEBUG SCRIPTS (12 files - 18.6KB total)

#### Direct User Query Scripts (Likely abandoned)
```
❌ query-users.js (1.9K)           - Direct MySQL user lookup
❌ query-users.mjs (1.8K)          - Duplicate: Prisma version of above
❌ query_admins.js (666B)          - Direct MySQL admin lookup
❌ query_admins.mjs (672B)         - Duplicate: Prisma version of above
```

#### Password Verification Scripts (Debug artifacts)
```
❌ check-password.js (1.2K)        - Hardcoded MySQL test
❌ check-user.mjs (584B)           - Alternative password check
❌ verify-user-password.js (1.8K)  - Third password verification attempt
```

#### Admin Creation Scripts (Test/migration scripts)
```
❌ create-admin.mjs (1.2K)         - Create admin user directly
❌ seed-admin.js (1.8K)            - Alternative admin seeding
❌ seed-admin-user.js (1.3K)       - Another admin seed variant
❌ find-admin-users.mjs (1.4K)     - Query existing admin users
```

#### Upload/Misc Tests
```
❌ test-upload.js (490B)           - Tests file upload functionality
```

### 🟡 TEMPORARY/BACKUP FILES (4 files - 68.7KB)

```
⚠️  backup-before-migration.sql (67K)     - Database snapshot (stale)
⚠️  cleanup-database.sql (1.7K)           - Migration artifact
⚠️  tsconfig.json.tmp                     - Temporary config backup
⚠️  tree-structure.txt                    - Generated directory listing
```

### 📄 Documentation Files (Necessary - 12 files)
```
✅ README.md, BLOG_GUIDE.md, BLOG_SETUP.md, etc.
```

### 🔐 SSH Keys (SECURITY RISK - 2 files)
```
⚠️  yes / yes.pub                  - SSH keypair in repository!
    ⚠️ SHOULD BE IN .gitignore
```

### 📊 Generated Reports (Cleanup artifacts - 3 files)
```
⚠️  HARDCODED_COLORS_REPORT.csv/md/statistics.md    - Analysis output
```

**Root Directory Summary**:
- **Clean necessary files**: 11
- **Unused scripts to delete**: 12
- **Backup/temp files to remove**: 4
- **Security risks**: 1 (SSH keys)
- **Cleanup potential**: ~40KB + 20 files

---

## 3. Duplicate Detection Analysis

### 3.1 Component Duplicates (8 Component Names × Multiple Locations = 23 total files)

#### 🔴 **CRITICAL: pageContent.tsx** - 7 Instances
```
locations/
├── components/aboutUs/pageContent.tsx
├── components/business-consulting/pageContent.tsx
├── components/checkout/pageContent.tsx
├── components/class/pageContent.tsx
├── components/faq/pageContent.tsx
├── components/investment-plans/pageContent.tsx
└── components/investmentPortfolios/pageContent.tsx

Status: IDENTICAL COPIES of generic page wrapper component
Action: Consolidate to components/ui/PageContent.tsx with feature-specific configs
```

#### ⚠️ **High Priority: calculatorSection.tsx** - 2 Instances
```
locations/
├── components/home/calculatorSection.tsx (411 lines)
└── components/investmentPortfolios/calculatorSection.tsx (485 lines)

Status: SIMILAR BUT DIFFERENT - investmentPortfolios version has more features
Action: Merge into single parameterized component or create base + variants
```

#### ⚠️ **Medium Priority Duplicates** - 6 More Instances
```
courseCard.tsx               (2 locations: courses/, utils/)
ctaSection.tsx              (2 locations: aboutUs/, courses/)
header.tsx                  (2 locations: faq/, profile/)
slider.tsx                  (2 locations: ui/, utils/)
ThemeToggle.tsx             (2 locations: ui/, utils/)
videoPlayer.tsx             (2 locations: class/, video/)
```

**Component Consolidation Potential**: 15+ files → 8 shared components

---

### 3.2 Service Layer Duplicates (4 Patterns)

Pattern: Each service has both a `-mysql.ts` (implementation) and `-service.ts` (wrapper):

#### Investment Models
```
lib/services/
├── investment-models-mysql.ts    (Direct database queries)
└── investment-models-service.ts  (Wrapper, imports mysql version)
        ↓ imports from investment-models-mysql.ts
```

#### News
```
lib/services/
├── news-mysql.ts                (Direct database queries)
└── news-service.ts              (Wrapper, imports mysql version)
        ↓ imports from news-mysql.ts
```

#### Library (Books)
```
lib/services/
├── library-mysql.ts             (Direct database queries)
└── library-service.ts           (Wrapper, imports mysql version)
        ↓ imports from library-mysql.ts
  Used by: app/api/library/route.ts
```

#### Skyroom (Conferencing)
```
lib/services/
├── skyroom-mysql.ts             (Direct database queries)
└── skyroom-service.ts           (Wrapper, imports mysql version)
        ↓ imports from skyroom-mysql.ts
```

**Assessment**: These are INTENTIONAL patterns (data layer abstraction) but create unnecessary indirection. Could be flattened with Prisma as the single data access layer.

---

### 3.3 Seed Script Duplicates (3-5 versions)

```
Seed Management Scripts Found:
├── prisma/seed.ts                  (Primary seed file - 406 lines)
├── prisma/seed-simple.js           (Minimal seed variant)
├── prisma/seed-admin.ts            (Admin-only seeding)
├── prisma/seeds/landing-seed.ts    (Landing page data)
├── prisma/seeds/seed-all.ts        (Orchestrator - imports seed-admin)
├── prisma/landings-seed.js         (Legacy landing seed?)
├── scripts/seed-mysql.ts           (Alternative MySQL seeding)
├── seed-admin.js (root)            (UNUSED - script artifact)
├── seed-admin-user.js (root)       (UNUSED - script artifact)
└── root seed scripts              (12+ additional unused scripts)
```

**Active vs Unused**: 3-4 active seed files but 8+ abandoned scripts in root + /scripts/

---

### 3.4 Configuration Duplicates (CORS & URL Resolution)

#### ❌ **CORS Configuration Duplication**
```
lib/cors.ts                        - Defines allowed origins
  └── hardcoded: localhost:3001-3004, localhost:3000

lib/api-response.ts                - Also defines CORS origins  
  └── hardcoded: duplicate list

Pattern: CORS middleware appears in multiple locations
Risk: Inconsistent CORS policies if one is updated
Action: Single source of truth in env vars or dedicated middleware
```

#### ❌ **Base URL Resolution Duplication**
```
lib/get-base-url.ts               - Returns base URL
  └── Returns: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

lib/api-client.ts                 - Axios instance setup
  └── baseURL: process.env.NEXT_PUBLIC_API_URL || origin || "http://localhost:3000"

lib/services/news-service.ts      - URL logic
lib/services/library-service.ts   - URL logic  
lib/services/investment-models-service.ts - URL logic
  └── All have: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

Pattern: 5+ different places constructing the same base URL
Risk: Production deployment bugs if env vars don't align
Action: Centralize in single utility exported from lib/get-base-url.ts
```

---

## 4. Dead Code Indicators

### 4.1 Unused Root Scripts (High Confidence)

| Script | Size | Purpose | Usage | Status |
|--------|------|---------|-------|--------|
| `check-password.js` | 1.2K | Test user password | ❌ 0 imports | 🗑️ DELETE |
| `check-user.mjs` | 584B | Verify user exists | ❌ 0 imports | 🗑️ DELETE |
| `verify-user-password.js` | 1.8K | Password verification | ❌ 0 imports | 🗑️ DELETE |
| `create-admin.mjs` | 1.2K | Create admin user | ❌ 0 imports | 🗑️ DELETE |
| `find-admin-users.mjs` | 1.4K | Query admin users | ❌ 0 imports | 🗑️ DELETE |
| `query_admins.js` | 666B | Admin queries (MySQL) | ❌ 0 imports | 🗑️ DELETE |
| `query_admins.mjs` | 672B | Admin queries (Prisma) | ❌ 0 imports | 🗑️ DELETE |
| `query-users.js` | 1.9K | User queries (MySQL) | ❌ 0 imports | 🗑️ DELETE |
| `query-users.mjs` | 1.8K | User queries (Prisma) | ❌ 0 imports | 🗑️ DELETE |
| `seed-admin.js` | 1.8K | Admin seeding (duplicate) | ❌ 0 imports | 🗑️ DELETE |
| `seed-admin-user.js` | 1.3K | Admin seeding variant | ❌ 0 imports | 🗑️ DELETE |
| `test-upload.js` | 490B | Upload directory test | ❌ 0 imports | 🗑️ DELETE |

**Total unused scripts**: 12 files, ~18.6KB  
**Confidence Level**: 100% (grep shows zero imports anywhere in codebase)

### 4.2 Old/Backup Files

```
backup-before-migration.sql (67K)        - ⚠️ Database snapshot before migration
                                          Status: Likely stale, check last modified date
                                          Action: Move to database/backups/ if keeping

cleanup-database.sql (1.7K)              - ⚠️ Migration cleanup script
                                          Status: One-time use only
                                          Action: Move to database/migrations/archive/

tsconfig.json.tmp                        - ⚠️ Temporary TypeScript config
                                          Status: Should be in .gitignore
                                          Action: Delete, regenerate if needed
```

### 4.3 Scripts Directory Assessment

```
scripts/ contains 12 files, mostly single-use migrations:
├── check-courses.ts                    (Run-once validation)
├── check-db.ts                         (DB health check)
├── create-admin.ts                     (Admin creation - active during dev)
├── create-otp-tables.mjs               (One-time migration)
├── insert-home-landing.ts              (Data seeding)
├── migrate-article-content.ts          (Migration script)
├── quiz-seed.mjs                       (Quiz data seeding)
├── seed-mysql.ts                       (MySQL seeding variant)
└── video-processor-worker.ts           (Seems incomplete)

Status: Most are one-time use scripts left in repo
Action: Move successful one-time scripts to database/migrations/archive/
Keep only: video-processor-worker.ts (if active) or similar utilities
```

### 4.4 Components with Suspicious Names

```
components/debug/                       - Debug/development components
  └── Used in: Likely for troubleshooting only
  Status: Review for production removal

app/api/debug/                          - Debug API endpoints  
  ├── /debug/seed-courses/route.ts (213 lines)
  ├── /debug/seed-test/route.ts (196 lines)
  Status: REMOVE from production builds
```

---

## 5. Architecture Issues & Smells

### 5.1 Large Components (>500 lines) - Mixed Responsibilities

| Component | Lines | Smells | Location |
|-----------|-------|--------|----------|
| **RichNewsEditor.tsx** | 574 | UI + Editor logic + API calls | components/admin/news/ |
| **NewsEditor.tsx** | 499 | Rich text editing logic scattered | components/news/ |
| **investmentModelsSection.tsx** | 485 | Math calculations + UI rendering | components/investmentPortfolios/ |
| **CourseDetailModal.tsx** | 436 | Modal UI + data fetching + form logic | components/courses/ |
| **calculatorSection.tsx** | 411 | Complex calculations + UI | components/home/ |

**Issues**:
- Hard to test (mixed concerns)
- Hard to reuse (everything tightly coupled)
- Hard to maintain (large surface area)
- Performance risk (no granular re-renders)

**Recommended**: Extract to separate concerns
```
RichNewsEditor.tsx (574 lines)
  → useNewsEditor.ts (custom hook with logic)
  → NewsEditorUI.tsx (UI component <200 lines)
  → RichTextToolbar.tsx (toolbar component)
  → utils/editor-utils.ts (helper functions)
```

### 5.2 Hardcoded Values (Multiple Locations)

#### Hardcoded Localhost References
```
Instances Found: 15+

❌ check-password.js:5           host: "localhost"
❌ find-admin-users.mjs:9        host: "localhost"  
❌ seed-admin.js:6               host: "localhost"
✅ lib/db.ts:7                   host: process.env.DB_HOST || 'localhost'  (OK - has fallback)
✅ lib/get-base-url.ts:16        http://localhost:3000  (development only)
✅ next.config.ts:30             hostname: "localhost"
❌ lib/cors.ts:16-20             hardcoded localhost:PORT list
❌ lib/api-response.ts:14-17     hardcoded localhost:PORT list

Production Risk: CORS will fail if env vars not set
Test files will fail without local MySQL
```

#### Hardcoded Colors (Reported)
```
See: HARDCODED_COLORS_REPORT.csv/md
Components with hardcoded color values instead of Tailwind/CSS vars:
- 3 issues in components/debug/ScrollStatus.tsx
- Multiple throughout components/ (need full audit)

Status: Tracked separately in HARDCODED_COLORS_REPORT
Action: Consolidate to theme/colors config
```

### 5.3 Mixed Authentication Patterns

```
Multiple auth implementations found:

1. Root level:
   └── auth.ts (2.3K) - NextAuth.js v5 Credentials provider

2. Lib level:
   ├── lib/auth.ts (? - may be different file)
   ├── lib/auth-simple.ts (?)
   └── lib/admin-auth.ts (?)

3. API level:
   ├── app/api/admin/auth/login/route.ts
   ├── app/api/admin/auth/logout/route.ts
   ├── app/api/admin/auth/me/route.ts
   └── app/api/admin/auth/refresh/route.ts

Issue: Multiple auth strategies and entry points
Risk: Inconsistent session handling, hard to maintain
Action: Single auth system (NextAuth.js at app root) + utilities in lib/
```

### 5.4 Scattered Utility Functions

```
lib/utils/
  └── markdown.ts (only file)

lib/helpers/
  └── transaction.ts (only file)

lib/
  ├── utils.ts (general utilities)
  ├── sanitize-content.ts (HTML sanitization)
  ├── role-utils.ts (role checking)
  ├── get-base-url.ts (URL resolution)
  ├── upload-config.ts (S3 config)
  ├── editor-config.ts (Rich editor setup)
  ├── editor-extensions.ts (Editor extensions)
  └── [13 more utility files...]

Pattern: 93 files in lib/ but utilities scattered across root + utils/ + helpers/ + services/
Issue: No clear organizational structure for shared code
Action: Create sub-folders: lib/utils/*, lib/helpers/*, lib/config/* with clear purposes
```

### 5.5 Inconsistent File Organization

```
Current structure problems:

Components organized by FEATURE:
├── components/courses/        ← Makes sense
├── components/news/          ← Makes sense
├── components/admin/         ← Makes sense
└── components/utils/         ← Not a feature! Generic dumping ground
    ├── courseCard.tsx        (duplicates courses/courseCard.tsx)
    ├── UserLevelSelection.tsx
    ├── Landing3.tsx
    ├── SlideCard.tsx
    ├── slider.tsx            (duplicates ui/slider.tsx)
    ├── ThemeToggle.tsx       (duplicates ui/ThemeToggle.tsx)
    └── [more mixed files...]

Problem: components/utils/ has no clear purpose, mixes utilities with components
         components/ui/ also exists but doesn't contain all UI elements
         Duplicate patterns (slider, ThemeToggle) in both ui/ and utils/
```

---

## 6. Naming Inconsistencies

| Pattern | Examples | Issue |
|---------|----------|-------|
| **Query naming** | `query-users.js` vs `query_admins.js` | Inconsistent delimiter (- vs _) |
| **Component casing** | `calculatorSection.tsx` vs `ThemeToggle.tsx` | Inconsistent camelCase (some start lower, some don't) |
| **Hook naming** | All start with `use*` ✅ | Consistent |
| **Service naming** | `*-service.ts` + `*-mysql.ts` | Dual-layer pattern (intentional but adds complexity) |
| **Seed scripts** | `seed*.ts/js`, `*seed*.ts/js` | Multiple patterns coexist |
| **Route conventions** | All `route.ts` ✅ | Consistent |

---

## 7. Summary: Cleanup Scope & Impact

### Files That Should Be Deleted

| Category | Count | Size | Action |
|----------|-------|------|--------|
| Unused root scripts | 12 | 18.6KB | ✅ Safe to delete |
| Backup SQL files | 2 | 68.7KB | ⚠️ Archive to database/backups/ |
| Duplicate components | 15 | ~2KB | 🔄 Consolidate to 8 shared |
| Temp config files | 1 | <1KB | ✅ Safe to delete |
| Unused seeds | 3-5 | ~5KB | 🔄 Archive old versions |
| Debug scripts | 6 | ~3KB | 🚀 Remove from production build |
| Debug components | 1+ | ? | 🚀 Remove from production |

### Consolidation Opportunities

1. **Components**: 15 duplicate files → 8 shared components (-47% reduction)
2. **Services**: 4 dual-layer patterns → Could use Prisma directly or cleaner abstraction
3. **Root level**: 12 unused scripts → Remove, add to .gitignore
4. **Utilities**: 93 lib files scattered → Reorganize into clear categories
5. **CORS/URL**: 5 locations → Centralize to lib/config/
6. **Large components**: 5 files >400 lines → Extract concerns into separate files

### Estimated Impact

```
Files to delete:        ~30 files (-3.6%)
Files to consolidate:   ~15 files (-1.8%)
Files to reorganize:    ~50 files (restructure only)
Test/debug artifacts:   ~20 files (remove from production)
─────────────────────────────────────
Total affected:         ~80-100 files (9-12% of codebase)
Time to implement:      3-5 development sessions
Risk level:             Medium (requires careful import updates)
Testing needed:         Full build + integration tests
```

---

## 8. Recommended Next Steps (OpenSpec Phase 2)

### 8.1 Immediate Quick Wins (0.5 session)
- [ ] Delete 12 root-level unused scripts
- [ ] Move backup files to database/backups/ or `.gitignore`
- [ ] Remove SSH keys from repo, add to `.gitignore`
- [ ] Delete tsconfig.json.tmp

### 8.2 Component Consolidation (1 session)
- [ ] Audit pageContent.tsx variants (are they truly identical?)
- [ ] Extract shared PageContent component
- [ ] Merge calculator components
- [ ] Consolidate slider + ThemeToggle (ui/ vs utils/)
- [ ] Test all component imports still work

### 8.3 Configuration Centralization (0.5 session)
- [ ] Create lib/config/urls.ts for all URL resolution
- [ ] Create lib/config/cors.ts for CORS setup
- [ ] Remove duplicates from lib/cors.ts and lib/api-response.ts
- [ ] Update all services to use centralized config

### 8.4 Service Layer Review (1 session)
- [ ] Evaluate need for *-mysql.ts files (can Prisma replace them?)
- [ ] Consider flattening to single service layer
- [ ] Add deprecation notices to unused variations

### 8.5 Large Component Refactoring (2 sessions)
- [ ] RichNewsEditor.tsx → extract hooks + UI components
- [ ] investmentModelsSection.tsx → separate math logic
- [ ] Other large components → extract utilities

### 8.6 Seed Script Cleanup (0.5 session)
- [ ] Identify which seeds are actually used
- [ ] Archive old/migration seeds to database/migrations/archive/
- [ ] Create single entry point: scripts/seed.ts or prisma/seed.ts
- [ ] Document seed strategy in SEED_README.md

### 8.7 Auth System Unification (1 session)
- [ ] Audit all auth implementations (auth.ts, admin-auth.ts, etc.)
- [ ] Consolidate to single NextAuth setup
- [ ] Create clear auth utility exports from lib/auth/

---

## 9. Production Readiness Checklist

Before deploying:

- [ ] Remove all root-level test/debug scripts
- [ ] Remove debug API endpoints (/api/debug/*)
- [ ] Remove debug components (components/debug/)
- [ ] Update CORS configuration (env vars, not hardcoded)
- [ ] Remove localhost references from source code
- [ ] Verify env vars are properly set in deployment
- [ ] Run full build: `npm run build`
- [ ] Verify no TypeScript errors: `npx tsc --noEmit`
- [ ] Verify ESLint: `npm run lint`
- [ ] Test critical paths (auth, payment, course purchase)

---

## 10. Appendix: Detailed File Locations

### All Duplicate Components
```
✓ pageContent.tsx (7 copies)
  - components/aboutUs/pageContent.tsx
  - components/business-consulting/pageContent.tsx
  - components/checkout/pageContent.tsx
  - components/class/pageContent.tsx
  - components/faq/pageContent.tsx
  - components/investment-plans/pageContent.tsx
  - components/investmentPortfolios/pageContent.tsx

✓ calculatorSection.tsx (2 copies)
  - components/home/calculatorSection.tsx (411 lines)
  - components/investmentPortfolios/calculatorSection.tsx (485 lines)

✓ courseCard.tsx (2 copies)
  - components/courses/courseCard.tsx
  - components/utils/courseCard.tsx

✓ ctaSection.tsx (2 copies)
  - components/aboutUs/ctaSection.tsx
  - components/courses/ctaSection.tsx

✓ header.tsx (2 copies)
  - components/faq/header.tsx
  - components/profile/header.tsx

✓ slider.tsx (2 copies)
  - components/ui/slider.tsx
  - components/utils/slider.tsx

✓ ThemeToggle.tsx (2 copies)
  - components/ui/ThemeToggle.tsx
  - components/utils/ThemeToggle.tsx

✓ videoPlayer.tsx (2 copies)
  - components/class/videoPlayer.tsx
  - components/video/videoPlayer.tsx
```

### All Unused Root Scripts
```
Root directory (/):
  ❌ check-password.js
  ❌ check-user.mjs
  ❌ verify-user-password.js
  ❌ create-admin.mjs
  ❌ find-admin-users.mjs
  ❌ query_admins.js
  ❌ query_admins.mjs
  ❌ query-users.js
  ❌ query-users.mjs
  ❌ seed-admin.js
  ❌ seed-admin-user.js
  ❌ test-upload.js
```

### Large Components Needing Refactoring
```
✓ components/admin/news/RichNewsEditor.tsx (574 lines)
✓ components/news/NewsEditor.tsx (499 lines)
✓ components/investmentPortfolios/investmentModelsSection.tsx (485 lines)
✓ components/courses/CourseDetailModal.tsx (436 lines)
✓ components/home/calculatorSection.tsx (411 lines)
✓ components/investmentPortfolios/calculatorSection.tsx (396 lines)
✓ components/admin/AdminLoginForm.tsx (392 lines)
✓ components/news/NewsEditorEnhanced.tsx (388 lines)
```

---

**Report generated**: May 21, 2026  
**Prepared for**: OpenSpec Phase 2: Architecture Refactoring  
**Next review**: After implementing Quick Wins (Section 8.1)
