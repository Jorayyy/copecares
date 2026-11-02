# CopeCares Veterinary Clinic

Clinic management system for appointments, pets, medical records, and point of sale.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + Tailwind CSS v4
- Auth.js (NextAuth v5) with credentials
- Prisma ORM with SQLite

## Getting started

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Set `AUTH_SECRET` in `.env` to a random value (for example `openssl rand -base64 32`).

Open http://localhost:3000.

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the development server             |
| `npm run build`    | Create a production build                |
| `npm run start`    | Start the production server              |
| `npm run lint`     | Run ESLint                               |
| `npm run db:push`  | Sync the Prisma schema to SQLite         |
| `npm run db:seed`  | Seed roles, users, services, and products |
| `npm run db:reset` | Reset the database and reseed            |
| `npm run db:studio`| Open Prisma Studio                       |

## Demo accounts

| Role          | Email                  | Password   |
| ------------- | ---------------------- | ---------- |
| Administrator | admin@copecares.com    | `admin123` |
| Veterinarian  | vet@copecares.com      | `vet123`   |
| Staff         | staff@copecares.com    | `staff123` |
| Pet owner     | owner@test.com         | `owner123` |

## Structure

- `app/` — routes: public pages, `(auth)`, `admin`, `pet-owner`, API handlers
- `auth.ts` — Auth.js configuration
- `proxy.ts` — route protection and role redirects
- `lib/` — Prisma client, auth route helpers, utilities
- `prisma/` — schema and seed data
- `components/ui/` — shared UI primitives
