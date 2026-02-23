# Supabase Database Schema (Live)

*Generated from production Supabase - 2024-12-29*

## Tables Overview

| Table | Rows | Purpose |
|-------|------|---------|
| `sessions` | 17 | Work sessions (punch in/out) |
| `photos` | 15 | Session photos |
| `checkins` | 8 | Worker 50% check-ins |
| `jobs` | 5 | Job definitions |
| `profiles` | 4 | User accounts |
| `companies` | 3 | Company accounts |
| `company_invites` | 0 | Employee invitations |

### Views
- `jobs_with_workers` - Jobs joined with assigned worker details
- `sessions_with_details` - Sessions joined with job and user info

---

## Table: `checkins` ⚠️

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | UUID | NO | gen_random_uuid() |
| `session_id` | UUID | NO | - |
| `job_id` | UUID | NO | - |
| `user_id` | UUID | NO | - |
| `company_id` | UUID | NO | - |
| `on_track` | BOOLEAN | NO | - |
| `comment` | TEXT | YES | - |
| `needs_call` | BOOLEAN | YES | false |
| `admin_acknowledged` | BOOLEAN | YES | false |
| `created_at` | TIMESTAMPTZ | YES | now() |

**FK Relations:** session_id → sessions, job_id → jobs, user_id → profiles, company_id → companies

---

## Table: `companies`

| Column | Type | Default |
|--------|------|---------|
| `id` | UUID | gen_random_uuid() |
| `name` | TEXT | - |
| `created_at` | TIMESTAMPTZ | now() |
| `trial_started_at` | TIMESTAMPTZ | - |
| `trial_ends_at` | TIMESTAMPTZ | - |
| `plan_status` | TEXT | 'trial' |

---

## Table: `company_invites`

| Column | Type | Default |
|--------|------|---------|
| `id` | UUID | gen_random_uuid() |
| `email` | TEXT | - |
| `company_id` | UUID | - |
| `role` | TEXT | - |
| `full_name` | TEXT | - |
| `invited_by` | UUID | - |
| `status` | TEXT | 'pending' |
| `created_at` | TIMESTAMPTZ | now() |

---

## Table: `jobs`

| Column | Type | Default |
|--------|------|---------|
| `id` | UUID | gen_random_uuid() |
| `company_id` | UUID | - |
| `title` | TEXT | - |
| `description` | TEXT | - |
| `address` | TEXT | - |
| `latitude` | REAL | - |
| `longitude` | REAL | - |
| `status` | TEXT | 'assigned' |
| `assigned_to` | UUID | - |
| `assigned_workers` | UUID[] | '{}' |
| `required_workers` | INTEGER | 1 |
| `client_name` | TEXT | - |
| `scheduled_date` | TEXT | - |
| `estimated_hours` | REAL | - |
| `is_urgent` | BOOLEAN | false |
| `created_at` | TIMESTAMPTZ | now() |
| `job_number` | SERIAL | auto-increment |
| `lifecycle_status` | TEXT | 'pending' |
| `admin_notes` | TEXT | - |
| `validated_at` | TIMESTAMPTZ | - |
| `validated_by` | UUID | FK → profiles |

**Lifecycle Status Values:** `pending`, `in_progress`, `awaiting_validation`, `needs_return`, `completed`, `archived`

---

## Table: `profiles`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | - | Links to auth.users.id |
| `email` | TEXT | - | User email |
| `role` | TEXT | 'worker' | 'boss' or 'worker' |
| `full_name` | TEXT | - | User's display name |
| `username` | TEXT | - | Username (default: email prefix) |
| `avatar` | TEXT | - | Avatar URL |
| `company_id` | UUID | - | FK → companies.id |
| `hourly_rate` | NUMERIC | 0 | Worker hourly rate |
| `is_owner` | BOOLEAN | false | True if user is company creator (Super Admin) |
| `permissions` | TEXT | '{}' | JSON string of granular permissions |
| `created_at` | TIMESTAMPTZ | now() | - |

**Trigger:** `handle_new_user()` runs on `auth.users` INSERT:
- Extracts `full_name`, `company_name`, `role` from `raw_user_meta_data`
- If `company_name` provided: Creates company + boss profile with `is_owner=true`
- Otherwise: Creates worker profile

---

## Table: `sessions`

| Column | Type |
|--------|------|
| `id` | UUID |
| `company_id` | UUID |
| `job_id` | UUID |
| `user_id` | UUID |
| `start_time` | TIMESTAMPTZ |
| `end_time` | TIMESTAMPTZ |
| `start_latitude` | REAL |
| `start_longitude` | REAL |
| `end_latitude` | REAL |
| `end_longitude` | REAL |
| `start_photo_url` | TEXT |
| `end_photo_url` | TEXT |
| `duration` | REAL |
| `notes` | TEXT |
| `created_at` | TIMESTAMPTZ |

---

| `geocoding_logs` | 0 | Logs of address validation attempts |
| `inventory_items` | 0 | Tracking stock levels and costs |
| `job_materials` | 0 | Links inventory items to specific jobs |

---

## Table: `geocoding_logs`
- `id` (UUID, PK)
- `company_id` (UUID, FK -> companies)
- `address` (TEXT)
- `confidence` (REAL)
- `latitude` (REAL)
- `longitude` (REAL)
- `provider_response` (TEXT)
- `created_at` (TIMESTAMPTZ)

---

## Table: `inventory_items`
- `id` (UUID, PK)
- `company_id` (UUID, FK -> companies)
- `name` (TEXT)
- `sku` (TEXT)
- `description` (TEXT)
- `quantity` (REAL)
- `unit` (TEXT)
- `unit_cost` (REAL)
- `created_at` (TIMESTAMPTZ)

---

## Table: `job_materials`
- `id` (UUID, PK)
- `job_id` (VARCHAR, FK -> jobs)
- `item_id` (UUID, FK -> inventory_items)
- `quantity_used` (REAL)
- `cost_at_time` (REAL)
- `created_at` (TIMESTAMPTZ)

---

## Table: `photos`

| Column | Type |
|--------|------|
| `id` | UUID |
| `company_id` | UUID |
| `session_id` | UUID |
| `url` | TEXT |
| `type` | TEXT |
| `captured_at` | TIMESTAMPTZ |
| `latitude` | REAL |
| `longitude` | REAL |
| `notes` | TEXT |
| `created_at` | TIMESTAMPTZ |

---

## Realtime Configuration

✅ **Realtime enabled for all core events**

Currently enabled:
- ✅ `sessions`
- ✅ `checkins`
- ✅ `inventory_items`
- ✅ `job_materials`
- ✅ `geocoding_logs`

Pending migration (Phase 1 complete, run SQL):
- ✅ `jobs` — Enabled 2026-01-03

**To enable jobs realtime:** Run migration SQL in Supabase Dashboard.

---

## RLS Policies

### checkins
- `Users can view company checkins` (SELECT)
- `Workers can create checkins` (INSERT)
- `Bosses can update checkins` (UPDATE)

### companies
- `Users can view their own company` (SELECT)

### company_invites
- `company_invites_admin_manage` (ALL - bosses)
- `company_invites_self_lookup` (SELECT - by email)

### jobs
- `Users can view company jobs` (SELECT)
- `Bosses can create jobs` (INSERT)
- `Bosses can update jobs` (UPDATE)
- `Workers can update assigned jobs` (UPDATE) - *Added 2024-12-29*
- `Bosses can delete jobs` (DELETE)

**Status values:** `assigned`, `active`, `completed`, `paused`

### photos
- `Users can view company photos` (SELECT)
- `Users can upload photos` (INSERT)

### profiles
- `profiles_select_self` (SELECT own)
- `profiles_company_select_boss` (SELECT - bosses can view all company profiles)
- `profiles_admin_manage` (ALL - bosses)

### sessions
- `Users can view company sessions` (SELECT)
- `Workers can start sessions` (INSERT)
- `Workers can end their sessions` (UPDATE)
- `Bosses can manage sessions` (ALL)
