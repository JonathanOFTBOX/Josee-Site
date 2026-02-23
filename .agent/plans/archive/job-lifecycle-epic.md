# EPIC: Job Lifecycle Management (E4)

> **Goal:** Complete job validation workflow with status stages, admin approval, and unique job numbers.
> **Status:** 🔴 Ready for Development
> **Priority:** 🔵 HIGH (Business Critical)
> **Plan Updated:** 2026-01-07 by Maya (from Marcus Discovery)

---

## User Requirements (Confirmed 2026-01-03)

### 1. New Admin Section: "Jobs to Validate"
Jobs completed by workers waiting for boss approval.

### 2. Validation Modal (Full Job Details)
When admin clicks a job, show:
- Job title, client, address
- All photos taken by worker
- Worker notes
- Time tracking (estimated vs actual)
- Materials/expenses used
- Assigned workers

### 3. Admin Actions in Modal
- **Add Notes** — Admin can add comments
- **Add Materials** — Add parts/expenses after the fact
- **Modify Anything** — Full edit access
- **Validate Options:**
  - ✅ **"Completed"** → Job moves to Completed section
  - 🔄 **"Needs Return Visit"** → Job goes back to Unassigned with new date, keeps all history

### 4. Worker Visibility
Workers can see:
- Previous work history on the job
- Admin notes
- What was validated/changed

### 5. Unique Job Number
- Auto-generated ID (e.g., `JOB-2026-0001` or `#1042`)
- Searchable by admin
- For customer traceability ("Client calls 3 months later about that job")

---

## Reference Screenshot

![Validation Modal Reference](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/.agent/proof/job_validation_modal_reference.png)

---

## Proposed Changes

### Phase 1: Database Schema (Marcus)

#### [NEW] Migration: Job Lifecycle Fields

```sql
-- Add job_number auto-increment
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_number SERIAL;

-- Add lifecycle status
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS lifecycle_status TEXT DEFAULT 'pending'
  CHECK (lifecycle_status IN ('pending', 'in_progress', 'awaiting_validation', 'needs_return', 'completed', 'archived'));

-- Add admin notes
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add validation timestamp
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES profiles(id);
```

---

### Phase 2: Admin UI - Jobs to Validate Tab (Derek) (✅ Completed)

#### [MODIFY] [admin/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/index.tsx)

Add new tab: "To Validate" showing jobs with `lifecycle_status = 'awaiting_validation'`

#### [NEW] JobValidationModal Component

Full-screen modal with:
```tsx
- Header: Job title + Job Number (#1042)
- Client/Address info
- Photo gallery (all session photos)
- Time tracking card (estimated vs actual)
- Materials/Expenses list with "Add" button
- Worker notes (read-only)
- Admin notes (editable textarea)
- Action buttons:
  - "Needs Return Visit" → Opens date picker, sets status
  - "Mark Completed" → Confirms, moves to completed
```

---

### Phase 3: Admin UI - Completed Jobs Section (Derek) ⚠️ ENHANCED 2026-01-05

> **CEO Requirements:** This section is CRITICAL for business operations.

#### [NEW] New Menu Item: "Completed Jobs"
Add to boss sidebar/menu — NOT visible to all roles (role restricted).

#### [MODIFY] [admin/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/index.tsx)

**Features Required:**

##### 1. Archive View with Filters
- Premium, clean layout (easy to scan)
- Filter by: Job Number, Client Name, Employee, Company, Date Range
- Search by unique job number
- Sort by date, client, employee

##### 2. Validation Workflow (2-Tier)
```
Project Manager validates → Date + Manager name recorded
         ↓
Boss/Director sees validated jobs → Final review
         ↓
Print PDF → Send to client → Wait for payment
         ↓
Mark as "Paid" when payment received
```

##### 3. Payment Tracking Status
- `awaiting_invoice` → Needs PDF sent
- `invoice_sent` → Waiting for payment
- `paid` → Payment received (show date)
- Easy visual indicators for pending payments

##### 4. Role-Based Access
- **Project Manager:** Can validate jobs
- **Boss/Director:** Can see all, print PDF, mark paid
- **Workers:** CANNOT see this section
- Schema: Add `lifecycle_status` values: `validated`, `invoiced`, `paid`

##### 5. Full Job History Modal
When clicking a completed job, show EVERYTHING:
- Job title + Job Number (#1042)
- Client/Address info
- **ALL photos** taken by worker (arrival, work, completion)
- **ALL worker notes**
- **ALL sessions** (every punch in/out with timestamps)
- Who worked on it (all employees)
- Materials/expenses used
- **ALL check-ins/alerts:**
  - 50% completion check-in response
  - Problem flags (Yes/No)
  - Phone call alerts
- Admin notes
- Validation record: Who validated + when
- Invoice status
- Payment status
- **💰 Profitability Summary:**
  - Amount CHARGED to client
  - Material COST (prix_coutant from inventory)
  - Labor COST (worker hours × hourly rate)
  - MARGIN (profit/loss on job)

##### 6. Print/Export
- Generate PDF invoice/summary
- Include all job details for client

##### 7. Per-Job Analytics (NOT Summary)
> ⚠️ **Note:** Summary dashboard already exists (Revenue, Profit, Rentability, Efficiency).
> This is for **PER-JOB** breakdown in the Completed Jobs list:

For EACH job in the list, show:
- Amount CHARGED to client
- Material COST
- Labor COST  
- **Margin** (profit/loss for this specific job)
- Visual indicator (green = profit, red = loss)

Existing Dashboard Reference: [Summary Dashboard](file:///C:/Users/jogor/.gemini/antigravity/brain/d70e4b20-e214-468f-bab8-88a19f68d25e/uploaded_image_1767640259463.png)

##### 8. Validation Archive Section
On the "To Validate" page, add a section BELOW the pending jobs:
- **"Already Validated"** — Jobs manager has validated (searchable/filterable)
- Filters: By date, by job number, by client
- Click to view full job details
- Evidence: [Current UI](file:///C:/Users/jogor/.gemini/antigravity/brain/d70e4b20-e214-468f-bab8-88a19f68d25e/uploaded_image_1767640181845.png)

#### [NEW] Database Changes for Phase 3

```sql
-- Add payment tracking
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS invoiced_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update lifecycle_status enum
-- VALUES: 'pending', 'in_progress', 'awaiting_validation', 'validated', 'invoiced', 'paid', 'archived'
```

---

### Phase 4: Worker Side Updates (Maya/Derek)

#### [MODIFY] [job-detail.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/worker/job-detail.tsx)

Show:
- Job number badge
- Previous visit history (if return visit)
- Admin notes (read-only)
- What was validated

---

### Phase 5: Worker Timesheet - Clickable Completed Jobs (Maya/Derek)

> **Reference Screenshot:** [Worker Timesheet](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/.agent/proof/worker_timesheet_reference.png)

#### [MODIFY] [timesheet.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/worker/timesheet.tsx)

Make completed jobs clickable in Timesheet:
```tsx
// Each completed session card is clickable
<SessionCard onClick={() => openJobDetail(session.jobId)}>
  {/* Session info */}
</SessionCard>
```

#### [NEW] WorkerJobDetailModal Component

When worker clicks a completed job, show:
- Job title + Job Number (#1042)
- Client/Address info
- **All photos they took**
- **Their notes**
- **Time tracked** (punch in/out timestamps)
- Materials they used
- Admin notes (if validated and admin added notes)
- Validation status badge (Completed ✅ / Awaiting Validation 🕐)

---

## ⚠️ Known Issues / Technical Debt (VICTOR ACTION)

### 1. Storage Policies for `company-logos`
- Storage bucket `company-logos` needs proper RLS policies. Migration provided but needs verification in Supabase Dashboard.

### 2. Material CRUD Limitations
- Material "Editing" in `JobValidationModal` is currently implemented as "Add Only".
- Full "Update/Delete" requires backend API enhancements (`updateJobMaterial`, `deleteJobMaterial` in `IStorage`).

### 3. Invoice Branding Gaps
- Invoice PDF uses company name from user profile.
- For full company branding (logo, address, phone), boss must go to Settings tab and fill in company profile.
- Logo upload requires storage bucket to be created.

---

## Verification Plan

### Automated
```bash
npm run build
npx tsc --noEmit
```

### Manual Verification (User Required)
1. Worker completes a job → Status becomes `awaiting_validation`
2. Admin sees job in "To Validate" tab
3. Admin opens validation modal → Sees all details
4. Admin adds notes, adds material if needed
5. **Test "Completed":** Click "Mark Completed" → Job appears in Completed section
6. **Test "Return Visit":** Click "Needs Return" → Job goes to Unassigned with new date
7. Verify job number is searchable
8. Verify worker can see history on return job
9. **Worker Timesheet:** Worker goes to Timesheet → Clicks completed job → Sees all their work details

---

## Agent Assignment

| Phase | Agent | Model | Sessions |
|-------|-------|-------|----------|
| 1 | Marcus | Claude Opus 4.5 | 1 |
| 2 | Derek | Gemini 3 Pro High | 2 |
| 3 | Derek | Gemini 3 Pro High | 1 |
| 4 | Derek/Maya | Gemini 3 Pro High | 1 |
| 5 | Maya | Gemini 3 Pro High | 1 |

**Total: 6 sessions**
