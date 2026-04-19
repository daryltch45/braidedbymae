# CLAUDE.md — BraidedByMae

## Project Overview

**BraidedByMae** is a professional website for an African hair braiding artist based in Nuremberg, Germany. The site serves as a portfolio, booking platform, and client review system. The target audience is women (and men) in the Nuremberg metropolitan area looking for African braiding services.

**Business context**: Solo entrepreneur, operates from home with optional travel (surcharge). Available primarily on weekends but flexible. Covers Nuremberg, Fürth, Erlangen, and Bamberg.

---

## Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | **Next.js 14+ (App Router)** | SSR for SEO, App Router for layouts, Server Actions for forms |
| Language | **TypeScript** | Type safety, better DX with Claude Code |
| Styling | **Tailwind CSS v4** | Utility-first, fast iteration, dark mode built-in |
| Animation | **Framer Motion + Lenis** | Zoom parallax, scroll animations, smooth scrolling |
| Database | **PostgreSQL 16** | Containerized, no external dependency, full control |
| ORM | **Prisma** | Type-safe DB queries, migrations, schema-first |
| Email | **Resend** | Free tier (100 emails/day), React Email templates |
| Email (dev) | **Mailpit** | Local SMTP catch-all with web UI |
| i18n | **next-intl** | Best Next.js App Router i18n solution |
| Image hosting | **Cloudinary** | Free tier, image optimization, transformations |
| Containerization | **Docker + Compose** | Full stack in containers, portable, reproducible |
| Reverse Proxy | **Nginx** | SSL termination, gzip, rate limiting, security headers |
| Admin auth | **bcryptjs + JWT** | Simple, no external auth dependency |
| Hosting | **VPS (Hetzner/Contabo)** | Cheapest option for Docker Compose deployment |

---

## Architecture

```
┌─────────────── Docker Compose ──────────────────┐
│                                                  │
│  ┌──────────┐    ┌──────────────────────────┐   │
│  │  Nginx   │    │   Next.js App (Node 20)  │   │
│  │  :80/443 ├───►│   :3000                  │   │
│  │  - SSL   │    │  ┌──────┐ ┌───────────┐  │   │
│  │  - gzip  │    │  │Public│ │  Admin     │  │   │
│  │  - rate  │    │  │Pages │ │  Dashboard │  │   │
│  │  limit   │    │  │(SSR) │ │  (Auth)    │  │   │
│  └──────────┘    │  └──────┘ └───────────┘  │   │
│                  │  ┌──────────────────────┐ │   │
│                  │  │ API Routes + Server  │ │   │
│                  │  │ Actions (Prisma)     │ │   │
│                  │  └──────────┬───────────┘ │   │
│                  └─────────────┼─────────────┘   │
│                                │                  │
│                  ┌─────────────▼─────────────┐   │
│                  │   PostgreSQL 16 (Alpine)   │   │
│                  │   :5432                    │   │
│                  │   Volume: pgdata           │   │
│                  └───────────────────────────┘   │
│                                                  │
│  ┌──────────────────┐  (dev only)               │
│  │  Mailpit          │                           │
│  │  SMTP :1025       │                           │
│  │  Web UI :8025     │                           │
│  └──────────────────┘                            │
│  ┌──────────────────┐  (dev only)               │
│  │  Prisma Studio    │                           │
│  │  :5555            │                           │
│  └──────────────────┘                            │
└──────────────────────────────────────────────────┘
           │                        │
  ┌────────▼────────┐     ┌────────▼────────┐
  │   Cloudinary    │     │     Resend      │
  │   (Images CDN)  │     │   (Prod Email)  │
  └─────────────────┘     └─────────────────┘
```

---

## Core Features

### Public Pages
1. **Hero** — Zoom parallax with braiding photos, brand name, CTA
2. **Services** — Grid of services with price ranges (40–120€), descriptions
3. **Portfolio/Gallery** — Masonry grid of work photos, filterable by style
4. **Booking** — Multi-step form (service → date/time → contact info → photo upload → confirmation)
5. **Reviews** — Star rating display, moderated testimonials
6. **About** — Story, coverage area map, travel surcharge info
7. **Contact** — Links to TikTok, Instagram, direct contact

### Admin Dashboard (`/admin`)
1. **Booking management** — View, confirm, reject bookings with email notifications
2. **Calendar** — Visual calendar with blocked days management
3. **Review moderation** — Approve/reject submitted reviews
4. **Portfolio management** — Upload/delete/reorder gallery photos
5. **Service management** — Edit services, prices, descriptions

### Booking Flow
```
Client selects service
  → Picks date (blocked days hidden)
  → Picks time slot
  → Fills contact form (name, phone optional, inspiration photo)
  → Selects payment method preference (online/cash)
  → Submits
  → Receives "pending" email
  → Mae confirms/rejects in admin
  → Client receives confirmation/rejection email
```

---

## i18n Strategy

- **Languages**: French (default), English, German
- **URL structure**: `/fr/...`, `/en/...`, `/de/...`
- **Implementation**: `next-intl` with JSON message files
- **Content**: All UI text translated, service descriptions translated
- **Detection**: Browser language → redirect to closest match

---

## Design System

### Aesthetic Direction
**Vibrant Afro-Luxe**: Bold, warm, celebratory. NOT the typical muted "clean" aesthetic. Think rich golds, deep magentas, warm terracottas against dark backgrounds. The design should feel like stepping into a vibrant, confident space.

### Color Palette

**Light Mode:**
- Background: `#FFF8F0` (warm cream)
- Surface: `#FFFFFF`
- Primary: `#E85D04` (burnt orange)
- Secondary: `#9B2226` (deep crimson)
- Accent: `#FFB703` (golden yellow)
- Text: `#1A1A1A`
- Text Muted: `#6B6B6B`

**Dark Mode:**
- Background: `#0A0A0A`
- Surface: `#1A1A1A`
- Primary: `#FF8C42` (bright orange)
- Secondary: `#E85D75` (rose)
- Accent: `#FFD166` (gold)
- Text: `#F5F5F5`
- Text Muted: `#A0A0A0`

### Typography
- **Display/Headings**: Bold serif or display font (e.g., `Playfair Display`, `Cormorant Garamond`, or something more distinctive)
- **Body**: Clean sans-serif (e.g., `DM Sans`, `Outfit`)
- **Accent**: Handwritten or decorative for section labels

### Animations
- Zoom parallax hero (Framer Motion + Lenis scroll)
- Staggered reveals on scroll for gallery items
- Smooth page transitions
- Hover effects on service cards and gallery items
- Magnetic cursor on CTAs (optional)

---

## Database Schema (Prisma)

```prisma
model Service {
  id          String    @id @default(cuid())
  slug        String    @unique
  nameFr      String
  nameEn      String
  nameDe      String
  descFr      String
  descEn      String
  descDe      String
  priceMin    Int
  priceMax    Int
  durationMin Int       // minutes
  durationMax Int       // minutes
  imageUrl    String?
  order       Int       @default(0)
  active      Boolean   @default(true)
  bookings    Booking[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Booking {
  id              String        @id @default(cuid())
  serviceId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  clientName      String
  clientPhone     String?
  clientEmail     String
  inspirationUrl  String?       // Cloudinary URL
  preferredDate   DateTime
  preferredTime   String
  location        String        @default("HOME") // HOME | TRAVEL
  travelCity      String?
  paymentMethod   String        @default("CASH") // CASH | ONLINE
  status          BookingStatus @default(PENDING)
  adminNotes      String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  REJECTED
  CANCELLED
  COMPLETED
}

model Review {
  id         String       @id @default(cuid())
  clientName String
  rating     Int          // 1-5
  comment    String
  serviceName String?
  status     ReviewStatus @default(PENDING)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

model BlockedDay {
  id     String   @id @default(cuid())
  date   DateTime
  reason String?
}

model PortfolioImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  category  String   // box-braids, cornrows, twists, locs, crochet, men
  order     Int      @default(0)
  createdAt DateTime @default(now())
}
```

---

## Project Structure

```
braidedbymae/
├── CLAUDE.md                    # This file
├── Dockerfile                   # Production multi-stage build
├── Dockerfile.dev               # Development with hot reload
├── docker-compose.dev.yml       # Dev stack (app + db + mailpit + studio)
├── docker-compose.prod.yml      # Prod stack (app + db + nginx)
├── Makefile                     # All commands in one place
├── .dockerignore
├── .claude/
│   └── commands/
│       ├── setup.md             # Initial project setup
│       ├── new-component.md     # Create new component
│       ├── add-translation.md   # Add i18n keys
│       └── deploy.md            # Deployment checklist
├── nginx/
│   └── nginx.conf               # Reverse proxy config
├── scripts/
│   └── backup/
│       └── backup.sh            # DB backup script
├── prisma/
│   └── schema.prisma
├── public/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── booking/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx   # Auth guard
│   │   │       ├── page.tsx     # Dashboard
│   │   │       ├── bookings/
│   │   │       ├── reviews/
│   │   │       ├── portfolio/
│   │   │       └── calendar/
│   │   ├── api/
│   │   │   ├── bookings/
│   │   │   ├── reviews/
│   │   │   ├── auth/
│   │   │   └── upload/
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # Reusable primitives
│   │   ├── sections/            # Page sections (Hero, Gallery, etc.)
│   │   ├── booking/             # Booking flow components
│   │   ├── admin/               # Admin components
│   │   └── layout/              # Header, Footer, Nav
│   ├── lib/
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── cloudinary.ts        # Cloudinary config
│   │   ├── email.ts             # Resend / Mailpit config
│   │   ├── auth.ts              # Admin auth (bcrypt + JWT)
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useScrollParallax.ts
│   │   └── useSmoothScroll.ts
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   └── messages/
│       ├── fr.json
│       ├── en.json
│       └── de.json
├── emails/                      # React Email templates
│   ├── booking-pending.tsx
│   ├── booking-confirmed.tsx
│   └── booking-rejected.tsx
├── .env.local                   # Dev env (git-ignored)
├── .env.example
├── .env.production.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

```env
# --- PostgreSQL (docker-compose sets DATABASE_URL automatically) ---
POSTGRES_USER=braidedbymae
POSTGRES_PASSWORD=braidedbymae_dev
POSTGRES_DB=braidedbymae

# --- Cloudinary ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# --- Resend (Email) ---
RESEND_API_KEY=

# --- App ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

---

## Docker Setup

### Development
```bash
make dev-build          # First time: build + start all containers
make dev                # Subsequent: start without rebuild
make dev-down           # Stop everything
make dev-logs           # Tail app logs
make db-studio          # Prisma Studio on http://localhost:5555
make db-shell           # psql shell into PostgreSQL
make db-migrate         # Run Prisma migrations
```

**Dev services:**
| Service | URL | Purpose |
|---------|-----|---------|
| App | `http://localhost:3000` | Next.js with hot reload |
| Mailpit | `http://localhost:8025` | Catch all emails, web UI |
| Prisma Studio | `http://localhost:5555` | Visual database editor |
| PostgreSQL | `localhost:5433` | Direct DB access (port 5433 to avoid conflicts) |

### Production
```bash
make prod-build         # Build + deploy
make prod               # Start without rebuild
make prod-down          # Stop
make prod-logs          # Tail logs
make db-backup          # Backup database
```

### Key Docker Conventions
- Dev uses `Dockerfile.dev` with volume mounts for hot reload
- Prod uses multi-stage `Dockerfile` with standalone output (~100MB image)
- PostgreSQL data persists in a named volume `pgdata`
- Nginx handles SSL, gzip, rate limiting, and security headers
- Mailpit replaces Resend in dev (no real emails sent)

---

## Commands for Claude Code

### Development
```bash
make dev                 # Start all containers
make dev-build           # Rebuild + start
make dev-down            # Stop
make dev-logs            # Tail app logs
make db-shell            # psql into database
make db-migrate          # Run Prisma migrations
make db-reset            # Reset database (destroys data)
make clean               # Remove all containers + volumes
```

### Key Conventions
- **Components**: PascalCase, one component per file
- **Hooks**: camelCase, prefix with `use`
- **Utils**: camelCase
- **API routes**: kebab-case
- **Translations**: nested dot notation (`hero.title`, `booking.form.name`)
- **CSS**: Tailwind utilities, no custom CSS except for complex animations
- **Server Actions**: colocate with the page that uses them, or in `src/lib/actions/`

### Code Style
- Prefer Server Components by default
- Use `"use client"` only when needed (interactivity, hooks)
- Validate all forms with Zod
- Use React Hook Form for complex forms
- Handle errors with proper user feedback
- All text must go through i18n — NO hardcoded strings

---

## Implementation Phases

### Phase 1 — Foundation (Week 1-2)
- [ ] Project scaffolding (Next.js, Tailwind, TypeScript)
- [ ] Design system setup (colors, typography, CSS variables)
- [ ] Lenis smooth scroll + Framer Motion setup
- [ ] i18n configuration (next-intl)
- [ ] Basic layout (Header, Footer, Navigation)
- [ ] Hero section with zoom parallax
- [ ] Services section
- [ ] Responsive design

### Phase 2 — Portfolio & Content (Week 3)
- [ ] Portfolio gallery with masonry layout
- [ ] Category filtering (box braids, cornrows, etc.)
- [ ] Image optimization pipeline (Cloudinary)
- [ ] About section with coverage area
- [ ] Contact section with social links

### Phase 3 — Booking System (Week 4-5)
- [ ] PostgreSQL + Prisma setup (via Docker Compose)
- [ ] Booking form (multi-step)
- [ ] Date picker with blocked days
- [ ] Inspiration photo upload
- [ ] Email notifications (Resend + React Email)
- [ ] Booking confirmation flow

### Phase 4 — Reviews & Admin (Week 6-7)
- [ ] Review submission form
- [ ] Star rating component
- [ ] Admin authentication
- [ ] Admin dashboard layout
- [ ] Booking management (confirm/reject)
- [ ] Review moderation
- [ ] Calendar with blocked days
- [ ] Portfolio CRUD

### Phase 5 — Polish & Deploy (Week 8)
- [ ] SEO optimization (metadata, Open Graph)
- [ ] Performance optimization (images, lazy loading)
- [ ] Accessibility audit
- [ ] Error handling and edge cases
- [ ] Production Docker build test (`make prod-build`)
- [ ] VPS provisioning (Hetzner/Contabo)
- [ ] SSL setup (Let's Encrypt + Certbot)
- [ ] Domain configuration (DNS → VPS IP)
- [ ] DB backup cron job
- [ ] Final QA across all 3 languages

---

## Critical Reminders

1. **Every piece of user-facing text** must use `next-intl` — no exceptions
2. **Images** must be optimized via Cloudinary or Next/Image
3. **Forms** must have proper validation (Zod) and error states
4. **Admin routes** must be protected with authentication
5. **Emails** must be tested with Resend's test mode first
6. **Dark mode** must work on every component — test both modes
7. **Mobile-first** — design for mobile, then scale up
8. **Animations** should respect `prefers-reduced-motion`
