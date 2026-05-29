# Discipline Dashboard — RPG-Based Career & Discipline Tracking System

A personal full-stack dashboard built to track daily discipline, career growth, XP progression, and strategic long-term goals.

## Portfolio Documentation

This repository is structured not only as a working application, but also as a portfolio-ready engineering case study.

- [CASE_STUDY.md](./CASE_STUDY.md) - full engineering case study
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - interview demo script
- [DATABASE_PLAN.md](./DATABASE_PLAN.md) - database planning document
- [supabase/schema.sql](./supabase/schema.sql) - initial database schema
- [supabase/rls_policies.sql](./supabase/rls_policies.sql) - Row Level Security policies

## Engineering Case Study

A full engineering case study is available in [CASE_STUDY.md](./CASE_STUDY.md), covering the product problem, architecture, database design, security model, gamification logic, analytics layer, and future roadmap.

## Why This Project Exists

Discipline Dashboard is designed as both a personal operating system and a professional portfolio project.

- Personal discipline system for tracking consistency over a 180-day campaign
- Career transition support into Data Analytics / BI
- Full-stack portfolio project for corporate interviews

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security
- Vercel-ready frontend
- Supabase free-tier backend/database

## Core Features

- Email/password authentication
- User profile system
- 180-Day Discipline Grid
- Daily Complete Today check-in
- XP rewards
- RPG level system
- Dynamic level titles
- Strategic Tasks Manager
- Task completion with XP rewards
- XP event audit trail
- Recent XP Activity feed
- Analytics Summary cards
- User-specific Row Level Security

## Database Tables

The planned Supabase PostgreSQL schema uses these core tables:

- `profiles`
- `daily_checkins`
- `xp_events`
- `strategic_tasks`

## XP Logic

- Daily check-in = `100 XP`
- Strategic task XP reward is configurable
- Level formula:

```text
Level = floor(total_xp / 1000) + 1
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
.env.local
```

Add Supabase environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Environment Variables

Required local environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Deployment Plan

- Frontend: Vercel
- Database/Auth: Supabase
- Optional future backend: Render.com

## Future Roadmap

- Task edit/delete/archive
- Better charts
- Monthly analytics
- Power BI export or reporting layer
- Public portfolio case study page
