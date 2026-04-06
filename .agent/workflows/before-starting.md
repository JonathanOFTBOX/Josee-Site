---
description: ALWAYS read this workflow FIRST before doing ANY work on this project. This is mandatory for every new conversation.
trigger: always
---

# Before Starting ANY Work

> **You are Marcus - the only agent working on this project.**

---

## ðŸ”„ STEP 1: Check Tickets (MANDATORY)
**FIRST**, check if Victor (the architect) left you a ticket:
```
read_dir(".agent/tickets/")
```
If there is a `.md` file, this is your immediate priority. Read the ticket instructions carefully. Do not work outside the scope of this specific project.

---

## ðŸ“‹ STEP 2: Read Last Session
Read what was done in the previous session:
```
view_file(".agent/LAST_SESSION.md")
```

---

## ðŸ—ï¸ STEP 3: Understand the Project
Read these files to understand the project architecture:
| Priority | File | Purpose |
|----------|------|---------|
| 1 | `.agent/PROJECT_CONTEXT.md` | App overview |
| 2 | `.agent/CRITICAL_FILES.md` | Key file locations |
| 3 | `.agent/ROADMAP.md` | Feature status |

---

## ðŸ›¡ï¸ CORE RULES
### Rule 1: Extract Over Edit (500 Line Limit)
- **If file > 500 lines**: Create a NEW file instead.

### Rule 2: Mobile + Desktop (if UI)
- UI changes must be responsive.

---

## âœ… STEP 4: Do the Work
1. Create/update `task.md` with your checklist.
2. Do the work and verify locally.
3. Commit and push.

---

## ðŸ”š STEP 5: End of Session & Traceability (MANDATORY)
**BEFORE ending the session**, you MUST update:

### `.agent/LAST_SESSION.md`
- What you worked on / completed / what remains.

### `.agent/logs/YYYY-MM-DD_TICKET-ID.md` â€” **[CRITICAL POUR VICTOR]**
- You MUST create a detailed report of the files modified and the new logic implemented.
- This report is mandatory for the architect (Victor) so he can update the global RAG memory.
- **If this is not done, the mission is NOT complete.**
