# Task: Job Lifecycle Phase 3 - Completed Jobs Section

> **Agent:** @Marcus (Enforcer) | **Started:** 2026-01-05 14:13 | **Status:** 🟡 Ready to Start

---

## Objective
Build the comprehensive "Completed Jobs" section with payment tracking, full job history modal, per-job analytics, and role-based access.

---

## Pre-Work Checklist
- [ ] Read before-starting.md (Marcus section)
- [ ] Read plan file: `job-lifecycle-epic.md` (Phase 3 section)
- [ ] Checked DEBUG_HISTORY for related issues

---

## Requirements (From CEO Testing 2026-01-05)

### Core Features

1. **New Menu Item: "Completed Jobs"**
   - Add to boss sidebar/menu
   - Role restricted (not visible to workers)

2. **Validation Archive Section**
   - On "To Validate" page, add "Already Validated" below pending jobs
   - Searchable/filterable by date, job number, client

3. **Payment Tracking Workflow**
   ```
   Project Manager validates → Date + name recorded
            ↓
   Boss/Director sees validated jobs
            ↓
   Print PDF → Send to client → Wait for payment
            ↓
   Mark as "Paid" when payment received
   ```
   - Status: `validated` → `invoiced` → `paid`
   - Easy visual indicators for pending payments

4. **Full Job History Modal**
   When clicking a completed job, show EVERYTHING:
   - Job title + Job Number (#1042)
   - Client/Address info
   - **ALL photos** (arrival, work, completion)
   - **ALL worker notes**
   - **ALL sessions** (punch in/out with timestamps)
   - Who worked on it
   - Materials/expenses used
   - **Check-ins/alerts:** 50% status, problem flags, phone calls
   - Admin notes
   - Validation record: Who + when
   - Invoice/Payment status

5. **Per-Job Analytics**
   For EACH job show:
   - Amount CHARGED to client
   - Material COST (prix_coutant)
   - Labor COST (worker hours × rate)
   - **Margin** (profit/loss)
   - Visual: green = profit, red = loss

6. **Role-Based Access**
   - Project Manager: Can validate
   - Boss/Director: Can see all, print PDF, mark paid
   - Workers: CANNOT see this section

7. **Print/Export**
   - Generate PDF invoice/summary
   - Include all job details for client

---

## Database Changes Needed

```sql
-- Add payment tracking
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS invoiced_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update lifecycle_status values
-- 'pending', 'in_progress', 'awaiting_validation', 'validated', 'invoiced', 'paid', 'archived'
```

---

## Bug Fixes to Include

While working on this, also fix these related bugs:

1. **Job Creation: Scheduled Date Required**
   - Date field must be mandatory
   - Block form submission without date

2. **Job Number Visible on Creation**
   - Show job number immediately when job is created

3. **Validation Modal: Check-In/Alert Data**
   - Show 50% completion status
   - Show problem flags
   - Show phone call alerts

4. **Validation Modal: Edit Notes/Materials**
   - Allow editing notes before final validation
   - Allow adding/editing materials

---

## Files to Review First

- `client/src/pages/boss/admin/index.tsx` — Current admin tabs
- `client/src/components/modals/JobValidationModal.tsx` — Current validation modal
- `client/src/api/SupabaseDataProvider.ts` — Job data methods
- `supabase/migrations/` — Existing job schema

---

## Work Log
> Update this every 3-4 tool calls

### [18:00] Initial Implementation
- [x] Schema and Types updated (`invoicedAt`, `paidAt`, `paymentNotes`)
- [x] Migrations created (`20260105_job_payments.sql`)
- [x] `JobValidationModal` enhanced (check-ins, materials, alerts) (Fixes #3, #4)
- [x] `JobHistoryModal` created (full details, payment state) (Requirement #4, #5)
- [x] `CompletedJobs.tsx` created (list, filter, payment workflow) (Requirement #1, #2, #3, #6)
- [x] `JobFormModal` updated (Scheduled Date mandatory) (Fix #1)
- [x] Payment Workflow Implemented (`validated` -> `invoiced` -> `paid`)
- [x] Fix Type Mismatches in `SessionProvider`, `MockJobProvider`, `storage.ts`

### [20:00] Session 2 - Payment Terms & Invoices (2026-01-05)
- [x] Added `paymentTerms` and `paymentDueDate` fields to schema
- [x] Created migration `20260105_payment_terms.sql`
- [x] Added Payment Terms dropdown to `JobHistoryModal` (Net 7/15/30/60/90)
- [x] Added overdue warning badge (red "OVERDUE by X days!")
- [x] Fixed Save button in Admin & Payment tab
- [x] **PDF Invoice Generation** - Created `invoice-pdf.ts` with jsPDF + html2canvas
- [x] Professional invoice layout with company branding, line items, due dates
- [x] **Company Settings Page** - New owner-only Settings tab
- [x] Company profile form: name, address, phone, email
- [x] **Logo Upload** - File upload to Supabase Storage instead of URL input
- [x] Created storage migration `20260105_company_logo_storage.sql`
- [x] Added company fields migration `20260105_company_invoice.sql`
- [x] Fixed `updateJob` missing `payment_terms` and `payment_due_date` mappings

---

## Problems Found
> Log issues here for Victor to review. Use `### ⚠️ VICTOR ACTION:` header.

### ⚠️ VICTOR ACTION: Storage Policies
- Storage bucket `company-logos` needs proper RLS policies. Migration provided but user should verify bucket is created and policies are applied in Supabase Dashboard → Storage.

### ⚠️ VICTOR ACTION: Material CRUD
- Material "Editing" in `JobValidationModal` is currently implemented as "Add Only". Full "Update/Delete" requires backend API enhancements (missing `updateJobMaterial`, `deleteJobMaterial` in `IStorage`/Provider interface).

### ⚠️ VICTOR ACTION: Invoice Branding
- Invoice PDF uses company name from user profile. For full company branding (logo, address, phone), boss must go to Settings tab and fill in company profile. Logo upload requires storage bucket to be created.

---

## Verification
- [x] `npm run build` passed
- [x] `npx tsc --noEmit` passed
- [x] User confirmed: Migrations ran successfully ✅
- [x] git push completed

---

## Session End Summary (2026-01-05 20:09)
**What I accomplished:**
- Payment Terms system (Net 7/15/30/60/90) with auto due date calculation
- Overdue payment warnings in Admin tab
- Professional PDF invoice generation with company branding
- Company Settings page for boss to customize invoice header
- Logo file upload (Supabase Storage based)
- Fixed all save errors for payment data

**What's left (if any):**
- Verify logo upload works after user creates storage bucket
- Print Invoice with company logo (needs storage bucket working)
- i18n translations for new Payment Terms labels

**Next Steps for Phase 4:**
1. Add overdue payments dashboard/alert for boss
2. Email invoice directly to client
3. Payment reminders system (approaching due date notifications)

**Confidence Score:** 9/10

