---
name: Modal & Page UI Patterns
description: Standards for modals and pages - mobile-first, full-height, proper scrolling, professional button layouts
---

# Modal & Page UI Patterns

## ⚠️ CRITICAL RULES

1. **ALWAYS 1 SCROLL**: Never nest scroll areas. One scrollable container per modal/page.
2. **MOBILE STACKED BUTTONS**: On mobile, action buttons MUST be full-width and stacked vertically.
3. **STICKY HEADER**: The modal header with X close button MUST stay visible when scrolling. Use `flex flex-col overflow-hidden` on outer, `flex-1 overflow-y-auto` on content.

---

## 🚫 What to Avoid (Examples)

- ❌ Modal inside modal
- ❌ Scroll area inside scroll area
- ❌ Small scrollable div inside a larger modal
- ❌ `max-h-[200px] overflow-y-auto` inside a scrollable parent
- ✅ One modal/page with one scroll for entire content

## Core Principles

1. **One scroll per container**: Single scrollable area for all content
2. **Full-height on mobile**: Use maximum available viewport height
3. **Scroll the modal, not inner content**: No small scrollable windows inside
4. **No hard cutoff**: Content can grow vertically as needed
5. **Dirty Hands friendly**: Large tap targets (minimum 44px), high contrast
6. **Buttons must fit**: always use `w-full` stacked on mobile

---

## 🏗️ Layout Patterns

### 1. Modal Pattern

```tsx
<DialogContent className="max-w-[95vw] sm:max-w-[500px] h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden">
  {/* Header */}
  <DialogHeader className="shrink-0 pb-4 border-b">
    <DialogTitle>Title</DialogTitle>
  </DialogHeader>
  
  {/* Content - SCROLLS */}
  <div className="flex-1 overflow-y-auto py-4">
    {/* Page content */}
  </div>
  
  {/* Footer - FIXED */}
  <DialogFooter className="shrink-0 pt-4 border-t flex-col gap-2 sm:flex-row">
    <Button variant="outline" className="w-full sm:w-auto h-12">Cancel</Button>
    <Button className="w-full sm:w-auto h-12">Save</Button>
  </DialogFooter>
</DialogContent>
```

### 2. Page Pattern

```tsx
<div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
  <div className="shrink-0 p-4 border-b">...</div>
  <div className="flex-1 overflow-y-auto p-4">...</div>
  <div className="shrink-0 p-4 border-t bg-background">
     <Button className="w-full sm:w-auto h-12">Save</Button>
  </div>
</div>
```

### 3. Sidebar/Panel Scroll Pattern

When a sidebar or panel needs to scroll independently (e.g., UnassignedPoolSidebar):

```tsx
{/* Container with responsive height */}
<div className="flex flex-col max-h-[60vh] sm:max-h-[calc(100vh-12rem)] overflow-hidden">
  {/* Fixed header */}
  <div className="shrink-0 p-4 border-b">
    <h3>Title</h3>
  </div>
  
  {/* Scrollable content - KEY: flex-1 + overflow-y-auto + min-h-0 */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {items.map(item => (
      <div key={item.id}>...</div>
    ))}
  </div>
</div>
```

**Critical:** The `min-h-0` class is often needed to fix flex container scroll issues. Without it, `flex-1` may not scroll properly.

---

## 📱 Mobile Button Rules (The "Professional" Look)

To achieve the "Dirty Hands" friendly professional look, follow these rules for **ALL** action button groups:

### Rule 1: Vertical Stack on Mobile
Never let buttons float or sit side-by-side on mobile. Stack them.

```tsx
// ✅ CORRECT
<div className="flex flex-col gap-2 sm:flex-row sm:justify-end w-full">
  <Button className="w-full sm:w-auto">Action 1</Button>
  <Button className="w-full sm:w-auto">Action 2</Button>
</div>

// ❌ WRONG
<div className="flex justify-end gap-2">
  <Button>Action 1</Button>
</div>
```

### Rule 2: Full Width Touch Targets
All buttons on mobile must be `w-full`. This makes them easy to tap with dirty hands/gloves.

```tsx
// ✅ CORRECT
<Button className="w-full sm:w-auto h-10">...</Button>
```

### Rule 3: Minimum Height
Use `h-10` (40px) or `h-12` (48px) for all touch targets.

### Rule 4: Segmented Controls (Toggles)
For filters or toggles (e.g., "All" vs "Low Stock"), use a full-width segmented control on mobile.
**Avoid** `inline-flex` which can leave empty space or create small tap targets.

```tsx
// ✅ CORRECT (Mobile 50/50 split)
<div className="flex w-full sm:w-auto bg-muted rounded-full p-1">
  <button className="flex-1 sm:flex-none text-center ...">All</button>
  <button className="flex-1 sm:flex-none text-center ...">Low Stock</button>
</div>

// ❌ WRONG (Empty bar effect or small targets)
<div className="inline-flex ...">...</div>
```

---

## 🚫 Common Mistakes (DON'Ts)

- **DON'T** use `flex items-center gap-2` for button rows without `flex-wrap` or `flex-col`.
- **DON'T** leave buttons as auto-width on mobile (they look small and "floating").
- **DON'T** use `inline-flex` for toggles on mobile (make them full-width segmented controls).
- **DON'T** nest `ScrollArea` inside a modal that is already scrollable.
- **DON'T** use `h-[100dvh]` unless necessary; `h-[90vh]` allows seeing the background context.

## 🛡️ Content Containment (Anti-Overflow)

Text must **NEVER** overflow its container on mobile (320px+).

1. **Use `min-w-0`**: Always add `min-w-0` to flex children that contain text.
   ```tsx
   <div className="flex items-center gap-2">
     <div className="min-w-0 flex-1"> {/* Prevents overflow */}
       <p className="truncate">Very long text...</p>
     </div>
   </div>
   ```

2. **Truncate or Wrap**: Decide strictly between `truncate` (single line) or `break-words` (multi-line).
   - Titles/Names: Usually `truncate`.
   - Descriptions/Messages: Usually `whitespace-normal break-words`.

3. **No Fixed Widths**: Avoid `w-[300px]`. Use `%` or `max-w` with `w-full`.

---

## 📱 Mobile Data Display Patterns (NO TABLES)

### Rule 1: NO TABLES on Mobile
Tables (`<table>` or CSS grid tables) generally fail on mobile.
- **Desktop (`md+`)**: Use Tables/Grid.
- **Mobile (`< md`)**: Use **Stacked Cards** or **Definition Lists**.

```tsx
// ✅ CORRECT
{materials.map(item => (
  // Mobile Card View
  <div className="md:hidden border rounded p-3 space-y-2">
    <div className="font-bold">{item.name}</div>
    <div className="flex justify-between">
      <span>Qty</span>
      <span>{item.qty}</span>
    </div>
    <div className="flex justify-between">
      <span>Total</span>
      <span>${item.total}</span>
    </div>
  </div>

  // Desktop Table View
  <div className="hidden md:grid grid-cols-12 ...">
    ...
  </div>
))}
```

### Rule 2: Flexible Tabs
Tabs must **NEVER** use fixed columns (`grid-cols-3`) on mobile if labels are long.
- Use `flex-wrap` so tabs naturally flow to new lines.
- Or use horizontal scroll (if appropriate), but wrapping is safer for visibility.

```tsx
// ❌ WRONG (Squashes tabs)
<TabsList className="grid grid-cols-3 w-full">

// ✅ CORRECT (Wraps on mobile)
<TabsList className="w-full h-auto flex flex-wrap md:grid md:grid-cols-3">
  <TabsTrigger className="flex-1" ...>
```

### Rule 3: Financial Summaries Must Wrap
Long labels (e.g., "PRIX FINAL (Ce que le client paie)") often overlap values on small screens.
- Always use `flex-wrap` on row containers.
- Allow labels to take up 100% width if needed.

```tsx
// ✅ CORRECT
<div className="flex flex-wrap justify-between items-center gap-2">
  <span>Label</span>
  <span>$100.00</span>
</div>
```

