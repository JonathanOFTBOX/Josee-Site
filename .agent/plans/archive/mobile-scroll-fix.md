# Mobile Schedule Horizontal Scroll Bug Fix

> **Goal:** Fix the mobile scroll bug that allows horizontal scrolling and header displacement on rotation.

## Problem Description

On mobile Schedule/Calendar page:
1. User can scroll left of the screen (header shows "elcome, jonathan" cut off)
2. When rotating phone, header gets pushed left
3. When rotating back, header stays left and page can scroll horizontally

## ⚠️ PREVIOUS FIX ATTEMPT (DID NOT WORK)

> [!CAUTION]
> **Session:** 2026-01-02 23:15 (@Desktop-Dev Derek)
> **What Was Tried:**
> - Added `useEffect` in `calendar/index.tsx` to listen for `orientationchange` and `resize` events
> - Resets horizontal scroll position to 0 when phone orientation changes
> - Logged in `AGENT_LOGS.md` as "fix(mobile): Reset horizontal scroll on orientation change"
>
> **Why It Didn't Work:**
> - Only resets scroll AFTER the problem occurs
> - Does NOT prevent the horizontal overflow from happening in the first place
> - CSS `overflow-x: hidden` is missing on parent containers
>
> **DO NOT REPEAT:** Adding scroll reset listeners alone is insufficient. The root cause is missing CSS overflow protection.

## Screenshots

- [Scroll Left](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/.agent/proof/bug_mobile_scroll_left.png)
- [After Rotation](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/.agent/proof/bug_mobile_scroll_rotation.png)

---

## Proposed Changes

### Phase 1: Root Cause Analysis

Check these files for missing viewport protection:

| File | What to Check |
|------|---------------|
| `App.tsx` | Root container needs `overflow-x: hidden` |
| `client/src/index.css` | Global body/html needs `overflow-x: hidden` |
| `calendar/index.tsx` | Main container overflow settings |
| `month-view.tsx` | Touch-action and overflow settings |
| `sidebar.tsx` | Sidebar animation causing overflow |

---

### Phase 2: Apply Fixes

#### [MODIFY] [index.css](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/index.css)

Add global viewport protection:
```css
html, body, #root {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}
```

#### [MODIFY] [App.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/App.tsx)

Ensure root wrapper has:
```tsx
<div className="overflow-x-hidden max-w-full">
  {/* App content */}
</div>
```

#### [MODIFY] [calendar/index.tsx](file:///c:/Users/jogor/OneDrive/Documents/GitHub/Asset-Manager/client/src/pages/boss/calendar/index.tsx)

Strengthen orientation change handler:
```typescript
useEffect(() => {
  const resetScroll = () => {
    window.scrollTo(0, 0);
    document.body.scrollLeft = 0;
    document.documentElement.scrollLeft = 0;
  };
  
  window.addEventListener('orientationchange', resetScroll);
  window.addEventListener('resize', resetScroll);
  
  return () => {
    window.removeEventListener('orientationchange', resetScroll);
    window.removeEventListener('resize', resetScroll);
  };
}, []);
```

---

### Phase 3: Audit All Pages

Check these pages have same protection:
- [ ] Admin Panel (`/boss/admin`)
- [ ] Dashboard (`/boss/dashboard`)
- [ ] Worker Jobs (`/worker/jobs`)
- [ ] Worker Active Session (`/worker/active/:id`)

---

## Verification Plan

### Manual Verification (User Required)
1. Open Schedule on mobile
2. Try to scroll left — should be blocked
3. Rotate phone to landscape
4. Rotate back to portrait
5. Verify header is NOT shifted and cannot scroll horizontally
6. Repeat test on Admin, Dashboard, Worker pages

---

## Agent Assignment

| Agent | Model | Task |
|-------|-------|------|
| Derek | Gemini 3 Pro High | Fix all viewport overflow issues |
