# Toggle Switch Pattern

Standard for binary toggle switches (on/off, all/filtered, etc.) using the same visual style as the language selector on the login page.

## Pattern
```tsx
<div className="inline-flex items-center bg-muted rounded-full p-1 gap-0.5">
    <button
        onClick={() => setValue(false)} // or first option
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
            !value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
        }`}
    >
        Option A
    </button>
    <button
        onClick={() => setValue(true)} // or second option
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
            value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
        }`}
    >
        Option B
    </button>
</div>
```

## Key Styling
- **Container**: `bg-muted rounded-full p-1 gap-0.5`
- **Active Button**: `bg-primary text-primary-foreground shadow-sm rounded-full`
- **Inactive Button**: `text-muted-foreground hover:text-foreground rounded-full`
- **Button Padding**: `px-3 py-1.5` (mobile-friendly tap targets)

## Usage
- Replace all checkboxes with this toggle pattern when it's a binary choice
- Use for filters (Tous/Filtered), modes (View A/View B), language (EN/FR)
- **Do NOT use checkboxes for on/off toggles** - always use this switch pattern

## Reference Components
- `LanguageToggle` in `client/src/components/language-toggle.tsx`
- `OrderingTab` "Tous/Bas stock" filter
