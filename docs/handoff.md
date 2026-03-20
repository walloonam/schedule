# Project Handoff

## What This Project Is

- Personal schedule manager for single-user daily planning
- Stack: Next.js, TypeScript, Tailwind CSS, local SQLite
- Main app goal: month calendar + today view + event CRUD

## Current Status

- App scaffolded with Next.js App Router
- Product planning doc created
- Task tracking doc created
- Main dashboard UI replaced from starter template
- Local SQLite persistence added with `better-sqlite3`
- Event create, edit, delete flows working through server actions
- Month view shows saved event counts
- Today view shows today's saved events
- Saved event list shows upcoming records and edit/delete controls

## Important Files

- `docs/product-plan.md`: product direction and scope
- `docs/tasks.md`: current implementation checklist
- `src/app/page.tsx`: main schedule dashboard UI
- `src/app/actions.ts`: server actions for create/update/delete
- `src/lib/sqlite.ts`: local SQLite setup and event queries
- `data/schedule.sqlite`: local database file

## Local Database Notes

- Database is stored locally in `data/schedule.sqlite`
- Additional SQLite WAL files may appear:
  - `data/schedule.sqlite-wal`
  - `data/schedule.sqlite-shm`
- Current persistence uses `better-sqlite3` directly
- Prisma schema exists as a future direction, but runtime persistence currently uses direct SQLite helpers

## Validation Completed

- `npm run lint` passes
- `npx next build --webpack` passes

## Known Issues

- `next build` with default Turbopack fails in this environment because of sandbox/process restrictions
- Prisma migration flow is not currently reliable in this environment
- Prisma client is not the active persistence layer yet

## Recommended Next Steps

1. Make calendar day selection interactive
2. Prefill the form when clicking a specific day
3. Filter right-side event list by selected date
4. Add stronger form validation and success feedback
5. Add recurring events later after the base CRUD flow is stable

## How To Continue On Another Computer

1. Clone or copy this repository
2. Run `npm install`
3. Run `npm run dev`
4. Ask Codex to read:
   - `docs/product-plan.md`
   - `docs/tasks.md`
   - `docs/handoff.md`
5. Then continue with the next feature

## Suggested Prompt For Next Session

`Read docs/product-plan.md, docs/tasks.md, and docs/handoff.md, understand the current schedule app state, and continue with interactive calendar day selection and selected-day event filtering.`
