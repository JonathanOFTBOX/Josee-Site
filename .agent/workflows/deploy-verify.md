---
description: Standardized release & verification steps for deploying to production
---

# Deploy & Verify Workflow

## Before completing ANY task:

### 1. Build Verification
```bash
npm run build
```
Must pass with exit code 0.

### 2. Version Update (BOTH files)
Update BOTH files with matching version:

**File 1:** `client/src/lib/version-check.ts`
```typescript
export const APP_VERSION = "1.0.10.XX";
```

**File 2:** `client/public/sw.js`
```javascript
const SW_VERSION = '1.0.10.XX';
```

### 3. Commit & Push
```bash
git add .
git commit -m "feat/fix: Description [vX.X.X.XX]"
git push
```

### 4. User Tests in Browser
**The user is the only one who tests in browser.** 

Do NOT use browser testing tools to verify UI changes. Instead:
- Document what was changed
- Note any areas that should be tested
- Let the user verify in their browser

### 5. Before Closing Task
Create a walkthrough artifact documenting:
- What was changed
- What should be tested
- Any known issues

## Version Increment Rules
- Increment the LAST digit for each deploy
- Example: `1.0.10.66` → `1.0.10.67` → `1.0.10.68`
- Both APP_VERSION and SW_VERSION must match exactly
