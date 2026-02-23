---
description: How to handle i18n translation for FR/EN support
---

# i18n Translation Skill

## Rule: All UI text must be translated

**Every string visible to the user must use the `t()` function from `useLanguage()`.**

## Files to update

1. **English**: `client/src/lib/translations/en.ts`
2. **French**: `client/src/lib/translations/fr.ts`

## How to translate

1. **Import the hook**:
```tsx
import { useLanguage } from "@/contexts/language-context";
```

2. **Use in component**:
```tsx
const { t } = useLanguage();
// Then use: {t('key.name')}
```

3. **Add keys to BOTH files**:
```typescript
// en.ts
'component.label': 'English text',

// fr.ts
'component.label': 'Texte français',
```

## Key naming convention

Use dot notation: `section.subsection.element`

Examples:
- `sidebar.inventory` - Sidebar menu item
- `trucks.searchPlaceholder` - Truck tab search placeholder
- `common.cancel` - Reusable button label
- `orders.deleted` - Order toast message

## Common patterns to look for

**Replace all hardcoded text:**
- `placeholder="Rechercher..."` → `placeholder={t('common.search')}`
- `title: "Erreur"` → `title: t('common.error')`
- `>Annuler</Button>` → `>{t('common.cancel')}</Button>`

## Checklist when adding new features

- [ ] No hardcoded French text
- [ ] No hardcoded English text
- [ ] Keys added to en.ts
- [ ] Keys added to fr.ts
- [ ] Build passes
