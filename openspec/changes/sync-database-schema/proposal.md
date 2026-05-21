# Database Schema Synchronization - Proposal

## Overview
Synchronize the MySQL database schema with Prisma ORM schema to enable seamless ORM usage and type safety. Currently, there's significant drift between the two schemas causing validation and compatibility issues.

## Problem Statement
- **Current State**: SQL schema is minimal; Prisma schema is comprehensive with many models not in database
- **Issues**: 
  - Prisma `db push` fails due to missing columns and constraint issues
  - Field name mismatches (e.g., `content` vs `text`)
  - Data type incompatibilities (nullable/required conflicts)
  - Missing relationships and foreign keys
  - 20+ Prisma models not reflected in SQL

## Goals
1. **Fix existing tables** to match Prisma schema (Comment, Order, Quiz, Lesson, Transaction)
2. **Create missing tables** for content management (Video, Image, ContentBlock)
3. **Enhance landing/config tables** (HomeLanding, PageContent, SkyRoomClass)
4. **Resolve all data conflicts** without losing existing data
5. **Enable Prisma integration** for type-safe database operations

## Success Criteria
- ✅ All Prisma migrations complete without errors
- ✅ No data loss
- ✅ Database passes Prisma validation
- ✅ Application builds and runs
- ✅ Existing queries and functionality preserved

## Scope
- **In Scope**: MySQL schema updates to match Prisma; data migration; validation
- **Out of Scope**: Prisma schema changes; application logic refactoring

## Timeline
- Phase 1 (Core Tables): 2-3 hours
- Phase 2 (Content Tables): 2-3 hours  
- Phase 3 (Config Tables): 1-2 hours
- Testing & Validation: 1-2 hours
- **Total**: 6-10 hours over 2-3 days

## Resources
- Backup SQL: `/database/migrations/backup-before-migration.sql`
- Migration Scripts: `/database/migrations/phase-*.sql`
- Schema Comparison: `/memories/session/schema-audit.md`
