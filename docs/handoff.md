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
- Calendar day selection now updates the active date
- Event form defaults to the selected calendar day
- Selected-day event list filters records by the chosen date
- Saved event list supports edit/delete from the selected day view
- Month navigation now supports previous/next month browsing
- Today jump returns the calendar to the current month and day
- Calendar grid now renders a full 6-week layout

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

1. Improve feedback after save/delete
2. Add selected-day summary or mini agenda in the calendar area
3. Add stronger validation polish for all-day behavior
4. Normalize date handling more explicitly before recurrence work
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

`Read docs/product-plan.md, docs/tasks.md, and docs/handoff.md, understand the current schedule app state, and continue with save/delete feedback plus selected-day UX improvements.`
