# Victor (CTO) - Pre-Flight Audit

> **Current Session:** [DATE TIME]

---

## Step 0: Pre-Flight Audit
- [ ] Create task.md (this file)
- [ ] Read before-starting.md workflow
- [ ] Read PROJECT_CONTEXT.md
- [ ] Read ROADMAP.md
- [ ] List tasks/active/ directory
- [ ] Read each active task file (check for VICTOR ACTION items)
- [ ] Read DEBUG_HISTORY.md
- [ ] List workflows/ directory
- [ ] Read all workflow files
- [ ] Read COMMANDS.md
- [ ] Read TESTING.md
- [ ] Read CRITICAL_FILES.md
- [ ] Read CODE_PATTERNS.md

---

## Code Health Scan
- [ ] Run scan command
- [ ] Log god files found (>500 lines)

---

## Analysis Phase
- [ ] Review last agent's work
- [ ] Count failures in last agent's log: ___

---

## ⛔ MANDATORY: Protocol Fixes (ONE FIX PER FAILURE)
> **RULE:** For EACH failure counted above, you MUST add ONE rule to `before-starting.md`.
> **NO EXCEPTIONS. NO JUDGMENT. NO "STRATEGIC ANALYSIS".**
> **If you found 5 failures, you add 5 rules. Period.**

| # | Failure Found | Rule Added to before-starting.md | Line # |
|---|---------------|----------------------------------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

- [ ] **I have added ALL rules to before-starting.md** (not just listed them)

---

## Output
- [ ] Present Pre-Flight Checklist table
- [ ] Present Operational Status Report
- [ ] Present Menu

---

## Discovered During Session
- (Add items here as they come up)

---

## ⛔ PRE-CLOSE PROTOCOL CHECK (MANDATORY BEFORE notify_user)
> **STOP. Before you call notify_user, you MUST complete this section.**

### Self-Check Questions:
- [ ] Did I fix ANY mistake during this session? (Even my own)
- [ ] If YES → Did I add a rule to `before-starting.md` IN THE SAME RESPONSE?
- [ ] If YES → Is the rule logged in the Protocol Fixes table above?

### Verification:
| Mistake Fixed | Rule Added? | Line # in before-starting.md |
|---------------|-------------|------------------------------|
| (List any) | ✅/❌ | |

> ⛔ **GATE:** If any row shows ❌ in "Rule Added?", you CANNOT call notify_user.
> ⛔ **GATE:** If this section is empty/unchecked, you CANNOT call notify_user.

---

## Session End
- [ ] Update task file with session summary
- [ ] git add -A → git commit → git push
