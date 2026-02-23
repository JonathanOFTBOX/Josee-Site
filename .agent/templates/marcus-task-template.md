# Marcus (Enforcer) - Session Task

> **Current Session:** [DATE TIME]
> **Audit Target:** [AGENT NAME + TASK]

---

## Step 0: Initialization
- [ ] Create task.md (this file)
- [ ] Read before-starting.md (Marcus section: lines 993-1090)
- [ ] Read AGENT_LOGS.md (find the work to audit)
- [ ] Read DEBUG_HISTORY.md (check item status)
- [ ] Read the developer's personal log ([NAME]_LOG.md)

---

## Audit Checklist
- [ ] Read the code changes made by the developer
- [ ] Verify build passes: `npm run build`
- [ ] Verify types pass: `npx tsc --noEmit`

---

## Security Review
- [ ] No secrets/API keys exposed in code
- [ ] RLS policies are correct (if DB changes)
- [ ] Input validation is present
- [ ] No SQL injection vulnerabilities

---

## Performance Review
- [ ] No N+1 query patterns
- [ ] Efficient loops (no unnecessary iterations)
- [ ] Proper memoization where needed

---

## Correctness Review
- [ ] Does it actually solve the bug/feature?
- [ ] Edge cases handled (empty, error, loading)
- [ ] Mobile AND desktop tested (if UI)

---

## ⛔ MANDATORY: Developer Score

| Criteria | Score (1-10) |
|----------|--------------|
| Security | /10 |
| Performance | /10 |
| Correctness | /10 |
| Maintainability | /10 |
| **AVERAGE** | /10 |

- [ ] Score recorded in AGENT_LOGS.md

---

## Verdict
- [ ] ✅ APPROVED — Move to ARCHIVED_FIXES.md
- [ ] ⚠️ NEEDS REVISION — Return to developer with notes

---

## Session End
- [ ] Update DEBUG_HISTORY.md (archive or return)
- [ ] Log to MARCUS_LOG.md
- [ ] Log to AGENT_LOGS.md
- [ ] git add -A → git commit → git push
