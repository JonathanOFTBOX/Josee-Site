# FieldBox Permissions & Settings Reference

This document tracks all existing permissions, roles, and settings in the system for easy reference when adding new features.

---

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| `boss` | Admin/Owner | Full access to all features |
| `worker` | Field Employee | Limited access based on permissions |

---

## Worker Permissions (Access Control)

These permissions are stored in `profiles.permissions` as JSON in Supabase.

| Permission Key | Display Name | Description |
|----------------|--------------|-------------|
| `canViewFinancials` | View Financials | Can see financial data (costs, prices, margins) |
| `canManageSchedule` | Manage Schedule | Can modify job schedules |
| `canManageWorkers` | Manage Workers | Can add/edit employees |
| `canManageClients` | Manage Clients | Can add/edit clients |
| `canViewCostsMargins` | View Costs & Margins | Can see cost/margin data on products |
| `canManageInventory` | Manage Inventory | Can access /boss/inventory route |

### Permission Check Example
```typescript
const permissions = user?.permissions ? JSON.parse(user.permissions) : {};
if (permissions.canManageInventory) {
    // Allow access
}
```

---

## Client Settings

| Field | Description | Type |
|-------|-------------|------|
| `laborDiscountPercent` | Labor Discount % (Escompte) | number (0-100) |
| `defaultHourlyRate` | Default Hourly Rate | number ($/hour) |

### Price Calculation with Client Discount
```
Retail Price × (1 - laborDiscountPercent / 100) = Final Client Price

Example: $100 × (1 - 25/100) = $75 (25% discount applied)
```

---

## Company Settings

| Setting | Description | Location |
|---------|-------------|----------|
| `requireQrPrinting` | Require QR Code Printing before completing reception | CompanySettings.tsx |

---

## Role-Based Feature Visibility

| Feature | Worker | Boss |
|---------|--------|------|
| See material prices | ❌ Hidden | ✅ Visible |
| Manage jobs | ❌ (view only) | ✅ Full CRUD |
| Access /boss/* routes | ❌ (unless has permission) | ✅ Always |
| Validate jobs | ❌ | ✅ |
| Manage trucks | ❌ | ✅ |
| See client escompte | ❌ | ✅ |

---

## Shortage Request Flow

1. Worker requests material via "Besoin d'un item manquant" button
2. Creates `job_material` with `quantity_used = 0`, `planned_quantity = N`
3. Appears in yellow styling (distinct from confirmed/pending)
4. Only appears in Pick List AFTER admin validates the job
5. Admin sees it in validation modal and can approve

---

## Files Reference

### Permissions UI
- `client/src/pages/boss/admin/components/AdminEmployeesSection.tsx` - Employee edit modal with permissions

### Client Settings UI  
- `client/src/pages/boss/admin/components/AdminClientsSection.tsx` - Client edit modal with escompte

### Company Settings UI
- `client/src/pages/boss/admin/CompanySettings.tsx` - QR tracking settings

### Permission Checks
- `client/src/App.tsx` - Route guards for permission-protected routes
- `client/src/pages/worker/active-session/components/SessionProgressPanel.tsx` - Role-based price visibility

---

## TODO (Future Permissions)

- [ ] `canApproveQuotes` - Quote approval workflow
- [ ] `canSetPrices` - Product price modification
- [ ] `canViewReports` - Financial reports access
- [ ] `canManageSuppliers` - Supplier management access
