# Code Patterns & Best Practices

> Tips and patterns learned from debugging this project.
> **⚠️ MANDATORY:** All coding agents (Derek, Marcus) MUST follow these rules.

---

## 🔴 ARCHITECTURE RULES (NON-NEGOTIABLE)

### 🛑🛑🛑 RULE ZERO: EXTRACT OVER EDIT (ABSOLUTE PRIORITY) 🛑🛑🛑

> **⛔ HARD STOP: If a file exceeds 500 lines, you are FORBIDDEN from adding code to it.**

**THE RULE:**
1. **Before editing ANY file**, check its line count
2. **If file > 500 lines**: You MUST create a NEW file instead
3. **Extract** the relevant component/hook/logic to a new file
4. **Import** the new file from the original
5. **NEVER** add more code to files over 500 lines

**EXTRACTION PATTERNS:**
| If you see... | Create... |
|---------------|-----------|
| Large component (>500 lines) | Extract sub-components to new files |
| Complex logic in component | Extract to `useXxx.ts` hook |
| Multiple modals in one file | Split each modal to own file |
| Utility functions mixed in | Move to `utils/` or `lib/` |

**ENFORCEMENT:**
```
⛔ File > 500 lines + You want to ADD code = STOP
✅ Create new file → Extract logic → Import it back
```

> **⚠️ NO EXCEPTIONS. NO EXCUSES.**
> - ❌ "It's faster to just add it here" = FAILED
> - ❌ "It's only a few lines" = FAILED  
> - ❌ "I'll refactor later" = FAILED
> - ✅ "Creating new file to keep under 500" = CORRECT

**VERIFICATION QUESTION:**
Before editing, ask: "Is this file over 500 lines?" If YES → New file.

---

### 1. 📏 STRICT FILE SIZE LIMITS
- **Soft Limit:** Aim for files under **1000 lines**.
- **Hard Limit:** No file shall exceed **1500 lines**.
- **Action:** If a file approaches 1500 lines, you MUST stop and propose a refactor to split it into smaller sub-components or hooks immediately. Do not add more code to a "God File."


### 2. 🧩 REUSABILITY FIRST (The "DRY" Rule)
- **Check First:** Before creating a new component (especially Modals, Forms, or Cards), check if one already exists.
- **Unified Modals:** NEVER define a Dialog/Modal content inside a Page component.
  - All Modals must live in `@/components/modals/` (or a specific feature folder).
  - Example: `EditJobModal.tsx` should be one file used by both the Admin Dashboard and the Schedule/Calendar page. Do not create `AdminEditJob` and `CalendarEditJob`.
- **Props Interface:** When extracting a component, define a clear TypeScript interface for its props.

### 3. 🧠 SEPARATION OF CONCERNS
- **View vs. Logic:**
  - **Components (`.tsx`):** Should only contain JSX (UI) and layout logic.
  - **Hooks (`useHook.ts`):** All business logic, API calls (`useEffect`, `fetch`), and complex state (`useState`, `useMemo`) must be extracted into custom hooks.
- **Example:** Instead of fetching data inside `Dashboard.tsx`, create `hooks/useDashboardData.ts` and import it.

### 4. 📂 FOLDER STRUCTURE STANDARD
Organize code by **Feature** or **Category**, not just by type.
- `src/components/ui/` → Primitives (Buttons, Inputs - usually shadcn).
- `src/components/modals/` → Global/Reusable Modals (CreateJob, EditClient).
- `src/features/[feature]/components/` → Components specific to a feature (e.g., `JobCard.tsx`).
- `src/hooks/` → Reusable logic.

### 5. 🛡️ DEFENSIVE CODING & REFACTORING
- When refactoring large files, **do not delete** logic unless explicitly told to. Move it, don't remove it.
- Ensure all imports are updated when moving files.
- **Zero Data Loss:** Verify no lines are accidentally deleted.

> ⚠️ **COPY-PASTE ONLY RULE:**
> When extracting components/hooks to smaller files:
> 1. **COPY** exact code from source file
> 2. **PASTE** into new file (NO changes to logic)
> 3. **UPDATE** imports in both files
> 4. **VERIFY** `npm run build` passes
> 
> ❌ **FORBIDDEN:** "Improving" code during extraction, renaming variables, changing logic "for clarity"

## 📸 Photo Capture Pattern

**Key Rule: Keep handlers SIMPLE on mobile.**

```tsx
// ✅ GOOD - matches work photo pattern
const handlePhotoCapture = async (file: File) => {
  try {
    const compressed = await compressPunchPhoto(file);
    setPhotoFile(compressed);
    setPhotoUrl(URL.createObjectURL(compressed));
  } catch (error) {
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
  }
};

// ❌ BAD - extra state causes memory issues on mobile
const handlePhotoCapture = async (file: File) => {
  setIsPhotoProcessing(true); // REMOVE THIS
  const compressed = await compressPunchPhoto(file);
  setPhotoFile(compressed);
  setTimeout(() => setIsPhotoProcessing(false), 2000); // REMOVE THIS
};
```

**Preview pattern:**
- `PhotoCapture` component always gets `previewUrl={null}`
- Preview is managed separately with conditional rendering
- Compression happens during capture (not at upload time)

---

## 🔄 Job Assignment

When unassigning a job, ALWAYS clear both:
```typescript
await updateJob(jobId, {
  assignedTo: null,           // Clear single assigned user
  assignedWorkers: [],        // Clear array
  status: 'paused'            // Change status
});
```

---

## 📡 Event Communication

For cross-component communication (e.g., toast → modal):

```tsx
// Dispatch custom event
window.dispatchEvent(new CustomEvent('openJobModal', { detail: jobId }));

// Listen in useEffect
useEffect(() => {
  const handler = (e: CustomEvent) => openModal(e.detail);
  window.addEventListener('openJobModal', handler as EventListener);
  return () => window.removeEventListener('openJobModal', handler as EventListener);
}, []);
```

---

## 🔐 Double Punch-In Prevention

Always check for active session before starting new one:
```typescript
const activeSession = await dataProvider.getActiveSession();
if (activeSession) {
  toast({ title: "Already working on another job", variant: "destructive" });
  return;
}
// Then start new session...
```

---

## 🗄️ Database Utilities

### Close orphan sessions
```sql
UPDATE sessions SET end_time = NOW() WHERE end_time IS NULL;
```

### Clear unassigned jobs
```sql
UPDATE jobs SET assigned_to = NULL 
WHERE assigned_workers IS NULL OR array_length(assigned_workers, 1) IS NULL;
```

---

## 💾 Supabase Data Provider
When using `SupabaseDataProvider` to interact with Supabase client directly, you MUST manually map **camelCase** (frontend) properties to **snake_case** (database) columns.

```typescript
// ❌ BAD - Supabase will error "Could not find column unitCost"
await supabase.from("inventory_items").insert({
  unitCost: 10,
  ...item
});

// ✅ GOOD - Explicit mapping (camelCase → snake_case)
await supabase.from("inventory_items").insert({
  company_id: item.companyId,
  name: item.name,
  unit_cost: item.unitCost,
  quantity: item.quantity,
});
```

---

## 📱 Mobile Best Practices

### "Immediate Upload" Photo Pattern
To prevent "Low Memory" (OOM) crashes on mobile devices:
1.  **Decouple Upload:** Upload photo immediately, do not hold Blob in state.
2.  **Clear Blob:** Set `setPhotoFile(null)` immediately after upload starts/completes.
3.  **Compression:** Target 600x600px @ 0.5 quality.

```tsx
const handlePhotoCapture = async (file: File) => {
  setIsUploading(true);
  try {
    const compressed = await compressPunchPhoto(file);
    // Upload immediately
    const url = await dataProvider.uploadPhoto(compressed);
    
    // CRITICAL: Clear local blob immediately to free RAM
    setPhotoUrl(url); 
    setPhotoFile(null); 
  } finally {
    setIsUploading(false);
  }
};
```

### Single Scroll Rule for Modals

> **⛔ NEVER have double scroll in modals.** Only ONE vertical scroll per modal.

**THE RULE:**
- Modal content should have ONE scroll area (at the modal level)
- Child components (like timelines, lists) should NOT have their own scroll
- Let the parent modal's ScrollArea handle all scrolling

```tsx
// ✅ GOOD - Single scroll at modal level
<DraggableDialogContent className="max-h-[90vh] overflow-hidden">
    <ScrollArea className="max-h-[70vh]">
        <ReceptionTimeline /> {/* No max-height/overflow here */}
        <OtherContent />
    </ScrollArea>
</DraggableDialogContent>

// ❌ BAD - Double scroll (modal + child both scroll)
<DraggableDialogContent className="max-h-[90vh] overflow-hidden">
    <ScrollArea className="max-h-[70vh]">
        <div className="max-h-[300px] overflow-y-auto"> {/* NO! */}
            <ReceptionTimeline />
        </div>
    </ScrollArea>
</DraggableDialogContent>
```

---

## 🔒 Mobile Viewport Protection (NEVER MODIFY)

> **⛔ CRITICAL RULE:** The following CSS properties are PROTECTED and MUST NEVER be removed or modified:

### Protected Patterns:

1. **`touch-action: pan-y`** - Prevents horizontal drag breaking layout
2. **`overflow-x-hidden`** - Prevents horizontal scroll/shift
3. **`overflow-hidden`** on parent containers - Contains content

### Files with Protected Viewport Settings:

| File | Protection |
|------|------------|
| `calendar/month-view.tsx` | `touch-action: pan-y`, `overflow-x-hidden` |
| `calendar/index.tsx` | `overflow-x-hidden` on main container |

### Why This Matters:

On mobile, horizontal touch gestures can shift the entire viewport out of position, breaking the UI. The `touch-action: pan-y` CSS property restricts touch input to vertical scrolling only.

> **🚨 INSTANT FAILURE:** Removing or modifying these properties without explicit CEO approval is an INSTANT FAILURE.

---

## 📅 Date Formatting Standard (MANDATORY)

> **⛔ NEVER use manual date formatting.** Always use `date-fns` with the French locale.

### Standard Format Patterns:

| Context | Format | Example Output |
|---------|--------|----------------|
| Short date | `d MMM` | `10 janv.` |
| Date with time | `d MMM, HH:mm` | `10 janv., 12:15` |
| Full date | `d MMM yyyy` | `10 janv. 2026` |
| Full date with time | `d MMM yyyy, HH:mm` | `10 janv. 2026, 12:15` |

### Required Imports:

```tsx
import { format } from "date-fns";
import { fr } from "date-fns/locale";
```

### Usage:

```tsx
// ✅ GOOD - Consistent date formatting
{format(new Date(item.createdAt), "d MMM, HH:mm", { locale: fr })}

// ❌ BAD - Manual formatting
{`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`}

// ❌ BAD - Wrong format (slash or dash separators)
{format(new Date(item.createdAt), "dd/MM/yyyy", { locale: fr })}
```

### Where This Applies:

- Reception History timeline
- Buffer Zone item dates
- Order item timestamps
- Supplier order dates
- Any user-facing date in the app

---

## 📱 Modal Pattern Standard (MOBILE-FIRST)

> **All modals MUST follow this pattern for mobile responsiveness.**

### Required Structure:

```tsx
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DraggableDialogContent } from "@/components/draggable-dialog";

<Dialog open={open} onOpenChange={onOpenChange}>
    <DraggableDialogContent 
        className="max-w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-0" 
        hideCloseButton
    >
        {/* Sticky header */}
        <DialogHeader className="sticky top-0 z-10 bg-background p-4 border-b shrink-0">
            <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-5 w-5 text-orange-500" />
                    Title
                </DialogTitle>
                <button type="button" onClick={onClose} className="p-1">
                    <X className="h-5 w-5" />
                </button>
            </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Content here */}
        </div>

        {/* Sticky footer with actions */}
        <div className="shrink-0 p-4 border-t bg-background space-y-2">
            <Button className="w-full h-12 rounded-full">
                Primary Action
            </Button>
        </div>
    </DraggableDialogContent>
</Dialog>
```

### Key Requirements:

| Rule | Reason |
|------|--------|
| `max-w-[95vw] sm:max-w-md` | Full width on mobile, constrained on desktop |
| `max-h-[90vh]` | Prevents modal from being taller than viewport |
| `flex flex-col` | Enables sticky header/footer pattern |
| `hideCloseButton` | Use custom X button for mobile |
| `h-12 rounded-full` on buttons | Large touch targets for "dirty hands" users |
| `shrink-0` on header/footer | Prevents compression when content scrolls |

### Button Styling:

```tsx
// ✅ GOOD - Mobile-friendly buttons
<Button className="w-full h-12 rounded-full">Action</Button>

// ❌ BAD - Too small for touch
<Button>Action</Button>
```

