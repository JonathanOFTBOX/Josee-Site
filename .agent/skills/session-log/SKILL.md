---
name: Session Log Management
description: How to properly update LAST_SESSION.md - NEVER delete, only append new entries
---

# Session Log Management Skill

## 🚨 CRITICAL RULE: NEVER DELETE ENTRIES

The `LAST_SESSION.md` file is a **running log** of all work done on this project. 

### DO:
- ✅ **ADD** new version entries at the TOP (after the header)
- ✅ **UPDATE** the `Current Version` header
- ✅ **APPEND** new Known Issues / TODOs
- ✅ **ADD** new Key Files if new features are created

### DON'T:
- ❌ **NEVER** overwrite the entire file
- ❌ **NEVER** delete older version entries
- ❌ **NEVER** remove Known Issues (mark them ✅ when done instead)

---

## Format for New Version Entries

When deploying a new version, add this block RIGHT AFTER the `## ✅ Deployed Tonight` header:

```markdown
### v1.0.10.XXX - Brief Description
**Files Modified:**
- `path/to/file1.ts` - What changed
- `path/to/file2.tsx` - What changed

**How it works:**
- Bullet points explaining the change
- Why it was needed
- How it fixes the issue
```

---

## Updating the Header

Always update the version number at the top:

```markdown
# Last Session Summary - [Date]

## Current Version: v1.0.10.XXX
```

---

## Why This Matters

1. **History Tracking**: We can see what was tried and what worked
2. **Rollback Info**: If something breaks, we know what to undo
3. **Context for Future Sessions**: New sessions can pick up where we left off
4. **Debugging Reference**: See related fixes if issues resurface

---

## Example: Adding a New Fix

```typescript
// 1. Read current file first
view_file(".agent/LAST_SESSION.md")

// 2. Use replace_file_content to INSERT new entry after the "Deployed Tonight" header
// Target the header and add new content BEFORE existing entries
```
