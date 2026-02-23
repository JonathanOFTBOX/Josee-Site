# Trial & Payment System - Implementation Plan

> **Assigned To:** @Enforcer (Marcus)
> **Priority:** 🔴 Critical
> **Date:** 2026-01-01
> **Status:** Ready for Execution

---

## Problem Summary

The 14-day trial system is not working properly. Business requirements:

1. **14-Day Trial:** Strict enforcement
2. **10-Day Email:** At Day 10, send reminder to boss about trial ending
3. **Promo Offer:** First month at 50% off
4. **Normal Pricing:** After first month, full price

---

## Phase 1: Trial Tracking Fix

### Current State Analysis

**Check Database Schema:**
- Does `companies` table have `trial_ends_at` column?
- Does `companies` table have `subscription_status` column?
- What values exist: `'trial' | 'active' | 'expired' | 'cancelled'`?

**Check Frontend:**
- Where is trial check happening? (`App.tsx`? Route guards?)
- What happens when trial expires?

### Required Schema

```sql
-- Ensure companies table has these columns
ALTER TABLE companies ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Constraint on status
ALTER TABLE companies ADD CONSTRAINT companies_subscription_status_check 
  CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled', 'expired'));
```

### Frontend Enforcement

```typescript
// In App.tsx or ProtectedRoute
const isTrialExpired = (company: Company) => {
    if (company.subscription_status === 'active') return false;
    if (!company.trial_ends_at) return true;
    return new Date() > new Date(company.trial_ends_at);
};

// Show paywall if expired
if (isTrialExpired(company) && company.subscription_status !== 'active') {
    return <TrialExpiredPage />;
}
```

---

## Phase 2: 10-Day Email Reminder

### Edge Function: `trial-reminder`

**Trigger:** Supabase Cron Job (daily at 9 AM)

**Logic:**
1. Query companies where `trial_ends_at - NOW() = 4 days`
2. For each, get boss email from `profiles` (where `role = 'boss'`)
3. Send email via Resend/SendGrid

**Edge Function Code:**

```typescript
// supabase/functions/trial-reminder/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

serve(async (req) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Find companies 4 days from trial end
    const { data: companies, error } = await supabase
        .from("companies")
        .select(`
            id, name, trial_ends_at,
            profiles!profiles_company_id_fkey (email, name, role)
        `)
        .eq("subscription_status", "trial")
        .gte("trial_ends_at", new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString())
        .lte("trial_ends_at", new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString());
    
    if (error) return new Response(JSON.stringify({ error }), { status: 500 });
    
    for (const company of companies || []) {
        const boss = company.profiles?.find((p: any) => p.role === "boss");
        if (!boss?.email) continue;
        
        // Send email via Resend
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Fieldbox <no-reply@fieldbox.app>",
                to: boss.email,
                subject: "Your Fieldbox trial ends in 4 days!",
                html: `
                    <h1>Hi ${boss.name?.split(" ")[0] || "there"}!</h1>
                    <p>Your 14-day Fieldbox trial ends in <strong>4 days</strong>.</p>
                    <p>If you've enjoyed using Fieldbox, subscribe now and get:</p>
                    <ul>
                        <li>✅ <strong>50% OFF your first month</strong></li>
                        <li>✅ Unlimited jobs and workers</li>
                        <li>✅ GPS tracking and photo proof</li>
                        <li>✅ Executive dashboards</li>
                    </ul>
                    <p><a href="https://fieldbox.app/subscribe">Subscribe Now →</a></p>
                    <p>Questions? Reply to this email!</p>
                `,
            }),
        });
    }
    
    return new Response(JSON.stringify({ sent: companies?.length || 0 }));
});
```

**Cron Setup (Supabase Dashboard):**
```sql
SELECT cron.schedule(
    'trial-reminder-daily',
    '0 9 * * *', -- 9 AM daily
    $$SELECT net.http_post('https://YOUR_PROJECT.supabase.co/functions/v1/trial-reminder')$$
);
```

---

## Phase 3: Stripe Subscription

### Stripe Setup

**Products to Create:**
| Product | Price ID | Amount |
|---------|----------|--------|
| Fieldbox Monthly | `price_monthly` | $29/month |
| Fieldbox Monthly (Promo) | `price_promo` | $14.50/month (first month only) |

### Checkout Flow

1. **Boss clicks "Subscribe"** → Call Edge Function
2. **Edge Function creates Stripe Checkout Session** with:
   - First item: Promo price ($14.50)
   - Subscription: After first payment, switch to normal price
3. **Redirect to Stripe Checkout**
4. **Webhook:** On `checkout.session.completed`, update `companies`:
   - `subscription_status = 'active'`
   - `stripe_customer_id = ...`
   - `stripe_subscription_id = ...`

### Edge Function: `create-checkout`

```typescript
// supabase/functions/create-checkout/index.ts
import Stripe from "https://esm.sh/stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
});

serve(async (req) => {
    const { companyId, returnUrl } = await req.json();
    
    // Get company info
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: company } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", companyId)
        .single();
    
    if (!company) return new Response("Company not found", { status: 404 });
    
    // Create Stripe checkout with promo
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{
            price: Deno.env.get("STRIPE_PRICE_ID")!, // Normal price
            quantity: 1,
        }],
        discounts: [{
            coupon: Deno.env.get("STRIPE_PROMO_COUPON_ID")!, // 50% off first month
        }],
        success_url: `${returnUrl}?success=true`,
        cancel_url: `${returnUrl}?cancelled=true`,
        metadata: {
            company_id: companyId,
        },
    });
    
    return new Response(JSON.stringify({ url: session.url }));
});
```

### Webhook: `stripe-webhook`

```typescript
// supabase/functions/stripe-webhook/index.ts
serve(async (req) => {
    const sig = req.headers.get("stripe-signature")!;
    const body = await req.text();
    
    const event = stripe.webhooks.constructEvent(
        body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
    
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const companyId = session.metadata?.company_id;
        
        await supabase
            .from("companies")
            .update({
                subscription_status: "active",
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
            })
            .eq("id", companyId);
    }
    
    if (event.type === "invoice.payment_failed") {
        // Mark as past_due
    }
    
    if (event.type === "customer.subscription.deleted") {
        // Mark as cancelled
    }
    
    return new Response("OK");
});
```

---

## Phase 4: Subscription UI

### Boss Dashboard Component

```tsx
// client/src/components/subscription-status.tsx
export function SubscriptionStatus({ company }: { company: Company }) {
    const daysLeft = company.trial_ends_at 
        ? Math.ceil((new Date(company.trial_ends_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        : 0;
    
    if (company.subscription_status === 'active') {
        return (
            <Badge variant="success">Pro Subscriber</Badge>
        );
    }
    
    if (company.subscription_status === 'trial') {
        return (
            <div className="flex items-center gap-2">
                <Badge variant="warning">{daysLeft} days left</Badge>
                <Button size="sm" onClick={handleSubscribe}>
                    Subscribe (50% off!)
                </Button>
            </div>
        );
    }
    
    return <Badge variant="destructive">Trial Expired</Badge>;
}
```

---

## Verification Plan

### Phase 1 Verification
- [ ] `trial_ends_at` column exists in `companies`
- [ ] Trial check works on frontend
- [ ] Expired companies see paywall

### Phase 2 Verification
- [ ] Edge function deployed
- [ ] Cron job scheduled
- [ ] Test email sends correctly

### Phase 3 Verification
- [ ] Stripe products created
- [ ] Checkout session works
- [ ] Webhook updates company status

### Phase 4 Verification
- [ ] UI shows correct status
- [ ] Subscribe button works
- [ ] Active subscribers don't see trial banner

---

## Files to Modify/Create

| File | Action |
|------|--------|
| `supabase/migrations/trial_columns.sql` | NEW - Add columns |
| `supabase/functions/trial-reminder/index.ts` | NEW - Email function |
| `supabase/functions/create-checkout/index.ts` | NEW - Stripe checkout |
| `supabase/functions/stripe-webhook/index.ts` | NEW - Webhook handler |
| `client/src/components/subscription-status.tsx` | NEW - UI component |
| `client/src/pages/trial-expired.tsx` | NEW - Paywall page |
| `client/src/App.tsx` | MODIFY - Add trial check |

---

## Environment Variables Needed

```bash
# Supabase Edge Functions
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_PROMO_COUPON_ID=...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```

---

## Model Recommendation

**Claude Opus 4.5** - This involves:
- Security-critical payment integration
- Edge Function development
- Database schema changes
- Webhook handling

---

## Execution Log

> Marcus: Update this section as you work.

| Time | Action | Result |
|------|--------|--------|
| | | |
