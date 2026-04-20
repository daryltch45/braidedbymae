# /new-component — Create a New Component

Create a new component following the project conventions.

## Input
- **name**: Component name (PascalCase)
- **type**: `ui` | `sections` | `booking` | `admin` | `layout`
- **client**: Whether it needs `"use client"` (default: no)

## Steps

1. Create the file at `src/components/{type}/{Name}.tsx`
2. If the component displays text, use `useTranslations()` from `next-intl`
3. If it needs interactivity (state, effects, event handlers), add `"use client"` at top
4. Use Tailwind for styling
5. Support dark mode (use `dark:` variants)
6. Add proper TypeScript props interface
7. Make it responsive (mobile-first)

## Template (Server Component)
```tsx
import { useTranslations } from 'next-intl';

interface {Name}Props {
  // props
}

export function {Name}({ }: {Name}Props) {
  const t = useTranslations('{name}');

  return (
    <section className="...">
      {/* content */}
    </section>
  );
}
```

## Template (Client Component)
```tsx
"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface {Name}Props {
  // props
}

export function {Name}({ }: {Name}Props) {
  const t = useTranslations('{name}');

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* content */}
    </motion.section>
  );
}
```

## Checklist
- [ ] No hardcoded strings (use next-intl)
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Accessible (semantic HTML, aria labels if needed)
- [ ] Animation respects `prefers-reduced-motion`
