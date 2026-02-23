---
description: Always display time durations as hours and minutes (e.g., "3h 38m"), never decimal hours
---

# Time Formatting Rule

## Core Rule
**ALL time durations must be displayed as hours and minutes, NOT decimal hours.**

✅ Correct: `3h 38m`, `1h 22m`, `45m`, `8h`
❌ Wrong: `3.63h`, `1.37h`, `0.75h`

## Helper Function Location
Use the shared utility function:
```typescript
import { formatHoursToHM } from "@/lib/time-utils";

// Usage
formatHoursToHM(3.63)  // → "3h 38m"
formatHoursToHM(1.37)  // → "1h 22m"
formatHoursToHM(0.75)  // → "45m"
formatHoursToHM(8)     // → "8h"
```

## Where This Applies
- Calendar sidebar (remaining hours)
- Job cards (estimated/worked hours)
- Timesheets and pay calculations
- Dashboard metrics
- Any UI showing duration

## Implementation
The function is in `client/src/lib/time-utils.ts`:
```typescript
export function formatHoursToHM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}
```
