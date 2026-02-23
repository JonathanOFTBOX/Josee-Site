# Epic: Executive Dashboard 2.0 (Premium Overhaul)

## 🎯 Goal
Transform the Boss Dashboard from a simple job list into a **"Super Beautiful" Executive Command Center**.
Focus on high-level financial insights, real-time worker efficiency, and a premium "Glassmorphism" aesthetic that works flawlessly on Desktop and Mobile.

## 🎨 User Vision
- **Aesthetic:** "Super beautiful", "Real dashboard", "Premium".
- **Key Metrics:**
    - Real-time vs Estimated Efficiency (Are we fast or slow?)
    - Job Profitability (Rentability)
    - Worker Performance
- **Requirements:**
    - Data must be accurate (Enforcer to validate).
    - Mobile layout must be perfect.

## 📸 Visual Reference (Current State - "What I Don't Like")
> The user explicitly flagged this design as needing improvement.
> **Goal:** Move away from this specific look. Make it "Premium", "Glassmorphism", "Bento Grid".

![Current Design to Replace](file:///C:/Users/jogor/.gemini/antigravity/brain/285c9ed7-d634-42ea-8508-e2e93370dcc9/uploaded_image_1767190879692.png)

## 🛠️ Implementation Strategy

### 1. UI Redesign (Desktop-Dev)
- **Concept:** "Bento Grid" Layout.
- **Components:**
    - **Header:** Personalized greeting + Live "Active Crews" summary.
    - **Widget A (Financials):** Revenue / Cost / Profit / Margin (with trend indicators).
    - **Widget B (Efficiency):** Bar chart comparing `Estimated Hours` vs `Live Actual Hours`.
    - **Widget C (Team Pulse):** Live status of every active worker (Working/Break/Travel) + Battery/Signal stats.
    - **Widget D (Profitability):** Top 5 Most Profitable Jobs vs Top 5 "Money Losers" (Over-budget jobs).
- **Styling:**
    - Dark Mode First (suggested for premium feel).
    - Subtle Gradients & Glassmorphism (Background blur).
    - Smooth Animations (Framer Motion) for data entry.

### 2. Data Integrity (Enforcer)
- **Audit Points:**
    - `job.clientRate`: Is this field populated?
    - `user.hourlyRate`: Do we have rates for all workers?
    - `profit` Calculation: `Revenue - (Hours * HourlyRate) - Materials`.
- **Action:**
    - Create SQL helpers or RPCs if complex aggregation is needed.
    - Ensure RLS protects this financial data from Workers.

### 3. Mobile Responsiveness (Mobile-Dev)
- **Challenge:** Complex charts on small screens.
- **Solution:**
    - "Card Stack" layout for mobile.
    - Simplified "Sparkline" versions of charts for phones.
    - Horizontal scroll for wide tables, but preferred "Card View" for rows.

## 📋 Task Breakdown (Squad Assignment)

### Phase 1: Foundation & Data (Enforcer)
- [ ] **Audit:** Verify `clientRate` and `hourlyRate` data availability.
- [ ] **Fix:** If data missing, fallback to defaults or flag user.
- [ ] **Security:** Verify `getBossDashboard` RPC calculates financials securely.

### Phase 2: The "Wow" UI (Desktop-Dev)
- [ ] **Layout:** Rebuild `dashboard.tsx` using CSS Grid (Bento).
- [ ] **Components:** Upgrade `executive-analytics.tsx` with Recharts + Framer Motion.
- [ ] **Styling:** Apply "Premium" theme (Gradients, Lucide Icons, clean typography).

### Phase 3: Mobile Polish (Mobile-Dev)
- [ ] **Verify:** Check Executive Dashboard on 375px width.
- [ ] **Adapt:** distinct touch-friendly view for mobile Bosses.

## 🧪 Verification Plan
- **Manual:** User checks "Rentability" numbers against real invoices.
- **Visual:** "Wow" factor check.
- **Mobile:** No horizontal scroll on charts (ResponsiveContainers).
