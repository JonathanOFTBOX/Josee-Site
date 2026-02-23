# Derek (Desktop-Dev) - Session Task

> **Current Session:** [DATE TIME]
> **Assigned Task:** [COPY FROM DEBUG_HISTORY OR ROADMAP]

---

## Step 0: Initialization
- [ ] Create task.md (this file)
- [ ] Read before-starting.md (Derek section: lines 893-990)
- [ ] Read PROJECT_CONTEXT.md
- [ ] Read DEBUG_HISTORY.md (find my assigned task)
- [ ] Read CODE_PATTERNS.md
- [ ] Read CRITICAL_FILES.md
- [ ] Check for existing plan in `.agent/plans/`

---

## Step -1: Planning (BEFORE ANY CODE)
- [ ] Understand component hierarchy (parent → child data flow)
- [ ] Plan data flow (props vs state vs context)
- [ ] Consider edge cases (empty, loading, error states)
- [ ] Check if shadcn/ui component exists
- [ ] Verify database schema supports this feature

---

## Quality Checks (⛔ MUST COMPLETE BEFORE CODING)
- [ ] Did I grep for existing components that solve this?
- [ ] Did I check the database schema supports this feature?
- [ ] Did I verify both mobile AND desktop views?
- [ ] Is the file I'm modifying under 500 lines?

---

## Implementation
- [ ] Task 1: [Description]
- [ ] Task 2: [Description]
- [ ] Task 3: [Description]

---

## Verification
- [ ] `npx tsc --noEmit` — No type errors
- [ ] `npm run build` — Build passes
- [ ] Created walkthrough artifact with proof

---

## Integration Checklist
- [ ] Cross-module sync works (data appears where expected)
- [ ] Dropdowns refresh with new data
- [ ] Mobile view (375px) works
- [ ] Desktop view (1024px+) works
- [ ] Keyboard navigation works

---

## Session End
- [ ] Update DEBUG_HISTORY.md status → 🔵 Ready for @Enforcer
- [ ] Log to DEREK_LOG.md
- [ ] Log to AGENT_LOGS.md
- [ ] git add -A → git commit → git push
