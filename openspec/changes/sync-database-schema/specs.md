# Database Schema Synchronization - Specifications

## SQL Schema Changes Required

### Phase 1: Core Tables (3 hours)

#### 1.1 Comment Table Fix
**Current Issues**: 
- Field name: `content` (should be `text`)
- `userId` is required (should be optional)
- Missing: `userName`, `userAvatar`, `userRole`, `userCompany`
- Missing: `likes`, `dislikes`, `published`, `verified`, `featured`, `views`

**SQL Changes**:
```sql
ALTER TABLE Comment
  CHANGE COLUMN content text LONGTEXT,
  MODIFY COLUMN userId VARCHAR(191) NULL,
  MODIFY COLUMN rating INT NULL,
  ADD COLUMN userName VARCHAR(191),
  ADD COLUMN userAvatar VARCHAR(191),
  ADD COLUMN userRole VARCHAR(191),
  ADD COLUMN userCompany VARCHAR(191),
  ADD COLUMN categoryId VARCHAR(191),
  ADD COLUMN likes JSON DEFAULT '[]' ,
  ADD COLUMN dislikes JSON DEFAULT '[]',
  ADD COLUMN published TINYINT(1) DEFAULT 0,
  ADD COLUMN verified TINYINT(1) DEFAULT 0,
  ADD COLUMN featured TINYINT(1) DEFAULT 0,
  ADD COLUMN views INT DEFAULT 0;
```

#### 1.2 Order Table Fix
**Current Issues**:
- Column name: `totalPrice` (should be `total`)
- Missing: `items`, `paymentRef`

**SQL Changes**:
```sql
ALTER TABLE Order
  CHANGE COLUMN totalPrice total INT DEFAULT 0,
  ADD COLUMN items JSON,
  ADD COLUMN paymentRef VARCHAR(191);
```

#### 1.3 Quiz Table Enhancement
**Current Issues**:
- `courseId` is required (should be optional)
- Missing: `categoryId`, `timeLimit`, `passingScore`, `maxAttempts`, quiz flags

**SQL Changes**:
```sql
ALTER TABLE Quiz
  MODIFY COLUMN courseId VARCHAR(191) NULL,
  ADD COLUMN categoryId VARCHAR(191),
  ADD COLUMN timeLimit INT NULL,
  ADD COLUMN passingScore INT DEFAULT 70,
  ADD COLUMN maxAttempts INT NULL,
  ADD COLUMN shuffleQuestions TINYINT(1) DEFAULT 0,
  ADD COLUMN shuffleAnswers TINYINT(1) DEFAULT 0,
  ADD COLUMN showResults TINYINT(1) DEFAULT 1,
  ADD COLUMN showCorrectAnswers TINYINT(1) DEFAULT 1;
```

#### 1.4 Lesson Table Enhancement
**Current Issues**:
- Direct `videoUrl` (should be FK to Video)
- Missing: `videoId`, `thumbnail`, `duration`, `published`, `views`

**SQL Changes**:
```sql
ALTER TABLE Lesson
  ADD COLUMN videoId VARCHAR(191),
  ADD COLUMN thumbnail VARCHAR(191),
  ADD COLUMN duration VARCHAR(191),
  ADD COLUMN published TINYINT(1) DEFAULT 1,
  ADD COLUMN views INT DEFAULT 0;
```

#### 1.5 Transaction Table Enhancement
**Current Issues**:
- `userId` is required (should be optional)
- Missing: `orderId`, `gateway`, `refNumber`, `description`

**SQL Changes**:
```sql
ALTER TABLE Transaction
  MODIFY COLUMN userId VARCHAR(191) NULL,
  ADD COLUMN orderId VARCHAR(191),
  ADD COLUMN gateway VARCHAR(191),
  ADD COLUMN refNumber VARCHAR(191),
  ADD COLUMN description VARCHAR(500);
```

---

### Phase 2: New Content Tables (2.5 hours)

#### 2.1 Video Table
**Purpose**: Store video metadata for lessons

**Columns**:
- `id` (PK)
- `title` (required)
- `url` (file URL)
- `thumbnail` (preview image)
- `duration` (seconds)
- `fileSize` (bytes)
- `processingStatus` (PENDING/PROCESSING/DONE/FAILED)
- `uploadProgress` (0-100%)
- `uploadedBy` (FK to User)
- `uploadedAt`, `createdAt`, `updatedAt`

#### 2.2 Image Table
**Purpose**: Store user-uploaded images

**Columns**:
- `id` (PK)
- `url` (required)
- `userId` (FK, required)
- `category` (optional classification)
- `width`, `height` (dimensions)
- `fileSize` (bytes)
- `uploadedAt`, `createdAt`, `updatedAt`

#### 2.3 ContentBlock Table
**Purpose**: Block-based content for news articles

**Columns**:
- `id` (PK)
- `newsId` (FK, required)
- `type` (TEXT/HEADING/IMAGE/GALLERY/QUOTE/LIST)
- `content` (JSON, flexible structure)
- `sortOrder` (display order)
- Unique constraint: (newsId, sortOrder)

#### 2.4 News Table Enhancement
**Current State**: Simple title + content
**Target State**: Block-based with metadata

**Changes**:
- Remove: `content`, `published`
- Add: `slug` (unique), `description`, `thumbnail`
- Add: `status` (DRAFT/PUBLISHED/ARCHIVED)
- Add: `categoryId` (FK to Category)
- Add: `authorId` (FK to User, required)
- Add: `publishedAt` (timestamp)

---

### Phase 3: Landing & Config Tables (1.5 hours)

#### 3.1 HomeLanding Enhancement
**Add Columns**:
- Hero section: `heroTitle`, `heroSubtitle`, `heroDescription`
- Stats: `statsData` (JSON array)
- Why us section: `whyUsTitle`, `whyUsDescription`, `whyUsItems` (JSON)
- News club: `newsClubTitle`, `newsClubDescription`
- Calculator: `calculatorTitle`, `calculatorDescription`, rates, portfolio options
- Calculator amounts/durations: `calculatorAmountSteps`, `calculatorDurationSteps` (JSON)
- Meta: `metaTitle`, `metaDescription`, `metaKeywords`

#### 3.2 MobileScrollerStep Enhancement
**Add Columns**:
- `imageUrl` (in-mobile image)
- `coverImageUrl` (mobile background)
- `gradient` (CSS gradient class)
- `link` (button link)

#### 3.3 PageContent Table (NEW)
**Purpose**: Flexible page content management

**Columns**:
- `id` (PK)
- `categoryId` (FK to Category, required)
- `type` (LANDING/ABOUT/FEATURES/FAQ/TESTIMONIAL/HERO/STATS)
- `section` (section identifier)
- `title`, `subtitle`
- `content` (JSON, flexible)
- `language` (FA/EN)
- `order` (display order)
- `published`, `publishAt`, `expireAt`

#### 3.4 SkyRoomClass Table (NEW)
**Purpose**: Store Skyroom meeting links

**Columns**:
- `id` (PK)
- `meetingLink` (required)
- `published`

---

## Validation Specifications

### After Each Phase
- ✓ Record counts unchanged
- ✓ No NULL violations
- ✓ Foreign keys valid
- ✓ Indexes properly created
- ✓ Data types match Prisma schema

### Final Validation
```bash
# Check schema matches
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Check TypeScript
npx tsc --noEmit

# Build and test
npm run build
npm run dev
```

---

## Data Integrity Rules

1. **Comment Table**: 
   - Preserve all existing comments
   - Set `userId` to NULL for orphaned comments (if any)
   - Default new JSON fields to empty

2. **Order Table**:
   - Rename `totalPrice` → `total` preserves data
   - Add `items` JSON from existing order relationships
   - `paymentRef` nullable for existing orders

3. **News Table**:
   - Generate `slug` from `title` (need migration script)
   - Set `status` = 'PUBLISHED' if old `published` = 1
   - Set `status` = 'DRAFT' if old `published` = 0
   - Set `authorId` to default admin user

4. **All New Columns**:
   - Use sensible defaults (NULL, empty JSON, etc.)
   - No data loss

---

## Error Handling

| Error | Solution |
|-------|----------|
| JSON defaults rejected | Use CHECK constraints or triggers |
| FK constraints fail | Add constraints AFTER creating tables |
| NULL violations | Review data first, migrate if needed |
| Data type mismatch | Use CAST in UPDATE statements |
| Timeout on large table | Run during maintenance window |

---

## Test Cases

1. **Query existing data**:
   ```sql
   SELECT COUNT(*) FROM Comment; -- Should match before/after
   SELECT COUNT(*) FROM Order;
   SELECT * FROM News LIMIT 1; -- Verify slug generated
   ```

2. **Test relationships**:
   ```sql
   SELECT * FROM Lesson WHERE videoId IS NOT NULL; -- Should work after Video created
   SELECT * FROM News n JOIN User u ON n.authorId = u.id; -- FK test
   ```

3. **Application tests**:
   - API calls work
   - Database queries return correct types
   - No validation errors
