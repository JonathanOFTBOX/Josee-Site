---
name: Bug Tracking Protocol
description: ALWAYS update LAST_SESSION.md when user reports a bug or issue
---

# Bug Tracking Protocol

**Mandate**: Every time the user reports a bug, issue, or feature request, you MUST add it to `.agent/LAST_SESSION.md` immediately.

## 1. When to Update

Update LAST_SESSION.md whenever the user:
- Reports a bug (something not working)
- Sends a screenshot showing an issue
- Describes unexpected behavior
- Requests a new feature
- Mentions something that "should" work differently

## 2. How to Update

Add to the appropriate section in LAST_SESSION.md:
- `🔶 PENDING VERIFICATION` - For bugs you've fixed but user hasn't confirmed
- `🔴 OPEN BUGS` - For bugs not yet fixed
- `✅ CONFIRMED FIXED` - ONLY when user confirms it works

### Bug Entry Format
```markdown
### Bug #X - [Short Description]
**Problem:** [What the user described]
**Expected:** [What should happen]
**Root Cause:** [If known]
**Fix Applied:** [What you changed]
**Version:** [Deployed version]
**TO TEST:** [Steps for user to verify]
**STATUS:** ⏳ Awaiting user verification
```

## 3. CRITICAL: Verification Rule

**NEVER mark a bug as ✅ DONE until the USER explicitly confirms it works!**

- After applying a fix, mark it as 🔶 PENDING VERIFICATION
- Include clear "TO TEST" steps so user knows how to verify
- Ask user to test if they haven't confirmed
- Only move to ✅ CONFIRMED FIXED when user says it works
- If user reports the bug still exists, keep it in 🔴 OPEN BUGS

## 4. Priority

- Always update EVEN IF you're in the middle of another task
- Add the bug FIRST, then continue working
- Include screenshots if the user provided them

## 5. At Session End

Before ending a session, ensure:
- All reported bugs are documented
- Pending fixes have clear "TO TEST" steps listed
- Only user-confirmed fixes are in ✅ section
- Version number is updated
- Modified files are listed

