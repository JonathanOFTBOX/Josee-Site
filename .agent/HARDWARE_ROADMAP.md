# Hardware Integration Roadmap

## Purchased Equipment (Jan 15, 2026)

### 1. Brother QL-820NWBc - Label Printer
- **Price:** $234 CAD
- **Connection:** Wi-Fi (preferred), Bluetooth, USB, Ethernet
- **Features:** 
  - AirPrint for iPhone
  - Network printing for Android
  - 110 labels/minute
  - Supports 29mm+ label width

### 2. Eyoyo Bluetooth Scanner
- **Price:** $56 CAD
- **Type:** QR + Barcode (1D/2D)
- **Connection:** Bluetooth to phone
- **Battery:** 2500mAh rechargeable

---

## Integration Plan

### Printing (Brother QL-820NWBc)
- [ ] Connect printer to Wi-Fi
- [ ] iPhone: AirPrint (native iOS)
- [ ] Android: Network print via IP
- [ ] Re-add print button to BufferZoneModal

### Input Methods (Client Flexibility)
All methods available - client chooses:
| Method | Description |
|--------|-------------|
| 📷 Camera | Mobile camera QR scan (current) |
| 🔫 Scanner Gun | Eyoyo Bluetooth scanner (faster) |
| ✍️ Manual | Type code directly (always works) |

### Scanner Gun Integration
- [ ] Add input mode toggle in ScannerPage
- [ ] Scanner acts as keyboard → auto-submit
- [ ] Works on iOS + Android

---

## Status
- **Printer:** Ordered, awaiting delivery
- **Scanner:** Ordered, awaiting delivery
- **App Version:** v1.0.7.13
