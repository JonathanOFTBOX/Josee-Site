# Development Commands

## Quick Start

```powershell
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev
```

App runs at: `http://localhost:5000`

---

## All Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript check (`tsc`) |
| `npm run db:push` | Push DB schema changes |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:ui` | Playwright tests with UI |
| `npm run verify-docs` | Check doc consistency |
| `npm run deploy` | Deploy to production |

---

## TypeScript Check

```powershell
# Check all files
npx tsc --noEmit

# Check specific pattern
npx tsc --noEmit 2>&1 | Select-String -Pattern "filename"
```

---

## Supabase

```powershell
# Push schema changes to database
npm run db:push

# View database in browser
# Go to: https://supabase.com/dashboard
```

---

## Deploy

## Deploy
> **⚠️ CRITICAL:** DO NOT just push to main.
> Follow the **[Deployment Workflow](workflows/deploy-verify.md)** strictly.

1.  Run `npm run build` locally.
2.  Follow steps in `.agent/workflows/deploy-verify.md`.

---

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
DATABASE_URL=postgresql://...
```

---

## Verification & QA

> **🚨 AGENT PROTOCOL:**
> You are **STRICTLY PROHIBITED** from using BROWSER TOOLS.
> You may ONLY verify via `npm run build` and `npx tsc`.
> For UI verification, you MUST ask the User for a Screenshot.

### 1. Build Verification
```bash
# Check TypeScript types
npx tsc --noEmit --skipLibCheck

# Full Production Build
npm run build
```

### 2. Mobile Layout Verification (USER ONLY)
**Manual Checklist (For Humans Only):**
- [ ] **Mobile (375x812)**: Login, Jobs List, Job Detail (dirty hands UI), Navigation.
- [ ] **Tablet (768x1024)**: Dashboard grids, Job Management forms.
- [ ] **Credentials**: Worker (`cfisynergie@gmail.com`), Admin (`jonathan@oftbox.com`).

### 3. Automated QA Flags (For User Testing)
Run in Console to bypass hardware checks:
```javascript
localStorage.setItem('QA_MOCK_CAMERA', 'true');
localStorage.setItem('DEV_MODE_MOCK_GPS', 'true');
```

---

## Edge Functions

### Deploy specific function
```bash
npx supabase functions deploy process-mecano
# Note: Use --no-verify-jwt only if public/auth-handled internally
```

### Set Secrets
```bash
npx supabase secrets set GEMINI_API_KEY=your_key_here
```

