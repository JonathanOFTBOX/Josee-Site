# User Permissions System (Worker/Admin)

> Granular permissions for workers AND admins with approval flows.

## Current Implementation (v1)

### Admin-Only Closed Order Deletions
- **Location:** `client/src/pages/boss/components/QRCodeList.tsx`
- **Check:** `dataProvider.checkUnitOrderStatus(unitId)` 
- **Modal:** `client/src/components/modals/AdminPasswordModal.tsx`
- **Logging:** Enhanced audit in `inventory_history` table

## Future Permissions to Add

| Permission | Description | Where to Check |
|------------|-------------|----------------|
| `delete_closed_order_units` | Delete units from closed orders | `QRCodeList.tsx` |
| `approve_expenses` | Approve worker expense reports | TBD |
| `edit_completed_jobs` | Modify jobs after completion | TBD |
| `void_reception` | Reverse a reception entry | TBD |
| `access_reports` | View financial reports | TBD |

## Database Schema (Future)

```sql
-- Add permissions column to users table
ALTER TABLE users ADD COLUMN permissions TEXT[] DEFAULT '{}';

-- Example values:
-- ['delete_closed_order_units', 'approve_expenses']
```

## How to Add a New Permission

1. **Add to this file** - Document the new permission in the table above
2. **Add check in code** - Use pattern: `user.permissions?.includes('permission_name')`
3. **Add to Admin UI** - Create toggle in worker profile settings
4. **Require re-auth** - Use `AdminPasswordModal` for sensitive actions
5. **Log the action** - Include admin name, timestamp in audit trail

## Files to Modify When Adding Permissions

- `shared/schema.ts` - Add `permissions` to User type
- `client/src/api/providers/supabase/UserProvider.ts` - Fetch permissions with user
- `AdminPasswordModal.tsx` - Reuse for any admin-gated action
- Worker profile/settings UI - Add permission toggles
