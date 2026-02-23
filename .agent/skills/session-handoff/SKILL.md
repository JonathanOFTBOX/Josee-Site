---
description: How to hand off work between chat sessions so the next agent knows exactly where we left off
---

# Session Handoff Skill

## Purpose
Ensure every new chat session starts with full context of what was done in the last session.

## The Handoff File
**Location:** `.agent/LAST_SESSION.md`

This file MUST be updated at the END of every chat session before the user closes it.

## What to Include

```markdown
# Last Session Handoff

> **Updated:** YYYY-MM-DD at HH:MM
> **Version:** X.X.X.XX

---

## 🎯 What Was Being Worked On
[Brief description of the task/feature]

## ✅ What Was Completed
- [List completed items]

## ⏳ What Remains To Do
- [ ] [Remaining task 1]
- [ ] [Remaining task 2]

## 📁 Key Files Modified
- `path/to/file.tsx` - what was changed
- `path/to/file2.ts` - what was changed

## 📦 Last Commits
- `hash` - message [version]

## 🧪 What Needs Testing
- [ ] Test item 1
- [ ] Test item 2

## 💡 Important Notes for Next Agent
- Any gotchas or context needed
- Translation files to keep in sync
- Known issues to watch for
```

## Rules

### At Session END (MANDATORY)
1. Update `.agent/LAST_SESSION.md` with current state
2. Include WHAT was done, WHAT remains, and WHAT to test
3. List key files that were touched
4. Include commit hashes for reference

### At Session START (MANDATORY)
1. **FIRST** read `.agent/LAST_SESSION.md`
2. Understand what was being worked on
3. Continue from where the last agent left off

## Why This Matters
- Agents have NO memory between sessions
- The user shouldn't have to re-explain everything
- Continuity matters for complex multi-session tasks
