# Critical Files Reference

> Quick lookup for the most important files in the project.

## Core Application

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Routes, auth wrapper, main entry |
| `client/src/main.tsx` | React DOM render |
| `client/src/config.ts` | App configuration (geofence radius, etc.) |

## State Management

| File | Purpose |
|------|---------|
| `client/src/store/auth/index.ts` | Auth state (user, login, logout) |
| `client/src/store/useSession.ts` | Active work session state |

## API Layer

| File | Purpose |
|------|---------|
| `client/src/api/SupabaseDataProvider.ts` | Facade that delegates to domain providers |
| `client/src/api/DataProvider.ts` | Data provider interface (mock/demo mode) |
| `client/src/api/types.ts` | Shared types, interfaces, converters |
| `client/src/api/providers/supabase/` | Domain providers (Jobs, Sessions, Users, Clients, Inventory, Photos) |
| `client/src/lib/supabaseClient.ts` | Supabase client singleton |

## Worker Pages (Mobile)

| File | Purpose |
|------|---------|
| `client/src/pages/worker/jobs.tsx` | Job list |
| `client/src/pages/worker/job-detail.tsx` | Punch IN page |
| `client/src/pages/worker/active-session/index.tsx` | Active session + Punch OUT |
| `client/src/pages/worker/timesheet.tsx` | Session history |

## Boss Pages (Admin)

| File | Purpose |
|------|---------|
| `client/src/pages/boss/dashboard/index.tsx` | Main admin view |
| `client/src/pages/boss/admin/index.tsx` | Worker/job management |
| `client/src/pages/boss/calendar/index.tsx` | Schedule view |

## Photo Handling ⚠️

| File | Purpose |
|------|---------|
| `client/src/components/photo-capture.tsx` | Camera component |
| `client/src/lib/image-compression.ts` | Photo compression (600x600) |

> **Known Issue:** Mobile memory problems. Keep handlers SIMPLE.

## Location/GPS

| File | Purpose |
|------|---------|
| `client/src/lib/geo.ts` | GPS functions (getCurrentPosition, distance) |
| `client/src/components/geo-status.tsx` | Location status UI |

## Database

| File | Purpose |
|------|---------|
| `supabase/setup.sql` | Schema + RLS policies |
| `supabase/SCHEMA.md` | Schema documentation |

## Configuration

| File | Purpose |
|------|---------|
| `client/src/lib/version-check.ts` | App version (update on deploy!) |
| `client/src/config.ts` | Geofence settings |
| `.env` | Supabase credentials |

## Evidence & Proof (Screenshots)

To fix bugs, you MUST check the evidence.
- **Location:** `.agent/proof/`
- **Usage:** In `DEBUG_HISTORY.md`, you will see links like `![Bug](file:///...)`.
- **Action:** You MUST use the `view_file` tool (or your visual capabilities) to OPEN these image links. Do not guess what the bug looks like. INSPECT THE EVIDENCE FIRST.
