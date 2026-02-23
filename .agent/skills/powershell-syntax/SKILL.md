---
description: PowerShell command syntax - use semicolons not &&
---

# PowerShell Command Chaining

## CRITICAL RULE
**PowerShell does NOT support `&&` for command chaining!**

### ❌ WRONG (Bash/Linux syntax)
```powershell
git add -A && git commit -m "message" && git push
```

### ✅ CORRECT (PowerShell syntax)
```powershell
git add -A; git commit -m "message"; git push
```

## Quick Reference
| Action | PowerShell Syntax |
|--------|-------------------|
| Chain commands | `cmd1; cmd2; cmd3` |
| Continue only if success | `if ($?) { cmd2 }` |
| Run in background | `Start-Process cmd` |
