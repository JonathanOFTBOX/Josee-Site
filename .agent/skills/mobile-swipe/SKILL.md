---
description: Mobile swipe gesture patterns - scroll-friendly, directional detection
---

# Mobile Swipe Gesture Skill

This skill defines the standard pattern for swipe-to-action gestures on mobile that don't interfere with page scrolling.

## The Problem

Naive swipe implementations trigger actions when users are trying to scroll vertically. This frustrates users, especially those with large thumbs or on smaller screens.

## The Solution

**Directional locking** - Only trigger horizontal swipe AFTER confirming the user is moving more horizontally than vertically.

## Critical Thresholds

```typescript
// Movement thresholds
const HORIZONTAL_MIN = 10;  // px - Must move at least this far horizontally
const VERTICAL_MAX = 30;    // px - Must NOT move more than this vertically
const ACTION_THRESHOLD = 60; // px - Total distance to trigger action
```

## Reference Implementation

The best reference is `client/src/components/ui/swipeable-list-item.tsx`:

```typescript
import { useState, useRef, ReactNode } from "react";

export function SwipeableListItem({
    children,
    onEdit,
    onDelete,
}: {
    children: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);          // CRITICAL: Track Y position
    const isSwipingRef = useRef(false);   // CRITICAL: Lock direction once determined

    const handlePointerDown = (e: React.PointerEvent) => {
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;    // CRITICAL: Save start Y
        setIsDragging(true);
        isSwipingRef.current = false;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - startXRef.current;
        const dy = Math.abs(e.clientY - startYRef.current);

        // CRITICAL: Only trigger swipe if MORE HORIZONTAL than vertical
        if (Math.abs(dx) > 10 && dy < 30) {
            isSwipingRef.current = true;
            setTranslateX(Math.min(100, Math.max(-100, dx)));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        if (isDragging) {
            if (translateX > 60 && onEdit) onEdit();         // Right swipe
            else if (translateX < -60 && onDelete) onDelete(); // Left swipe
        }

        setTranslateX(0);
        setIsDragging(false);
    };

    return (
        <div className="relative overflow-hidden rounded-lg">
            {/* Action backgrounds here */}
            <div
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="touch-pan-y select-none relative bg-background"
            >
                {children}
            </div>
        </div>
    );
}
```

## Key CSS Classes

- `touch-pan-y` - Allows browser to handle vertical scroll
- `select-none` - Prevents text selection during drag
- `overflow-hidden` - Clips the action backgrounds

## PointerEvents vs TouchEvents

**Prefer PointerEvents** for swipe gestures:
- Works on both mobile AND desktop
- Simpler API (single handler for mouse + touch)
- Pointer capture prevents lost drags

If you must use TouchEvents (e.g., for compatibility), add the same directional check:

```typescript
const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const dx = e.touches[0].clientX - startXRef.current;
    const dy = Math.abs(e.touches[0].clientY - startYRef.current);

    // Only lock to swipe if horizontal > vertical
    if (!isSwipeLockedRef.current) {
        if (dy > 30) {
            // Vertical scroll - abort swipe
            setIsSwiping(false);
            return;
        }
        if (Math.abs(dx) > 10 && dy < 30) {
            isSwipeLockedRef.current = true;
        }
    }

    if (isSwipeLockedRef.current) {
        e.preventDefault(); // Stop page scroll while swiping
        setSwipeX(Math.max(-100, Math.min(dx, 100)));
    }
};
```

## When to Use This Pattern

- List items with edit/delete actions
- Cards that can be swiped to reveal options
- Any horizontal gesture on a vertically scrollable page

## Common Mistakes

❌ **No Y tracking** - Triggers on any horizontal movement during scroll
❌ **Too low threshold** - 5px horizontal is too sensitive
❌ **No `touch-pan-y`** - Browser can't scroll the page
❌ **No `preventDefault` after lock** - Page and item both move

## Files Using This Pattern

- `client/src/components/ui/swipeable-list-item.tsx` ✓ (Reference)
- `client/src/pages/boss/components/SupplierDetailModal.tsx` ✓ (Fixed)
- `client/src/pages/boss/calendar/day-dialog.tsx` ✓ (Already correct)
- `client/src/pages/worker/active-session/components/SessionProgressPanel.tsx` ✓ (Uses SwipeableListItem)
