---
name: Photo Zoom Pattern
description: How to implement consistent photo viewing with zoom across the app
---

# Photo Zoom Pattern (ZoomableLightbox)

## Use the Shared Component
Always use `ZoomableLightbox` from `@/components/ui/zoomable-lightbox` for photo viewing.

## Quick Implementation

```tsx
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomableLightbox } from '@/components/ui/zoomable-lightbox';

// In component:
const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

// Photo thumbnail:
<img
  src={photoUrl}
  className="cursor-pointer hover:opacity-80"
  onClick={() => setLightboxPhoto(photoUrl)}
/>

// Lightbox (at end of component, inside fragment):
{lightboxPhoto && createPortal(
  <ZoomableLightbox
    photoUrl={lightboxPhoto}
    onClose={() => setLightboxPhoto(null)}
  />,
  document.body
)}
```

## Features Included
- Mouse wheel zoom (no Ctrl needed)
- Pinch zoom on touch devices
- Pan/drag when zoomed
- Zoom in/out/reset buttons
- Zoom percentage indicator
- Click outside to close
- Highest z-index via portal

## Files Using This Pattern
- `components/job-detail-dialog.tsx`
- `pages/boss/calendar/components/WorkerDetailInline.tsx`

## NEVER DO
- ❌ Use simple `<Dialog>` for photo preview
- ❌ Create local lightbox implementations
- ❌ Use `max-w-[95vw]` dialogs without zoom
