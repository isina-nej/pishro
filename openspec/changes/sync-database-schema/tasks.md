# Database Schema Synchronization - Tasks

## Phase 1: Fix Core Tables (Data-Preserving)

- [ ] **1.1** Fix JSON default issue in migration file (remove defaults for likes/dislikes)
- [ ] **1.2** Execute Phase 1 SQL: Comment, Order, Quiz, Lesson, Transaction fixes
- [ ] **1.3** Validate record counts unchanged after Phase 1
- [ ] **1.4** Verify FK constraints and data integrity

## Phase 2: Create Content Tables

- [ ] **2.1** Fix News table ALTER (handle missing authorId)
- [ ] **2.2** Create Video table with all columns and FKs
- [ ] **2.3** Create Image table with all columns and FKs
- [ ] **2.4** Create ContentBlock table for block-based news
- [ ] **2.5** Enhance News table: add slug, description, thumbnail, status, authorId, categoryId
- [ ] **2.6** Migrate existing news data (generate slugs, set defaults)
- [ ] **2.7** Add FK: Lesson.videoId → Video.id
- [ ] **2.8** Validate Phase 2 results

## Phase 3: Landing & Config Tables

- [ ] **3.1** Enhance HomeLanding with hero, stats, calculator fields
- [ ] **3.2** Enhance MobileScrollerStep with images and links
- [ ] **3.3** Handle existing HomeLanding data (add defaults)
- [ ] **3.4** Handle existing MobileScrollerStep data (add defaults)
- [ ] **3.5** Create PageContent table
- [ ] **3.6** Create SkyRoomClass table
- [ ] **3.7** Validate Phase 3 results

## Prisma Integration

- [ ] **4.1** Run `npx prisma db push` to validate schema
- [ ] **4.2** Run `npx prisma generate` to regenerate client
- [ ] **4.3** Run `npx tsc --noEmit` to check TypeScript
- [ ] **4.4** Run `npm run build` to verify build

## Testing & Validation

- [ ] **5.1** Test existing API endpoints work
- [ ] **5.2** Test database queries return correct types
- [ ] **5.3** Verify no data loss in any table
- [ ] **5.4** Run `npm run dev` and test UI
- [ ] **5.5** Document any manual data cleanup needed

## Finalization

- [ ] **6.1** Archive openspec change
- [ ] **6.2** Commit migration files to git
- [ ] **6.3** Update project documentation
- [ ] **6.4** Notify team of schema changes
