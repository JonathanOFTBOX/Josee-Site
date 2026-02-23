# PWA Setup Guide

> **Purpose:** Make Fieldbox look like a native app (no browser bar)

---

## How It Works

The `manifest.json` tells browsers this is an installable app. When users "Add to Home Screen", the app opens in **standalone mode** — no address bar, looks native.

---

## Files

| File | Purpose |
|------|---------|
| `client/public/manifest.json` | App name, icons, display mode |
| `client/index.html` | Links the manifest |

---

## User Installation

### 📱 Android (Chrome)
1. Open app in Chrome
2. Tap ⋮ menu → "Add to Home screen"
3. App icon appears on home screen
4. Opens without browser chrome ✅

### 🍎 iPhone/iPad (Safari)
1. Open app in Safari
2. Tap Share button → "Add to Home Screen"
3. App icon appears on home screen
4. Opens in standalone mode ✅

### 💻 Desktop (Chrome/Edge)
1. Open app in browser
2. Click install icon in address bar (or ⋮ → "Install Fieldbox")
3. App opens in its own window ✅

---

## Manifest Options

```json
{
  "display": "standalone",     // No browser UI
  "theme_color": "#f97316",    // Orange status bar
  "background_color": "#0a0a0a" // Dark splash screen
}
```

**Display modes:**
- `standalone` — No browser UI (recommended)
- `fullscreen` — No status bar either
- `minimal-ui` — Slim browser bar
- `browser` — Normal browser

---

## Future: Service Worker (Offline)

To cache assets for true offline support, add a service worker:
1. Create `client/public/sw.js`
2. Register in `main.tsx`
3. Cache static assets + API responses

> Note: You already have Dexie for data. Service worker would cache the app shell.

---

## Testing

1. Deploy to HTTPS (required for PWA)
2. Open Chrome DevTools → Application → Manifest
3. Check for errors
4. Test "Install" prompt

---

> **Last Updated:** 2026-01-10
