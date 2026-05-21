# Enterprise-Grade Architecture Refactor

## Why

The Pishro Sarmaye codebase has grown organically with 223 components, 93+ utilities, and 50+ root-level files. Critical issues prevent enterprise scalability:

### Current Problems
1. **Root Directory Chaos**: 12 unused scripts, SSH keys exposed, unmaintained files
2. **Massive Code Duplication**: pageContent.tsx (7 copies), calculatorSection.tsx (2 copies), 15+ duplicate components
3. **Giant Components**: RichNewsEditor (574 lines), NewsEditor (499 lines), mixed concerns
4. **Scattered Architecture**: 
   - Utilities split across lib/utils/, lib/helpers/, lib/config/
   - Auth patterns inconsistent (auth.ts, admin-auth.ts, endpoints)
   - CORS logic duplicated
   - URL resolution hardcoded in multiple places
5. **Service Layer Redundancy**: 4 domain services with unnecessary MySQL wrapper layers

### Impact
- **Developer Experience**: 30+ minute onboarding to understand where to put new code
- **Maintenance Burden**: Duplicate fixes across 15 component copies
- **Type Safety**: Scattered utilities cause import confusion
- **Testing**: Giant components impossible to unit test
- **Build Size**: Duplicated code increases bundle
- **Performance**: Redundant service layers add latency

## What Changes

### Scope
Transform production codebase from scattered chaos into clean, domain-driven enterprise architecture:

1. **Clean Root Directory**: Remove 30 unused/dead files
2. **Consolidate Duplicates**: Merge 15 duplicate components into 8 shared components
3. **Reorganize by Domain**: Create feature-driven structure (auth, courses, news, admin, etc.)
4. **Centralize Utilities**: Consolidate scattered utilities into single source
5. **Extract Concerns**: Split giant components into smaller, testable modules
6. **Normalize Services**: Remove unnecessary MySQL wrapper layers

### Target Architecture
```
src/
├── app/                    # Next.js App Router
├── features/              # Domain-driven modules
│   ├── auth/
│   ├── courses/
│   ├── news/
│   ├── admin/
│   ├── checkout/
│   ├── library/
│   └── profile/
├── shared/               # Reusable across features
│   ├── ui/              # UI components
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   ├── constants/       # Constants
│   ├── types/           # TypeScript types
│   └── schemas/         # Zod schemas
├── server/              # Server-only code
│   ├── auth/
│   ├── db/
│   ├── services/
│   └── storage/
├── infrastructure/      # Cross-cutting concerns
├── styles/
├── tests/
└── public/

root/
├── app/                 # App Router files
├── prisma/
├── openspec/
├── public/
├── package.json
├── tsconfig.json
└── [config files only]
```

## Non-Goals

- Changing database schema or Prisma structure
- Modifying runtime behavior or business logic
- Rewriting existing features
- Changing authentication/authorization logic
- Modifying payment or upload systems
- Breaking any routes or API endpoints

## Capabilities

### New
- **Feature-driven structure**: Each domain has clear boundaries
- **Shared component library**: Consolidated UI, hooks, utilities
- **Service layer**: Unified database access pattern (no redundant MySQL wrappers)
- **Type system**: Centralized schemas and types
- **Developer onboarding**: Clear where to place new code

### Modified
- **Import paths**: Updated to reflect new structure
- **File organization**: 30+ files deleted, 15+ consolidated
- **Utility locations**: Centralized in shared/
- **Component structure**: Large components split

### Removed
- Root-level unused scripts (12 files)
- Duplicate components (15 files)
- Unnecessary MySQL wrappers (4 patterns)
- SSH keys from repo (security)

## Impact

| Aspect | Change | Impact |
|--------|--------|--------|
| **Files** | -45 files consolidated | -9% clutter, +45% clarity |
| **Imports** | Path updates across 200+ files | Medium risk (automated) |
| **Bundle** | -~15KB from duplicates | 1-2% size reduction |
| **Build Time** | Similar or faster | No regression |
| **Runtime** | Zero changes | 100% backward compatible |
| **API/Routes** | No changes | Fully compatible |
| **Database** | No schema changes | Fully compatible |

## Implementation Priority

### Phase 1 (Session 1-2): Foundation
- [ ] Delete 12 unused root scripts
- [ ] Delete 4 admin/query scripts
- [ ] Remove SSH keys
- [ ] Create new directory structure
- [ ] Document in OpenSpec tasks

### Phase 2 (Session 2-3): Consolidation
- [ ] Merge duplicate components
- [ ] Extract concerns from giant components
- [ ] Centralize utilities
- [ ] Flatten service layers

### Phase 3 (Session 3-4): Migration
- [ ] Update all imports (automated scripts)
- [ ] Move files to new locations
- [ ] Update TypeScript references
- [ ] Fix route handlers

### Phase 4 (Session 4): Validation
- [ ] TypeScript full check
- [ ] ESLint validation
- [ ] Build test
- [ ] Runtime validation
- [ ] Document final state

## Success Criteria

✅ All tests pass
✅ TypeScript strict mode passes
✅ ESLint clean
✅ Next.js build succeeds
✅ Zero import errors
✅ Zero runtime errors
✅ All routes functional
✅ Database compatible
✅ API endpoints working
✅ Zero functionality broken
