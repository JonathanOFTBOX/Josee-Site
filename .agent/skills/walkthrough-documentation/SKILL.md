---
description: How to maintain persistent walkthrough documentation for all work done
---

# Walkthrough Documentation Skill

## Purpose
Maintain a persistent record of all work done on the project that survives beyond conversation sessions.

## Location
**ALL walkthroughs MUST be saved to:** `.agent/walkthroughs/YYYY-MM-DD_HHMM_Subject-Title.md`

Example: `.agent/walkthroughs/2026-01-21_1457_i18n-Translation-Audit.md`

## Format
```markdown
# [Task Name] - Walkthrough

> **Date:** YYYY-MM-DD
> **Version:** X.X.X.XX
> **Agent:** [Name]

---

## Summary
Brief description of what was accomplished.

---

## Changes Made

### [Component/File Category]
| File | Changes | Status |
|------|---------|--------|
| [filename.tsx](file:///path) | Description | ✓ |

---

## Translation Keys Added (if applicable)
| Category | Count |
|----------|-------|
| Section | X |

---

## Commits
- `hash` - message

---

## User Testing Required
- [ ] Test item 1
- [ ] Test item 2
```

## Rules

1. **Update DURING work, not just at the end**
   - Add entries as you complete each component
   - Don't wait until session end

2. **Save to BOTH locations:**
   - Conversation artifacts: `C:\Users\jogor\.gemini\antigravity\brain\[conversation-id]\walkthrough.md`
   - Project directory: `.agent/walkthroughs/[date]-[task-name].md`

3. **Use file links** so user can click to open files

4. **Include commit hashes** for traceability

5. **List what needs testing** so user knows what to verify

## When to Update
- After each component is fixed/translated
- After each successful build
- After each commit
- Before ending a session
