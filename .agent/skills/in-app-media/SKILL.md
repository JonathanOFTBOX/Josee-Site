---
name: In-App Media Patterns
description: Rules for handling images, videos, and external links - always stay inside the app
---

# In-App Media Patterns

## ⚠️ CRITICAL RULES

1.  **NEVER OPEN MEDIA IN NEW TABS**: Images, videos, and documents must be previewed inside the application using a Modal or Overlay. `target="_blank"` is forbidden for media assets.
2.  **FULL SCREEN PREVIEW**: Previews should maximize the available screen real estate while maintaining aspect ratio.
3.  **MOBILE FRIENDLY**: Previews must be dismissible with a clear "X" button or swipe (if supported).

## 🚫 What to Avoid

- ❌ `<a href="image.jpg" target="_blank">`: This breaks the app experience.
- ❌ Opening PDFs in new tabs (unless strictly required by browser limitations).

## ✅ Implementation Pattern

### Image Preview Modal

Use a `Dialog` or `Lightbox` component.

```tsx
const [previewImage, setPreviewImage] = useState<string | null>(null);

// Trigger
<img 
  src={url} 
  onClick={() => setPreviewImage(url)} 
  className="cursor-pointer hover:opacity-80 transition-opacity" 
/>

// Modal
<Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
  <DialogContent className="max-w-[95vw] h-auto max-h-[95vh] p-0 overflow-hidden bg-black/90 border-none">
    <div className="relative w-full h-full flex items-center justify-center">
      <img src={previewImage} className="max-w-full max-h-full object-contain" />
      <button 
        onClick={() => setPreviewImage(null)}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white"
      >
        <XIcon />
      </button>
    </div>
  </DialogContent>
</Dialog>
```
