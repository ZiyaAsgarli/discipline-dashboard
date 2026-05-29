# Database Plan

This document describes the planned Supabase PostgreSQL schema for the Discipline Dashboard. It is a planning document only. No Supabase connection, migrations, implementation code, or UI changes are included yet.

## Overview

The database will support a personal discipline and career tracking dashboard with four core data areas:

- User profile and account-level totals
- Daily 180-day discipline check-ins
- XP event history
- Strategic career and project tasks

Supabase Auth is expected to provide the authenticated user id later. Each application table should be scoped to that user id so a user can only access their own records.

## Tables

## profiles

Stores one profile row per user. This table holds display information and cached progress totals that can be used by the dashboard.

| Field | Data Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key. Matches the Supabase Auth user id. |
| email | text | User email address for display or account reference. |
| display_name | text | Optional user-facing name. |
| total_xp | integer | Cached total XP earned by the user. Defaults to 0. |
| current_level | integer | Cached current level. Defaults to 1. |
| discipline_start_date | date | First day of the 180-day discipline campaign. |
| created_at | timestamptz | Timestamp when the profile was created. |
| updated_at | timestamptz | Timestamp when the profile was last updated. |

## daily_checkins

Stores one row per user per calendar day in the discipline campaign. This table powers the 180-Day Discipline Grid.

| Field | Data Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key for the check-in record. |
| user_id | uuid | Foreign key to `profiles.id`. |
| checkin_date | date | Calendar date for the discipline day. |
| campaign_day | integer | Day number in the 180-day campaign, from 1 to 180. |
| completed | boolean | Whether the day was completed. |
| notes | text | Optional reflection or context for the day. |
| xp_awarded | integer | XP awarded for this daily check-in. Defaults to 0. |
| created_at | timestamptz | Timestamp when the check-in row was created. |
| updated_at | timestamptz | Timestamp when the check-in row was last updated. |

Suggested constraint: each user should have only one check-in per date, using a unique constraint on `(user_id, checkin_date)`.

## xp_events

Stores an append-only history of XP changes. This makes total XP auditable instead of only storing a single number.

| Field | Data Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key for the XP event. |
| user_id | uuid | Foreign key to `profiles.id`. |
| source_type | text | Type of event, such as `daily_checkin`, `strategic_task`, or `manual_adjustment`. |
| source_id | uuid | Optional id of the related record that generated the XP. |
| xp_amount | integer | Positive or negative XP amount for this event. |
| description | text | Human-readable reason for the XP event. |
| created_at | timestamptz | Timestamp when the XP event was created. |

`profiles.total_xp` can either be calculated from this table or cached from this table for faster dashboard loading.

## strategic_tasks

Stores career, skill, and project tasks for the Strategic Tasks Manager.

| Field | Data Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key for the task. |
| user_id | uuid | Foreign key to `profiles.id`. |
| title | text | Task title shown in the dashboard. |
| description | text | Optional details, acceptance criteria, or next steps. |
| priority | text | Priority label such as `High`, `Medium`, or `Low`. |
| status | text | Task state such as `active`, `completed`, `paused`, or `archived`. |
| xp_reward | integer | XP awarded when the task is completed. Defaults to 0. |
| due_date | date | Optional target date. |
| completed_at | timestamptz | Timestamp when the task was completed. Null while unfinished. |
| created_at | timestamptz | Timestamp when the task was created. |
| updated_at | timestamptz | Timestamp when the task was last updated. |

## Relationships

- `profiles` is the parent table for user-owned dashboard data.
- `daily_checkins.user_id` references `profiles.id`.
- `xp_events.user_id` references `profiles.id`.
- `strategic_tasks.user_id` references `profiles.id`.
- `xp_events.source_id` can optionally reference a row from `daily_checkins` or `strategic_tasks`, depending on `source_type`.

The intended data model is:

- One profile has many daily check-ins.
- One profile has many XP events.
- One profile has many strategic tasks.
- A completed daily check-in can create one XP event.
- A completed strategic task can create one XP event.

## XP And Level Logic

The level calculation is based on total XP:

```text
Level = floor(total_xp / 1000) + 1
```

Examples:

| Total XP | Level |
| --- | --- |
| 0 | 1 |
| 999 | 1 |
| 1000 | 2 |
| 2500 | 3 |

The dashboard can calculate level directly from `profiles.total_xp`, or it can calculate total XP by summing `xp_events.xp_amount` and then applying the level formula.

For consistency, the long-term plan should choose one source of truth:

- `xp_events` as the audit trail for every XP change.
- `profiles.total_xp` as a cached value for fast dashboard reads.
- `profiles.current_level` as an optional cached value derived from `total_xp`.

If cached values are used, they should be updated whenever a new XP event is created.

## 180-Day Discipline Grid

The 180-Day Discipline Grid will use `daily_checkins` as its source.

Each grid cell represents one `campaign_day` from 1 to 180. For the current user:

- If a `daily_checkins` row exists for a campaign day and `completed = true`, the cell is shown as completed.
- If a row exists and `completed = false`, the cell is shown as incomplete.
- If no row exists yet for a future campaign day, the cell can be shown as empty or pending.
- If no row exists for a past campaign day, the cell can be treated as missed or incomplete.

The grid can be ordered by `campaign_day` to render all 180 cells consistently.

## Strategic Tasks Manager

The Strategic Tasks Manager will use `strategic_tasks` as its source.

The dashboard can display active tasks by querying rows where:

```text
status = 'active'
```

Each task card can show:

- `title`
- `priority`
- `status`
- `due_date`
- `xp_reward`

When a task is completed later, the app can update `status` to `completed`, set `completed_at`, and create a related `xp_events` row with `source_type = 'strategic_task'`.

## Not Included Yet

This plan intentionally does not include:

- Supabase setup
- SQL migrations
- Row Level Security policies
- API routes
- Authentication implementation
- Backend logic
- UI changes
