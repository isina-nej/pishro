# Database Schema Synchronization - Design

## Architecture Overview

```
Current State          Target State           Implementation
┌──────────────┐       ┌──────────────┐      ┌──────────────────┐
│ SQL Schema   │       │ Prisma ORM   │      │ Migration Steps  │
│ (Minimal)    │  -->  │ (Complete)   │  -->  │ (Phase 1-3)      │
└──────────────┘       └──────────────┘      └──────────────────┘
```

## Migration Phases

### Phase 1: Fix Core Tables (WITH DATA)
**Priority**: CRITICAL - These tables have existing data and are actively used

#### Changes:
1. **Comment Table**
   - `content` → `text` (column rename)
   - Make `userId` nullable (currently required)
   - Add missing columns: `userName`, `userAvatar`, `userRole`, `userCompany`
   - Add engagement: `likes`, `dislikes`, `views`, `published`, `verified`, `featured`
   - Add `categoryId` for category relationships

2. **Order Table**
   - `totalPrice` → `total` (rename)
   - Add `items` as JSON
   - Add `paymentRef`

3. **Quiz Table**
   - Make `courseId` nullable
   - Add `categoryId` 
   - Add quiz settings: `timeLimit`, `passingScore`, `maxAttempts`, `shuffleQuestions`, etc.

4. **Lesson Table**
   - Add `videoId` FK to new Video table
   - Add `thumbnail`, `duration`, `published`, `views`

5. **Transaction Table**
   - Make `userId` nullable
   - Add `orderId` FK
   - Add `gateway`, `refNumber`, `description`

**Strategy**: ALTER TABLE with safe defaults, preserve existing data

---

### Phase 2: Create Content Tables (NEW TABLES)
**Priority**: HIGH - Required for content management

#### New Tables:
1. **Video Table** - Store video metadata
2. **Image Table** - Store user images
3. **ContentBlock Table** - Block-based news content
4. **Enhance News Table** - Add slug, description, thumbnail, status, authorId, categoryId

**Strategy**: CREATE TABLE IF NOT EXISTS, no data conflicts

---

### Phase 3: Enhance Landing/Config Tables (EXISTING + NEW)
**Priority**: MEDIUM - For site configuration

#### Changes:
1. **HomeLanding**: Add hero fields, calculator config, meta tags
2. **MobileScrollerStep**: Add imageUrl, coverImageUrl, gradient, link
3. **Create PageContent Table** - Flexible page content management
4. **Create SkyRoomClass Table** - For Skyroom meetings

**Strategy**: ALTER TABLE with defaults, create new tables

---

## Data Migration Strategy

### Conflict Resolution

| Scenario | Solution |
|----------|----------|
| Adding nullable column | Use NULL as default |
| Renaming column | Use ALTER RENAME, data preserved |
| Making required field optional | ALTER MODIFY NULL |
| Adding JSON default | Use empty JSON `[]` or `{}` |
| Foreign key conflicts | Add FK after table creation |

### Backup & Recovery
```sql
-- Before each phase
mysqldump pishro > backup-phase-N.sql

-- Recovery if needed
mysql pishro < backup-phase-N.sql
```

---

## Implementation Order

1. **Backup existing database** ✓
2. **Fix MySQL issues** (JSON defaults)
3. **Execute Phase 1** (ALTER existing tables)
4. **Validate data integrity**
5. **Execute Phase 2** (CREATE new tables)
6. **Execute Phase 3** (Enhance config)
7. **Run Prisma validation**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
8. **Test application**

---

## Validation Checkpoints

After each phase:
- ✓ Confirm record counts unchanged
- ✓ Verify FKs valid
- ✓ Check data types match Prisma
- ✓ No NULL violations
- ✓ Indexes created

---

## Rollback Plan

Each migration file includes rollback commands:
- Keep backups at: `database/migrations/backup-phase-*.sql`
- Rollback commands in SQL files (commented)
- Document any manual cleanup needed

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Data loss | Full backup before each phase |
| FK conflicts | Test in dev first, add constraints carefully |
| NULL violations | Add defaults, review data first |
| Large tables timeout | Run during maintenance window |
| Prisma conflict | Keep backup of prisma/schema.prisma |

---

## Tools & Commands

```bash
# Backup
mysqldump pishro > backup.sql

# Execute migrations
mysql pishro < phase-1-fix-core-tables.sql
mysql pishro < phase-2-content-tables.sql
mysql pishro < phase-3-landing-config.sql

# Validate
npx prisma db push
npx prisma generate
npx tsc --noEmit

# Test
npm run build
npm run dev
```
