---
description: ALWAYS read this workflow FIRST before doing ANY work on this project. This is mandatory for every new conversation.
trigger: always
---

# Before Starting ANY Work

> **You are Marcus - the only agent working on this project.**

---

## 🔄 STEP 1: Read Last Session (MANDATORY)

**FIRST**, read what was done in the previous session:

```
view_file(".agent/LAST_SESSION.md")
```

This tells you:
- What was being worked on
- What was completed
- What remains to do
- Key files that were modified

---

## 📋 STEP 2: Understand the Project

Read these files to understand the project:

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `.agent/LAST_SESSION.md` | What was done last |
| 2 | `.agent/PROJECT_CONTEXT.md` | App overview |
| 3 | `.agent/CRITICAL_FILES.md` | Key file locations |
| 4 | `.agent/ROADMAP.md` | Feature status |

---

## 🛡️ CORE RULES

### Rule 1: Extract Over Edit (500 Line Limit)
- **Before editing ANY file**, check its line count
- **If file > 500 lines**: Create a NEW file instead
- Extract the component/logic to a new file and import it

### Rule 2: No Hardcoded Text (i18n)
- **NEVER** write text directly in JSX
- **ALWAYS** use `{t('section.key')}`
- **ALWAYS** add keys to BOTH `en.ts` AND `fr.ts`

### Rule 3: Mobile + Desktop
- Every UI change must work on mobile (375px) AND desktop (1280px+)
- Minimum touch target: 44x44 pixels

### Rule 4: Version Updates
Before every commit, update BOTH:
- `client/src/lib/version-check.ts` → APP_VERSION
- `client/public/sw.js` → SW_VERSION

### Rule 5: Database Schema (MANDATORY)
**NEVER guess column names.** Before writing ANY SQL or referencing DB columns:
- **READ** `.agent/skills/database-schema/SKILL.md` FIRST
- This file has ALL tables and ALL columns with correct names
- If you add new tables/columns to Supabase, UPDATE this skill file immediately
- Use Supabase SQL Editor queries to see REAL data when debugging
- Compare expected vs actual values in tables

### Rule 6: Full Data Path Verification (MANDATORY)
**When adding or modifying ANY data field**, trace the FULL path BEFORE building:
1. **DB column** — Does it exist in Supabase? Check `database-schema/SKILL.md`. If not, migration first.
2. **SELECT queries** — grep ALL `.select()` calls for that table. If they list specific columns (not `*`), ADD the new column to EACH query.
3. **Type mapping** — Check `supabaseJobToJob()` / `supabaseSessionToSession()` in `types.ts`. Is the field mapped?
4. **Shared schema** — Check `shared/schema.ts`. Is the Drizzle column defined? Does it match the actual DB?
5. **Component type** — Does the component use `Job` from `@shared/schema` or `AppJob`? The field must exist on THAT type.
6. **Insert/Update** — Does `createJob()` / `updateJob()` include it? **NEVER insert a column that doesn't exist in the DB.**

**Failure to check ALL 6 steps = broken deploy. No exceptions.**

---

## ✅ STEP 3: Do the Work

1. Create/update `task.md` with your checklist
2. Do the work
3. Run `npm run build` to verify
4. Update version in both files
5. Commit and push

---

## 🔚 STEP 4: End of Session (MANDATORY)

**BEFORE ending the session**, you MUST update:

### `.agent/LAST_SESSION.md`
- What you worked on
- What you completed
- What remains to do
- Key files modified
- What needs testing

### `.agent/DEV_LOG.md` — **[CRITICAL]**
- Add a `[FIX-YYYYMMDD-HHMM]` entry using the format from `marcus-workflow/SKILL.md` §2
- Include: files modified, impact check (DB/PDF/API), summary
- If a SQL migration was needed, note it here
- **If this is not done, the mission is NOT complete**

### `.agent/walkthroughs/YYYY-MM-DD_HHMM_Task-Name.md`
- Detailed record of changes
- Screenshots if relevant
- Commit hashes

---

## 📂 Key Directories

| Path | Purpose |
|------|---------|
| `client/src/pages/boss/` | Boss/admin pages |
| `client/src/pages/worker/` | Worker pages |
| `client/src/components/` | Shared components |
| `client/src/lib/translations/` | EN/FR translation files |
| `.agent/skills/` | How-to guides for specific tasks |
| `.agent/walkthroughs/` | Records of completed work |

---

## 🔧 Useful Skills

| Skill | When to Use |
|-------|-------------|
| `/database-schema` | **ALWAYS CHECK** - Before writing ANY SQL or referencing DB columns |
| `/bug-tracking` | **USER REPORTS A BUG** - Add it to LAST_SESSION.md immediately |
| `/code-reuse` | **ALWAYS CHECK FIRST** - Before creating ANY new utility/function |
| `/powershell-syntax` | **GIT COMMANDS** - Use semicolons not && for chaining |
| `/i18n-translations` | Adding/fixing translations |
| `/session-handoff` | How to hand off between sessions |
| `/walkthrough-documentation` | How to document work |
| `/deploy-verify` | Version updates and deploy |

To use a skill, read: `.agent/skills/[skill-name]/SKILL.md`
