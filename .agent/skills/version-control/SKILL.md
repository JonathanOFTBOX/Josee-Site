---
name: Version Control Protocol
description: Enforces version bumping (package.json + version-check.ts + sw.js) on EVERY code change/push
---

# Version Control Protocol

**Mandate**: EVERY time you push code (`git push`) or deploy, you MUST bump the application version to ensure clients receive the update.

## 1. Files to Update
You must update ALL 3 of these files:
1.  `package.json` -> `version`
2.  `client/src/lib/version-check.ts` -> `APP_VERSION`
3.  `client/public/sw.js` -> `SW_VERSION` (Critical for PWA/Toast updates)

## 2. Versioning Strategy
- Increment the **last digit** by 1.
- Example: `1.0.10.199` -> `1.0.10.200`
- DO NOT reset the last digit unless explicitly instructed (e.g., major release).
- Ensure ALL 3 files have the **EXACT SAME** version string.

## 3. Workflow
1.  Make your code changes.
2.  **BEFORE** running `npm run build` or `git commit`:
    *   Read `client/src/lib/version-check.ts` to get current version.
    *   Increment version.
    *   Update `package.json`.
    *   Update `client/src/lib/version-check.ts`.
    *   Update `client/public/sw.js` (Update `SW_VERSION` and `CACHE_NAME`).
3.  **COMMIT & PUSH**:
    *   Stage all files: `git add .`
    *   Commit with a descriptive message including the version: `git commit -m "feat: <description> (v1.0.10.XXX)"`
    *   Push to origin: `git push`

## 4. Verification Check-List (MANDATORY)
Before pushing, you MUST verify these 3 files match exactly:
- [ ] `package.json` ("version")
- [ ] `client/public/sw.js` ("SW_VERSION")
- [ ] `client/src/lib/version-check.ts` ("APP_VERSION")

**Rule**: Use `grep` or `find` to verify if you are unsure.
**Command**: `npx tsx scripts/version-check.ts` (Ensure this passes!)

## 5. Troubleshooting
- If `version-check.ts` fails, DO NOT IGNORE IT. Fix the mismatch.
- If you change code, you BUMP version. No exceptions.
