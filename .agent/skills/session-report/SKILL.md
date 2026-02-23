---
name: End-of-Session Report
description: ALWAYS generate a detailed summary report when finishing a coding session
---

# End-of-Session Report Skill

## When to Use
At the END of every coding session (before the final message to the user), generate a comprehensive report summarizing all work done.

## Report Format

Always include the following sections in markdown format:

### 📋 Session Summary
- Brief 1-2 sentence overview of what was accomplished

### 🔧 Changes Made
For each change, include:
- **File**: Full path to the modified file
- **What Changed**: Brief description of the modification
- **Why**: Rationale for the change

### 📁 Files Touched
List ALL files that were created, modified, or deleted:
- `[MODIFIED]` path/to/file.tsx
- `[NEW]` path/to/new-file.ts
- `[DELETED]` path/to/removed-file.ts

### 🏷️ Version
- Previous version → New version (e.g., `1.0.10.583 → 1.0.10.586`)

### ⚠️ Known Issues / Next Steps
- Any remaining bugs or things to verify
- Suggested next tasks

### 🧪 Testing Notes
- What the user should test to verify the changes work correctly

## Rules
1. NEVER skip the report - it's mandatory at the end of every session
2. Keep it concise but complete
3. Use French or English based on the user's language preference
4. Include version numbers for every deployment
5. Mention any data-level issues found (e.g., missing DB values)
