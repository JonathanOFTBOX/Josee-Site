---
name: Confirmation & Warning Dialogs
description: Standards for implementing confirmation, warning, and alert dialogs to ensure consistent UI/UX.
---

# Confirmation & Warning Dialogs

## Core Rule
**NEVER** use native browser dialogs (`window.confirm()`, `window.alert()`, `window.prompt()`, or bare `confirm()`). They look unprofessional, show the domain name, and break the mobile app experience.

Instead, **ALWAYS** use the **Shadcn UI `AlertDialog`** component.

## Implementation Standard

### 1. Imports
Always import from `@/components/ui/alert-dialog`:

```typescript
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
```

### 2. State Management
Use a local state to control visibility. If you need to track WHICH item is being deleted, use the item itself as state (null = closed):

```typescript
// Simple case: one delete button
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

// List case: track which item is pending deletion
const [pendingDeleteItem, setPendingDeleteItem] = useState<ItemType | null>(null);
// Open: setPendingDeleteItem(item)
// AlertDialog open={!!pendingDeleteItem}
```

### 3. Usage Pattern
Place the `AlertDialog` at the bottom of your JSX, OUTSIDE any other Dialog/Modal if possible. This prevents z-index and focus-trapping conflicts.

```tsx
return (
  <>
    {/* Main UI */}
    <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
      {t('common.delete')}
    </Button>

    {/* Confirmation Dialog */}
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t('section.confirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                    {t('section.confirmDesc')}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleConfirm}
                >
                    {t('common.delete')}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  </>
);
```

### 4. i18n Rules (CRITICAL)
- **NEVER** hardcode text in AlertDialog — use `{t('key')}` for ALL text
- Add translation keys to BOTH `en.ts` AND `fr.ts`
- Always add a `Title` key AND a `Desc` key — AlertDialog requires both for accessibility
- Cancel button should use `{t('common.cancel')}`

### 5. Destructive Action Styling
The confirm/action button for destructive actions MUST use:
```
className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
```

## Known Remaining `confirm()` Calls (TODO)
These files still use browser `confirm()` and should be migrated:
- `client/src/pages/worker/active-session/hooks/useActiveSession.ts`
- `client/src/pages/worker/active-session/hooks/photoHandlers.ts`
- `client/src/pages/boss/timesheet.tsx`
- `client/src/pages/boss/admin/hooks/useAdminClients.ts`
- `client/src/pages/boss/admin/components/AdminFleetSection.tsx`
- `client/src/components/modals/JobHistoryModal.tsx`

## Already Fixed ✅
- `EditProductFromSupplierModal.tsx` — v721
- `SupplierDetailModal.tsx` — v721

## Review Checklist
- [ ] Is `window.confirm` / `confirm()` removed?
- [ ] Is the primary destructive action colored red (`bg-destructive`)?
- [ ] Is ALL text using `{t('key')}` — no hardcoded strings?
- [ ] Are keys added to BOTH `en.ts` AND `fr.ts`?
- [ ] Is the AlertDialog placed outside other Dialogs (no nesting conflicts)?
- [ ] Is the dialog fully responsive (mobile friendly)?
