---
name: Data Flow Verification Checklist
description: MANDATORY checklist when adding/modifying any data field. Trace the FULL path before deploying. Prevents broken connections.
---

# Data Flow Verification Checklist

## WHEN TO USE
**EVERY TIME** you add, rename, or modify a data field that flows between DB and UI. This is MANDATORY before running `npm run build`.

## THE FULL PATH (check ALL of these)

### 1. Database Column
- [ ] Does the column exist in Supabase? Check `database-schema/SKILL.md`
- [ ] If NOT, create a migration SQL and run it BEFORE deploying
- [ ] Verify with: `SELECT column_name FROM information_schema.columns WHERE table_name = 'TABLE'`

### 2. Supabase SELECT Queries
- [ ] Search ALL `.select()` calls that query this table
- [ ] Use: `grep_search` for the table name in `JobProvider.ts`, `SessionProvider.ts`, etc.
- [ ] **CRITICAL**: If the select uses specific columns (not `*`), ADD the new column
- [ ] Common miss: `getAllJobs()`, `getAssignedJobs()`, `getJobById()`, `getJobsByStatus()`

### 3. Type Mapping (SupabaseJob → AppJob)
- [ ] Check `supabaseJobToJob()` in `client/src/api/types.ts` — is the field mapped?
- [ ] Check `SupabaseJob` interface — does it include the DB column?
- [ ] Check `AppJob` or shared `Job` type — does it include the camelCase field?

### 4. Shared Schema
- [ ] Check `shared/schema.ts` — is the Drizzle column defined?
- [ ] The `Job` type is auto-inferred: `typeof jobs.$inferSelect`
- [ ] If the column exists in Drizzle but NOT in DB, it will cause runtime errors

### 5. Component Usage
- [ ] Verify the component accessing the field uses the correct type
- [ ] If component imports `Job` from `@shared/schema`, the field must be in Drizzle
- [ ] If component uses `AppJob`, the field must be in `supabaseJobToJob()`

### 6. CreateJob / UpdateJob Payloads
- [ ] Check `CreateJobPayload` interface — is the field included?
- [ ] Check `createJob()` — does the insert include the DB column?
- [ ] Check `updateJob()` — does the update handle the field?
- [ ] **NEVER** insert a column that doesn't exist in the actual DB

## QUICK GREP COMMANDS
```
# Find all select queries for a table:
grep_search "from(\"jobs\")" in JobProvider.ts

# Find all references to a field:
grep_search "field_name" in client/src/api/

# Check if column exists in DB schema skill:
grep_search "column_name" in .agent/skills/database-schema/SKILL.md
```

## COMMON MISTAKES TO AVOID
1. **Adding a field to insert but column doesn't exist in DB** → 400 error
2. **Column exists in DB but not in SELECT query** → field is always null
3. **Field mapped in supabaseJobToJob but not fetched** → undefined
4. **Drizzle schema has column but DB migration never ran** → runtime crash
