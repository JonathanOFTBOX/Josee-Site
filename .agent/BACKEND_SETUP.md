# Backend Setup & Runbook

## 1. Supabase Setup (Milestone 1)

**Source:** `docs/SUPABASE_SETUP.md`

### Prerequisites
- Supabase project (Canada Central).
- OAuth (Google/Microsoft) configured.

### Environment Variables
```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key>
VITE_SUPABASE_STORAGE_BUCKET=job-photos
```

### SQL Execution Order
1. `supabase/sql_scripts/multi_tenant_foundation.sql` (Core tables & RLS)
2. `supabase/sql_scripts/profiles_table.sql` (If starting fresh)
3. `supabase/sql_scripts/seed_demo_company.sql` (Optional)

### Storage Setup
- Bucket: `job-photos` (Private)
- Policy: `bucket_id = 'job-photos' and split_part(name, '/', 1) = public.current_company_id()::text`

---

## 2. Operational Runbook

**Source:** `docs/RUNBOOK_BACKEND.md`

### Secrets Policy
- **NEVER** commit secrets. Use `.env`.
- Frontend uses **ANON KEY** only.

### Cloudflare Pages Setup
1. Set Environment Variables (Prod & Preview).
2. Build Command: `npm run build`.
3. Output Dir: `dist`.
4. Add Cloudflare domain to Supabase Auth Redirect URLs.

### Feature Implementation Requirements
- All Auth/Data via Supabase.
- RLS must be enabled on all tables.
- Storage paths: `company_id/job_id/filename`.
- No client-side company spoofing (trust `profiles.company_id`).
