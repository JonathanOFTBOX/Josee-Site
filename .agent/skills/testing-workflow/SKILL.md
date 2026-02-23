---
name: Testing Workflow
description: How testing works - user does all testing, never use browser tool
---

# Testing Workflow

## ⚠️ CRITICAL RULES

1. **Never use `browser_subagent` tool** - The user does ALL testing
2. **Always run `/deploy-verify` workflow** before asking user to test

## Workflow

1. Complete changes
2. Follow `/deploy-verify` workflow (build → versions → commit → push)
3. Update `task.md` with "## Needs Testing" section
4. Wait for user feedback
5. Only remove test items when user confirms "passed" or "✓"

## Test Item Format in task.md

```markdown
## Needs Testing
- [ ] Test X on mobile (375px)
- [ ] Test Y behavior
```

**Never erase test items until user confirms they passed.**
