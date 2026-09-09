# Discipline Dashboard

A bilingual personal operating system for tracking daily execution, long-term goals, and measurable progress. The application combines a 180-day discipline grid, XP progression, strategic tasks, analytics, and reporting in a responsive installable PWA.

## Product capabilities

- Email-and-password authentication with protected dashboard routes.
- Daily check-ins, streak-oriented execution tracking, XP events, and RPG-style levels.
- Strategic task planning with categories, priorities, deadlines, and completion history.
- Weekly and monthly analytics, source-level XP reporting, and recent activity views.
- CSV export designed for spreadsheet analysis and Power BI workflows.
- Azerbaijani and English interface support.

## Architecture

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, and Recharts.
- **Backend and data:** Supabase Auth and PostgreSQL.
- **Authorization:** user-scoped tables protected by PostgreSQL Row-Level Security policies.
- **Application model:** server-backed dashboard state with an XP ledger and auditable task activity.
- **Delivery:** installable PWA assets and Vercel-oriented deployment configuration.

## Documentation

- [Engineering case study](./CASE_STUDY.md)
- [Database plan](./DATABASE_PLAN.md)
- [SQL schema](./supabase/schema.sql)
- [Row-Level Security policies](./supabase/rls_policies.sql)
- [Interview demo script](./DEMO_SCRIPT.md)

## Local development

Create `.env.local` from the included example and provide your Supabase project values:

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment status

The repository's previously configured public deployment currently returns `404`. Restore or replace the deployment before publishing a live-demo link.
