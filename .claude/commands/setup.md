# /setup — Initial Project Setup

Scaffold the BraidedByMae project from scratch. Follow these steps in order.

**Prerequisites**: Docker and Docker Compose must be installed.

## 1. Initialize Next.js
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## 2. Install Core Dependencies
```bash
# Animation & Scroll
npm install framer-motion lenis

# Database & ORM
npm install @prisma/client
npm install -D prisma

# i18n
npm install next-intl

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Email
npm install resend @react-email/components

# Image upload
npm install next-cloudinary

# UI utilities
npm install clsx tailwind-merge lucide-react

# Date handling
npm install date-fns

# Auth (admin panel)
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken

# Dark mode
npm install next-themes
```

## 3. Initialize Prisma
```bash
npx prisma init
```
Copy the schema from CLAUDE.md into `prisma/schema.prisma`.
Set the datasource provider to `postgresql`.

## 4. Configure next.config.ts for Docker
Add standalone output for production Docker builds:
```ts
const nextConfig = {
  output: 'standalone',
}
```

## 5. Setup Tailwind with Design System
Configure `tailwind.config.ts` with the color palette and typography from CLAUDE.md.

## 6. Setup i18n
Create the next-intl configuration files:
- `src/i18n/request.ts`
- `src/i18n/routing.ts`
- `src/middleware.ts` (locale detection + redirect)
- `src/messages/fr.json`, `en.json`, `de.json` with initial keys

## 7. Setup Base Layout
- Create `src/app/[locale]/layout.tsx` with font loading, theme provider
- Create `src/app/[locale]/page.tsx` as landing page shell
- Setup dark mode toggle with next-themes

## 8. Create .env.local
```env
POSTGRES_USER=braidedbymae
POSTGRES_PASSWORD=braidedbymae_dev
POSTGRES_DB=braidedbymae
DATABASE_URL=postgresql://braidedbymae:braidedbymae_dev@db:5432/braidedbymae
NEXT_PUBLIC_APP_URL=http://localhost:3000
SMTP_HOST=mailpit
SMTP_PORT=1025
```

## 9. Start with Docker
```bash
make dev-build
```

## 10. Verify
- App runs at http://localhost:3000
- i18n routing works (/fr, /en, /de)
- Mailpit catches emails at http://localhost:8025
- Prisma Studio at http://localhost:5555
- Dark mode toggles correctly

## If running without Docker (Claude Code local dev)
```bash
DATABASE_URL=postgresql://braidedbymae:braidedbymae_dev@localhost:5433/braidedbymae npm run dev
```