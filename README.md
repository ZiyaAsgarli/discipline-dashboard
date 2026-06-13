# Discipline Dashboard — RPG-Based Career & Discipline Tracking System

A full-stack personal operating system for tracking daily discipline, strategic career goals, XP progression, and analytics-backed growth.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Portfolio Project](https://img.shields.io/badge/Portfolio_Project-22C55E?style=for-the-badge)

## Live Demo

Live Demo: [\[Add Vercel URL here\]](https://discipline-dashboard-iota.vercel.app/)

GitHub: [\[Add GitHub repository URL here\]](https://github.com/ZiyaAsgarli/discipline-dashboard)

## Quick Links

This repository is structured not only as a working application, but also as a portfolio-ready engineering case study.

- [Engineering Case Study](./CASE_STUDY.md)
- [Interview Demo Script](./DEMO_SCRIPT.md)
- [Database Plan](./DATABASE_PLAN.md)
- [SQL Schema](./supabase/schema.sql)
- [RLS Policies](./supabase/rls_policies.sql)

## Project Highlights

- Secure user-specific authentication
- 180-day discipline grid
- RPG XP and level system
- Strategic task management
- XP audit trail
- Analytics summary cards
- Free-tier deployment architecture

## v1.0 MVP Release Checklist

This release represents the first stable full-stack MVP version of the Discipline Dashboard.

- [x] Next.js frontend implemented
- [x] Supabase Auth configured
- [x] PostgreSQL schema created
- [x] Row Level Security policies added
- [x] User profile creation works
- [x] 180-Day Discipline Grid connected to real data
- [x] Daily check-in flow works
- [x] XP reward system works
- [x] RPG level progress works
- [x] Dynamic level titles work
- [x] Strategic Tasks Manager works
- [x] Task pause/resume/archive/delete works
- [x] Task completion rewards XP
- [x] XP event audit trail works
- [x] Recent XP Activity feed works
- [x] Analytics Summary cards work
- [x] GitHub repository created
- [x] Vercel deployment completed
- [x] Environment variables configured securely

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
- Mobile-first premium UX layout
- Today Execution Card
- Compact 180-day progress map
- Daily Complete Today check-in
- XP rewards
- RPG level system
- Dynamic level titles
- Strategic Tasks Manager
- Task completion with XP rewards
- XP event audit trail
- Recent XP Activity feed
- Analytics Summary cards
- Weekly XP Analytics
- XP by Source analytics
- Weekly Completion Analytics
- Monthly Analytics Overview
- BI-style analytics using Supabase-backed data
- User-specific Row Level Security

## Mobile-First UX Polish

The dashboard features a heavily optimized, premium mobile-first redesign that turns the web app into an effortless, app-like habit tracker. Key improvements include:

- A compact mobile header and database status pill to save vertical space.
- The **Today Execution Card**, which brings your level, XP, and main "Complete Today" action to the very top.
- A highly compact 180-day progress map that doesn't overwhelm small screens.
- A mobile-friendly Strategic Tasks Manager with wrap-friendly chip filters.
- Visually lighter, secondary analytics sections to prioritize action over data-scrolling.
- Improved visual hierarchy and reduced meaningless scrolling, resulting in a dark, satisfying RPG productivity app feel.

## Code Architecture

The frontend follows a container-presentational pattern. The `app/page.tsx` file acts as the main container responsible for:

- Supabase data fetching
- State management
- Auth handlers
- XP, check-in, and task handlers
- Analytics calculations

Reusable presentational UI is split into modular components inside the `components/` directory. Shared TypeScript interfaces are centralized in `components/types.ts`.

Important components include:

- `AuthPanel`
- `DashboardHeader`
- `StatCards`
- `DisciplineGrid`
- `RpgProgress`
- `StrategicTasksManager`
- `RecentXpActivity`
- `WeeklyXpAnalytics`
- `XpBySource`
- `WeeklyCompletionAnalytics`
- `MonthlyAnalyticsOverview`
- `AnalyticsSummary`

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
- Power BI export or reporting layer
- Public portfolio case study page
