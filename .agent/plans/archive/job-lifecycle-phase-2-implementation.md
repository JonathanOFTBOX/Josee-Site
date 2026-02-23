# Implementation Plan - Job Lifecycle Phase 2: Admin Validation

> **Goal**: Enable admins to review, edit, and validate completed jobs before they are archived or finalized.

## User Review Required
> [!IMPORTANT]
> **New Permissions**: This feature assumes 'canManageSchedule' or 'isOwner' for validation rights. Confirm if a new 'canValidateJobs' permission is needed. Proceeding with existing permissions for now.

## Proposed Changes

### Admin Dashboard Logic
#### [MODIFY] [useAdminJobs.ts](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/hooks/useAdminJobs.ts)
- Add filtering for `lifecycle_status = 'awaiting_validation'` to get `validationJobs`.
- Expose `validationJobs` and `validateJob` function (which updates status/notes).

#### [MODIFY] [admin/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/index.tsx)
- Add "To Validate" tab (conditionally rendered for admins).
- Add new `AdminValidationSection` component to the tab content.
- Integrate `JobValidationModal`.

### New Components

#### [NEW] [AdminValidationSection.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/admin/components/AdminValidationSection.tsx)
- Displays a list/grid of jobs waiting for validation.
- Reuses `JobCard` or creates a simplified list item with "Review" button.

#### [NEW] [JobValidationModal.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/components/modals/job-validation/JobValidationModal.tsx)
- **Header**: Job Title, Client, Job Number.
- **Content**:
    - **Photos**: Grid of session photos (start/end/work).
    - **Time**: Estimated vs Actual duration.
    - **Notes**: Worker notes (read-only).
    - **Admin**: Editable "Admin Notes" textarea.
    - **Materials**: List of used materials (editable/addable).
- **Footer Actions**:
    - "Needs Return Visit": Opens return date picker -> sets status to `needs_return`.
    - "Validate & Complete": Sets status to `completed`.

## Verification Plan

### Automated Tests
- `npm run build`: Ensure no type errors with new components/hooks.
- `npx tsc --noEmit`: Verify strict type compliance.

### Manual Verification
1. **Setup**:
    - Log in as Boss.
    - (Prerequisite) Have a job in `awaiting_validation` status (might need to manually update DB or simulate worker flow if Phase 1 didn't leave one).
2. **Dashboard**:
    - Verify "To Validate" tab appears.
    - Verify counter badge (if added) or list count.
3. **Modal Interaction**:
    - Click a job -> Modal opens.
    - Verify all Photos load.
    - Verify Worker Notes are visible.
    - Test "Admin Notes" editing.
4. **Validation Actions**:
    - **Action A**: Click "Validate & Complete". Verify job moves to "Completed" (or disappears from list if Completed tab not built yet). Verify DB `lifecycle_status` is `completed` and `validated_at` is set.
    - **Action B**: Click "Needs Return". Verify date picker appears. Select date. Verify job moves to `assigned` (or `needs_return` intermediate) and is no longer in "To Validate".
