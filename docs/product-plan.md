# Personal Schedule Manager Product Plan

## 1. Product Overview

- Product name: Personal Schedule Manager
- Goal: Build a lightweight personal scheduling app for fast daily planning and review.
- Primary user: Single personal user
- Main value: See monthly schedule at a glance, review today's items quickly, and manage events without friction.

## 2. Requested Features

### Must Have

- Monthly calendar view
- Today view
- Event create, edit, delete

### Nice to Have

- Recurring events
- Notification/reminder support
- Tag classification

### Additional Requested Features

- Todo checkbox support
- Notes on events

## 3. Product Principles

- Optimize for personal speed over complex collaboration features.
- Make the Today view the main working surface.
- Keep event creation lightweight with a simple default form.
- Use progressive disclosure for advanced options like recurrence, tags, and reminders.
- Start narrow with a stable MVP, then add productivity features in phases.

## 4. MVP Scope

### In Scope

- Month grid calendar view
- Date selection from the calendar
- Today view listing current-day items
- Event CRUD
- Basic event fields:
  - title
  - start date/time
  - end date/time
  - all-day toggle
  - notes
- Basic validation and empty states

### Out of Scope for MVP

- Recurring rules
- Notifications/reminders
- Tags
- Advanced search/filter

## 5. Planned Feature Phases

### Phase 1: MVP

- Monthly calendar
- Today view
- Event CRUD
- Notes on events
- All-day support

### Phase 2: Productivity

- Recurring events
- Todo checkbox behavior
- Notifications/reminders
- Search/filter overlay

### Phase 3: Organization

- Tags
- Richer views such as agenda/week
- Recurring event exceptions/overrides

## 6. Core User Flows

### Plan a Day

1. Open month calendar
2. Select a date
3. Add a new event
4. Save and confirm it appears on the calendar
5. Review it again in Today view when the date is current

### Manage an Event

1. Open an event from calendar or Today view
2. Edit fields or delete the event
3. See updates reflected immediately across views

### Check Today's Schedule

1. Open Today view
2. Review all items scheduled for the current day
3. Jump into event detail or create a new item quickly

## 7. Core Screens

### Monthly Calendar

- Month navigation
- Today shortcut
- Day cells with event indicators
- Selected date state
- Quick add entry point

### Today View

- Vertical agenda of today's items
- Time-ordered events
- All-day section
- Empty state with add action

### Event Editor

- Create/edit form
- Title
- Start/end date and time
- All-day toggle
- Notes
- Save/delete actions

### Future Screens

- Search/filter overlay
- Expanded recurrence editor
- Tag management

## 8. Key UI Components

- Top bar with month navigation and add action
- Calendar grid
- Agenda list
- Quick add sheet or modal
- Event form
- Empty state blocks

### Phase 2 Components

- Checkbox row for todo completion
- Recurrence summary
- Reminder controls
- Tag chips

## 9. Initial Data Model Direction

### Event

- `id`
- `title`
- `notes`
- `startAt`
- `endAt`
- `allDay`
- `kind` (`EVENT` or `TODO`) for future todo support
- `completedAt` nullable for future todo support
- `recurrenceRuleId` nullable
- `timezone` nullable
- `createdAt`
- `updatedAt`

### RecurrenceRule

- `id`
- `freq`
- `interval`
- `byWeekday` nullable
- `byMonthDay` nullable
- `byMonth` nullable
- `endAt` nullable
- `occurrenceCount` nullable
- `createdAt`
- `updatedAt`

### Tag

- `id`
- `name`
- `color` nullable
- `createdAt`

### EventTag

- `eventId`
- `tagId`

### Notification

- `id`
- `eventId`
- `offsetMinutes`
- `channel`
- `sentAt` nullable
- `createdAt`

## 10. Data Modeling Guidance

- Keep `Event` as the central table from the start.
- Support both calendar events and todo-style items through one model.
- Keep recurrence, tags, and notifications designed now but implement them after MVP.
- Avoid generating recurring instances in the database initially.
- Add recurring overrides later only when recurrence editing becomes necessary.

## 11. Recommended Tech Stack

- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS
- Database: SQLite
- ORM: Prisma

## 12. Build Order

1. Set up app shell and basic project structure
2. Implement database schema for MVP event model
3. Build monthly calendar screen
4. Build Today view
5. Implement event CRUD flow
6. Add notes and all-day handling
7. Add recurrence, todo behavior, and reminders in a later iteration

## 13. Open Decisions

- Should todo items appear in the same list as events in Today view from v1, or wait until Phase 2?
- Should quick add support only title/date first, or full create form immediately?
- Should recurrence be fully deferred, or included in the first development pass if implementation stays small?
