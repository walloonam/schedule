import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type ScheduleEvent = {
  id: string;
  title: string;
  notes: string | null;
  startAt: string;
  endAt: string;
  allDay: number;
  createdAt: string;
  updatedAt: string;
};

type EventRow = {
  id: string;
  title: string;
  notes: string | null;
  start_at: string;
  end_at: string;
  all_day: number;
  created_at: string;
  updated_at: string;
};

const dataDir = path.join(process.cwd(), "data");
const databaseFile = path.join(dataDir, "schedule.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(databaseFile);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    notes TEXT,
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    all_day INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
`);

const mapEvent = (row: EventRow): ScheduleEvent => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  startAt: row.start_at,
  endAt: row.end_at,
  allDay: row.all_day,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export function getDatabaseFilePath() {
  return databaseFile;
}

export function listMonthEvents(monthStartIso: string, monthEndIso: string) {
  const rows = db
    .prepare(
      `
        SELECT id, title, notes, start_at, end_at, all_day, created_at, updated_at
        FROM events
        WHERE start_at >= ? AND start_at < ?
        ORDER BY start_at ASC
      `,
    )
    .all(monthStartIso, monthEndIso) as EventRow[];

  return rows.map(mapEvent);
}

export function listTodayEvents(dayStartIso: string, dayEndIso: string) {
  return listDayEvents(dayStartIso, dayEndIso);
}

export function listDayEvents(dayStartIso: string, dayEndIso: string) {
  const rows = db
    .prepare(
      `
        SELECT id, title, notes, start_at, end_at, all_day, created_at, updated_at
        FROM events
        WHERE start_at >= ? AND start_at < ?
        ORDER BY all_day DESC, start_at ASC
      `,
    )
    .all(dayStartIso, dayEndIso) as EventRow[];

  return rows.map(mapEvent);
}

export function listUpcomingEvents(limit = 8) {
  const rows = db
    .prepare(
      `
        SELECT id, title, notes, start_at, end_at, all_day, created_at, updated_at
        FROM events
        ORDER BY start_at ASC
        LIMIT ?
      `,
    )
    .all(limit) as EventRow[];

  return rows.map(mapEvent);
}

export function getEventById(id: string) {
  const row = db
    .prepare(
      `
        SELECT id, title, notes, start_at, end_at, all_day, created_at, updated_at
        FROM events
        WHERE id = ?
      `,
    )
    .get(id) as EventRow | undefined;

  return row ? mapEvent(row) : null;
}

export function saveEvent(input: {
  id?: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
}) {
  const now = new Date().toISOString();

  if (input.id) {
    db.prepare(
      `
        UPDATE events
        SET title = ?, notes = ?, start_at = ?, end_at = ?, all_day = ?, updated_at = ?
        WHERE id = ?
      `,
    ).run(
      input.title,
      input.notes?.trim() || null,
      input.startAt,
      input.endAt,
      input.allDay ? 1 : 0,
      now,
      input.id,
    );

    return input.id;
  }

  const id = crypto.randomUUID();

  db.prepare(
    `
      INSERT INTO events (id, title, notes, start_at, end_at, all_day, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    id,
    input.title,
    input.notes?.trim() || null,
    input.startAt,
    input.endAt,
    input.allDay ? 1 : 0,
    now,
    now,
  );

  return id;
}

export function deleteEvent(id: string) {
  db.prepare("DELETE FROM events WHERE id = ?").run(id);
}
