# Schedule

Personal schedule manager for single-user daily planning.

## Current Stack

- Next.js
- TypeScript
- Tailwind CSS
- local SQLite via `better-sqlite3`

## Current Features

- Monthly calendar overview
- Today view
- Event create, edit, delete
- Notes on events
- Local SQLite persistence
- Click a calendar day to select it
- Event form defaults to the selected day
- Selected-day event filtering

## Local Database

- SQLite file path: `data/schedule.sqlite`
- Extra SQLite files may also appear:
  - `data/schedule.sqlite-wal`
  - `data/schedule.sqlite-shm`

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Validation

```bash
npm run lint
npx next build --webpack
```

Note:
The default `next build` may fail in restricted environments because Turbopack can require capabilities that are blocked by sandboxing.

## Important Docs

- `docs/product-plan.md`
- `docs/tasks.md`
- `docs/handoff.md`

## Continue On Another Computer

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev`
4. Read these docs first:
   - `docs/product-plan.md`
   - `docs/tasks.md`
   - `docs/handoff.md`

## Suggested Codex Prompt

```text
docs/product-plan.md, docs/tasks.md, docs/handoff.md 읽고 현재 상태 파악한 뒤 이어서 작업해줘.
```

## Current Next Step

- Add previous/next month navigation
- Improve save/delete feedback
- Refine selected-day workflow
