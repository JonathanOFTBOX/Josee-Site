# Fieldbox - Project Context

> **👤 THE CEO:** **Jonathan Villeneuve** (call him "John" in chat)
> - **Company:** Founder & CEO of **OFTbox** (Out of the Box Consultant)
> - **Product:** Fieldbox is a product of OFTbox
> - **In chat:** Call him John
> - **For marketing/posts/official:** Use "Jonathan Villeneuve, Founder & CEO of OFTbox"

---

## What is Fieldbox?

**Fieldbox** is a mobile-first job management and time tracking app for **field service businesses** — plumbers, electricians, HVAC technicians, contractors, and any company that dispatches workers to job sites.

### Target Industries
- 🔧 Plumbing & HVAC
- ⚡ Electrical contractors
- 🏗️ Construction & Renovation
- 🚚 Delivery & Logistics
- 🛠️ Field maintenance

---

## Core Features

### 👷 Worker Features
| Feature | Description |
|---------|-------------|
| **Job List** | View assigned jobs with location, client, materials |
| **Punch In/Out** | GPS-verified time tracking |
| **Photo Proof** | Arrival, progress, and completion photos |
| **Voice Notes** | Hands-free voice memos with transcription |
| **Timesheet** | Personal work history and hours |
| **Offline Mode** | Full functionality without internet (Dexie sync) |

### 👔 Boss/Admin Features
| Feature | Description |
|---------|-------------|
| **Live Dashboard** | Real-time worker status and alerts |
| **Smart Calendar** | Drag-and-drop scheduling with multi-day spans |
| **Team Management** | Worker invitations, assignments, performance |
| **Job Lifecycle** | To Validate → Completed → Invoiced → Paid |
| **Inventory** | Warehouse stock, per-truck inventory, low stock alerts |
| **Multi-Supplier** | Manage suppliers, create purchase orders, auto-email |
| **Reports** | Hours by employee, job profitability, CSV/PDF export |
| **Fleet Management** | Trucks, QR codes, smart compatibility scoring |
| **Subscription Billing** | Stripe integration, per-worker pricing |

---

## 🧠 Core Principles (Non-Negotiable)

### 1. Zero Browser Tolerance
- **STRICTLY PROHIBITED**: Agents must never use `browser_subagent` or `open_browser`.
- **Reason**: System stability and data loss prevention.
- **Alternative**: Static analysis and User Verification only.

### 2. Git-First Workflow
- All changes must be committed.
- No direct UI-only edits; everything must be in code and tracked.

### 3. Cloudflare Pages Compatibility
- **100% Static Build**: Must output to `dist/`.
- **No Node Servers in Production**: All dynamic logic via Cloudflare Edge Functions (`functions/api/`).
- **Client-Side Routing**: Uses `_redirects` for SPA support.

### 4. Backend Architecture
- **Database & Auth**: Supabase (Postgres + Auth + Storage)
- **Edge Functions**: Cloudflare Pages Functions (`functions/api/`)
- **API Pattern**: All data access via `DataProvider` abstraction

### 5. Design Philosophy
- **Mobile-First**: "Dirty Hands UI" — large touch targets, 375px optimized
- **Premium SaaS**: Modern typography (Inter/Outfit), clean spacing
- **Bilingual**: Full French (Québec) and English support
- **Offline-First**: Works without internet, syncs when connected

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **🌐 Hosting** | Cloudflare Pages (static site + Edge Functions) |
| **🗄️ Database** | Supabase (Postgres + RLS) |
| **🔐 Auth** | Supabase Auth |
| **📦 Storage** | Supabase Storage (photos, logos) |
| **⚡ Edge Functions** | Cloudflare Pages Functions (`functions/api/`) |
| **🖥️ Frontend** | React 18 + TypeScript + Vite |
| **🎨 Styling** | TailwindCSS + shadcn/ui + Framer Motion |
| **📊 State** | Zustand (useAuth), TanStack Query (data fetching) |
| **🔀 Routing** | Wouter |
| **💾 Offline** | Dexie (IndexedDB) |
| **💳 Payments** | Stripe |
| **📧 Email** | Resend API |

---

## Architecture

```
client/src/
├── App.tsx              # Routes + Auth wrapper
├── pages/
│   ├── worker/          # Worker UI (jobs, active-session, timesheet)
│   └── boss/            # Boss UI (dashboard, admin, calendar, inventory, suppliers)
├── components/          # Reusable UI components
│   └── modals/          # Modal dialogs (JobForm, Truck, Validation, etc.)
├── store/               # Zustand stores (useAuth)
├── api/
│   ├── DataProvider.ts  # Facade for all data access
│   └── providers/       # Supabase, Mock providers
├── lib/                 # Utilities (geo, compression, time, translations)
└── hooks/               # Custom React hooks

functions/api/           # Cloudflare Edge Functions
├── create-checkout-session.ts
├── stripe-webhook.ts
├── worker-count/
├── update-subscription-seats.ts
└── invite-employee.ts

server/                  # Express (local dev only, NOT deployed)
shared/                  # Shared TypeScript types
supabase/                # Database migrations
```

---

## User Roles

| Role | Access | Home Page |
|------|--------|-----------|
| `worker` | Own jobs, sessions, photos, truck | `/worker/jobs` |
| `boss` | All company data, full admin | `/boss/dashboard` |
| `dispatcher` | Schedule only (future) | `/boss/admin` |

---

## Key Flows

### Punch In
1. Worker opens job → `/worker/jobs/:id`
2. GPS verifies location
3. Takes arrival photo (optional)
4. Clicks "Punch In" → Creates session
5. Redirects to `/worker/active/:sessionId`

### Punch Out
1. Worker on active session page
2. Takes completion photo (optional)
3. Opens punch-out modal
4. Confirms job complete or needs return
5. Session ends → Job moves to "Awaiting Validation"

### Job Validation (Boss)
1. Boss sees job in "To Validate" tab
2. Reviews photos, notes, materials, time
3. Adds admin notes or materials if needed
4. Marks "Completed" or "Needs Return Visit"
5. Job moves to "Completed Jobs" section

### Payment Tracking
1. Completed job shows in "Completed Jobs"
2. Boss marks as "Invoiced" when PDF sent
3. Boss marks as "Paid" when payment received

---

## Database Schema

> **Full Schema:** `.agent/DATABASE_SCHEMA.md`

### Core Tables
| Table | Description |
|-------|-------------|
| `companies` | Tenant accounts, subscription status |
| `profiles` | Users (workers, bosses) |
| `jobs` | Job definitions, lifecycle status, materials |
| `sessions` | Work sessions (punch in/out) |
| `photos` | Proof of work images |
| `checkins` | Worker 50% progress alerts |
| `inventory_items` | Warehouse stock |
| `trucks` | Company vehicles |
| `truck_inventory` | Per-truck stock levels |
| `suppliers` | Vendor contacts |
| `product_suppliers` | Product-supplier links |
| `purchase_orders` | Orders to suppliers |

---

## Key Files Reference

| Area | File | Notes |
|------|------|-------|
| Data Access | `api/DataProvider.ts` | All data goes through here |
| Auth | `store/auth.ts` | Zustand auth store |
| Offline Sync | `lib/offlineDb.ts` | Dexie IndexedDB |
| Translations | `lib/translations.ts` | FR/EN strings |
| Job Scheduling | `lib/schedule-utils.ts` | Multi-day job spans |
| Photo Capture | `components/photo-capture.tsx` | Camera handling |
| Stripe Checkout | `functions/api/create-checkout-session.ts` | Edge function |

---

## Environment Variables

### Local Development (.env)
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Cloudflare (Production)
```bash
SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
```

---

## Deployment

```bash
# Build
npm run build

# Output: dist/ folder
# Cloudflare Pages auto-deploys on push to main
```

**Live URL:** https://asset-manager1.pages.dev

---

> **Keep this document updated!** When adding major features, update this context file.
