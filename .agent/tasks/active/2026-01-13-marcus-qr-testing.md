# Marcus (Enforcer) - Session Task

> **Current Session:** 2026-01-13 15:41 EST
> **Task:** V1.0.2.9 QR/Sticker Testing & Supabase Realtime

---

## Step 0: Initialization
- [x] Create task.md (this file)
- [x] Read before-starting.md (Marcus section)
- [x] Read handoff-2026-01-13.md
- [x] Read BufferZoneModal.tsx (verify implementation) ✅
- [x] Read QRCodeList.tsx (verify implementation) ✅
- [ ] Review ScannerModal.tsx (verify implementation)

---

## Code Review Findings ✅

### BufferZoneModal.tsx (471 lines)
| Feature | Status | Lines |
|---------|--------|-------|
| Sticker size state | ✅ | 71 |
| Size selector dropdown | ✅ | 323-332 |
| 4-way code in label | ✅ | 206-218 |
| Size configurations | ✅ | 197-201 |
| QRCodeSVG display | ✅ | 451 |

### QRCodeList.tsx (564 lines)
| Feature | Status | Lines |
|---------|--------|-------|
| Sticker size state | ✅ | 66 |
| Size selector dropdown | ✅ | 364-373 |
| 4-way code in label | ✅ | 190-207 |
| Size configurations | ✅ | 182-186 |
| QR error level H | ✅ | 317 |

---

## Testing Checklist (From Handoff)

### Print Testing:
- [x] BufferZoneModal: Print with **Small** size (40x30mm) → ✅ 4-way code visible
- [x] BufferZoneModal: Print with **Medium** size (60x50mm) → ✅ 4-way code visible
- [x] BufferZoneModal: Print with **Large** size (4x6") → ✅ 4-way code visible + SKU
- [ ] QRCodeList (from product row): Test all 3 sizes

### Scanner Testing:
- [ ] Scan bent/damaged QR codes → should be more tolerant
- [ ] Scan invalid location code → should reject with error
- [ ] Scan valid location → should show human name (e.g., "A-01")
- [ ] Place unit → verify breakdown updates immediately

### Display Testing:
- [ ] BufferZoneModal QR codes display correctly (not pixelated)
- [ ] Location names show correctly in product breakdown

---

## Code Review (Marcus Audit)

### Security Review
- [ ] No secrets/API keys exposed
- [ ] RLS policies correct (if DB changes)
- [ ] Input validation present

### Performance Review
- [ ] No N+1 query patterns
- [ ] Efficient loops
- [ ] Proper memoization where needed

### Correctness Review
- [ ] Solutions match requirements
- [ ] Edge cases handled
- [ ] Mobile AND desktop tested

---

## Next Up: Supabase Realtime
- [ ] Enable publications in Supabase Dashboard for `inventory_units` table
- [ ] Add Supabase Realtime subscription in React
- [ ] Invalidate queries on realtime events

---

## Session End
- [ ] Version increment (if changes made)
- [ ] Update task file with session summary
- [ ] git add -A → git commit → git push

---

## Questions/Notes for CEO
> (Will add during session)

