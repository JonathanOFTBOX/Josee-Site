# Design Guidelines: Field Service Time & Proof Module

## Design Approach
**System-Based Approach** using **Material Design 3** principles adapted for mobile-first utility, combined with premium SaaS patterns from Linear and Notion for elevated feel.

**Rationale**: This is a utility-focused, mobile-first application where clarity, efficiency, and trust are paramount. Workers need instant comprehension in field conditions; bosses need scannable data dashboards.

---

## Typography System

**Font Family**: Inter (via Google Fonts CDN)
- Primary: Inter Variable (400, 500, 600, 700)
- Monospace: JetBrains Mono (for time displays, coordinates)

**Type Scale**:
- Hero/Display: text-4xl font-bold (job titles, dashboard headers)
- Page Titles: text-2xl font-semibold
- Section Headers: text-lg font-semibold
- Body: text-base font-normal
- Captions/Meta: text-sm font-medium
- Micro/Labels: text-xs font-medium uppercase tracking-wide

**Critical**: Time displays (duration, timestamps) use monospace at text-xl or text-2xl for easy scanning.

---

## Layout & Spacing System

**Spacing Units**: Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-6, mb-8)

**Mobile-First Grid**:
- Mobile: Single column, full-width cards with p-4 padding
- Tablet/Desktop: 2-column dashboards (worker jobs, boss analytics)
- Maximum container: max-w-7xl mx-auto px-4

**Vertical Rhythm**:
- Section spacing: space-y-6 on mobile, space-y-8 on desktop
- Card internal padding: p-6 standard
- Form field gaps: space-y-4

**Critical Button Sizing** (mobile-optimized):
- Primary actions: h-14 text-lg (punch in/out, submit)
- Secondary actions: h-12 text-base
- Tertiary/Icon buttons: h-10 w-10
- Minimum tap target: 44×44px always

---

## Component Library

### Navigation
- **Worker Nav**: Bottom tab bar (fixed) with 3-4 icons (Jobs, Active Session, Timesheet, Profile)
- **Boss Nav**: Sidebar on desktop, hamburger on mobile with slide-out drawer
- Active states: bold font + indicator line/dot

### Cards
- **Job Cards**: Elevated shadow (shadow-md hover:shadow-lg), rounded-xl, p-6
  - Job title (text-lg font-semibold)
  - Location with map pin icon
  - Distance badge (conditional: green if in range, amber if nearby, red if far)
  - Status badge (Assigned/Active/Completed)
  - Action button (full-width on mobile)

- **Session Cards** (Timesheet): Timeline-style vertical stack
  - Date header (sticky)
  - Time range with monospace font
  - Duration badge
  - Photo thumbnail grid (if applicable)
  - Expand/collapse details

### Forms & Inputs
- Text inputs: h-12, rounded-lg, border-2, focus:ring-4 focus:ring-opacity-20
- Labels: text-sm font-medium mb-2
- Error states: border-red-500 with text-sm text-red-600 helper text
- Photo capture: Large dashed border button (h-48) with camera icon, "Tap to Capture" text

### Buttons
- **Primary**: Full-width on mobile, rounded-xl, h-14, font-semibold, shadow-md hover:shadow-lg
- **Hero/Image Overlays**: backdrop-blur-md bg-white/10 text-white, no additional hover effects (inherits default)
- **Destructive**: Red variant for "End Job" / "Punch Out"
- **Loading State**: Spinner + disabled opacity-60

> **🔴 MANDATORY: Primary Action Button Styling**
> All primary action buttons (Close Order, Confirm, Submit, Fermer la commande) MUST use:
> - **Background:** Brand orange (`bg-orange-500` or `--primary`)
> - **Text:** White (`text-white`)
> - **Border:** Orange variant (`border-orange-600`)
> - **Hover:** Darker orange (`hover:bg-orange-600`)
> - **Icon + Text:** If using icon, left-align icon with 2-unit gap
> 
> ❌ **NEVER:** Use white/gray buttons for primary actions in modals
> ✅ **ALWAYS:** Orange buttons for confirmations, closes, submits

### Data Visualization (Boss Dashboard)
- **Stat Cards**: Grid of metrics (Hours This Week, Active Jobs, Total Employees)
  - Large number (text-3xl font-bold monospace)
  - Label (text-sm)
  - Trend indicator (optional: +12% with arrow)
  
- **Tables**: Striped rows, sticky headers, mobile: convert to stacked cards
- **Filters**: Horizontal scroll pills on mobile, multi-select dropdowns on desktop

### Status Badges
- Pill-shaped (rounded-full px-3 py-1 text-xs font-medium)
- Semantic states: Active (green), Assigned (blue), Completed (gray), Issue (red)

### Geo-Verification UI
- **Distance Display**: Large centered text-4xl monospace with "meters away" label
- **GPS Accuracy**: Badge showing ±X meters with icon
- **Radius Indicator**: Circular progress ring showing proximity to allowed radius
- **Map Preview** (if adding): Small embedded map with user pin and job site pin

---

## Animations (Sparingly Applied)

**Page Transitions**: Framer Motion slide-in (x: 20, opacity 0→1, 0.3s ease)
**Card Hover**: transform scale(1.02) + shadow lift (0.2s ease)
**Button Press**: scale(0.98) active state
**Loading**: Skeleton screens (pulse animation) for job lists, not spinners
**Success Feedback**: Checkmark scale-in animation after punch in/out

---

## Images

**Hero Section** (Login Page):
- Full-viewport background image showing field worker in action (blurred overlay: backdrop-blur-sm bg-black/40)
- Centered login card (max-w-md) with backdrop-blur-md glass effect
- No logo/branding in initial build—placeholder comment for client injection

**Dashboard Headers**: 
- Small accent images (optional): abstract geometric patterns or subtle field service photography as decorative background elements

**Photo Proof Display**:
- Thumbnail grid (grid-cols-2 md:grid-cols-3 gap-2)
- Lightbox on click (full-screen overlay)

---

## Branding Placeholders

**Injection Points** (Clearly Commented):
- Logo: `<!-- BRAND: Company logo SVG -->`
- Primary color: CSS variable `--brand-primary` (default: neutral-900)
- Accent color: CSS variable `--brand-accent` (default: blue-600)
- Hero background: `/public/images/hero-bg.jpg` (commented source needed)

---

## Quick Color Reference (For Agents)

> **IMPORTANT:** Agents must use these existing CSS variables. Do NOT add new colors without Architect approval.

| Variable | Purpose | Usage |
|----------|---------|-------|
| `--primary` | Main accent (Orange) | Buttons, links, highlights |
| `--background` | Page background | Body, containers |
| `--card` | Card surfaces | Cards, modals |
| `--muted` | Subtle backgrounds | Disabled states, secondary |
| `--destructive` | Error/danger | Delete buttons, warnings |

**File:** `client/src/index.css` (`:root` block)

---

## Accessibility

- WCAG AA contrast ratios minimum
- Focus visible rings (ring-4) on all interactive elements
- ARIA labels on icon-only buttons
- Form validation announces errors via aria-live
- Touch targets: 44×44px minimum throughout

---

**Final Note**: This is a production SaaS module. Every component must feel premium, trustworthy, and effortless on mobile devices in varying field conditions. Prioritize clarity and speed over decorative flourishes.