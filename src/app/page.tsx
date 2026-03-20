import Link from "next/link";
import { deleteEventAction, upsertEventAction } from "@/app/actions";
import {
  getDatabaseFilePath,
  getEventById,
  listDayEvents,
  listMonthEvents,
  listTodayEvents,
  listUpcomingEvents,
} from "@/lib/sqlite";

type HomeProps = {
  searchParams?: Promise<{
    month?: string;
    date?: string;
    edit?: string;
    error?: string;
    success?: string;
  }>;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatMonthTitle = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

const formatDayTitle = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatTime = (value: string, allDay: number) => {
  if (allDay) {
    return "All day";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const toLocalInputValue = (value: string) => {
  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const startOfMonthGrid = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = firstDay.getDay();
  const offset = (day + 6) % 7;
  firstDay.setDate(firstDay.getDate() - offset);
  return firstDay;
};

const buildCalendarDays = (baseDate: Date, eventCountByDay: Map<string, number>) => {
  const start = startOfMonthGrid(baseDate);
  const days = [];

  for (let index = 0; index < 42; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    const key = current.toISOString().slice(0, 10);

    days.push({
      key,
      day: current.getDate(),
      muted: current.getMonth() !== baseDate.getMonth(),
      isToday: key === new Date().toISOString().slice(0, 10),
      count: eventCountByDay.get(key) ?? 0,
    });
  }

  return days;
};

const buildEventCountMap = (events: { startAt: string }[]) => {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const key = event.startAt.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
};

const isValidDateKey = (value: string | undefined) =>
  Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

const isValidMonthKey = (value: string | undefined) =>
  Boolean(value && /^\d{4}-\d{2}$/.test(value));

const getSuccessMessage = (value: string | undefined) => {
  if (value === "created") {
    return "일정이 저장되었어요.";
  }

  if (value === "updated") {
    return "일정이 수정되었어요.";
  }

  if (value === "deleted") {
    return "일정이 삭제되었어요.";
  }

  return null;
};

const buildDateRange = (dateKey: string) => {
  const start = new Date(`${dateKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
};

const buildMonthDate = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const clampSelectedDateToMonth = (selectedDateKey: string, monthDate: Date) => {
  const [year, month] = selectedDateKey.split("-").map(Number);

  if (year === monthDate.getFullYear() && month - 1 === monthDate.getMonth()) {
    return selectedDateKey;
  }

  const day = Number(selectedDateKey.slice(8, 10));
  const safeDay = Math.min(
    day,
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate(),
  );

  return `${formatMonthKey(monthDate)}-${String(safeDay).padStart(2, "0")}`;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const visibleMonthKey =
    params.month && isValidMonthKey(params.month) ? params.month : formatMonthKey(now);
  const visibleMonth = buildMonthDate(visibleMonthKey);
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const requestedDateKey = params.date && isValidDateKey(params.date) ? params.date : todayKey;
  const selectedDateKey = clampSelectedDateToMonth(requestedDateKey, visibleMonth);
  const selectedDateRange = buildDateRange(selectedDateKey);

  const monthEvents = listMonthEvents(monthStart.toISOString(), monthEnd.toISOString());
  const todayEvents = listTodayEvents(dayStart.toISOString(), dayEnd.toISOString());
  const upcomingEvents = listUpcomingEvents();
  const selectedDayEvents = listDayEvents(
    selectedDateRange.start.toISOString(),
    selectedDateRange.end.toISOString(),
  );
  const editingEvent = params.edit ? getEventById(params.edit) : null;
  const selectedDate = new Date(`${selectedDateKey}T00:00:00`);
  const previousMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  const previousMonthDateKey = clampSelectedDateToMonth(selectedDateKey, previousMonth);
  const nextMonthDateKey = clampSelectedDateToMonth(selectedDateKey, nextMonth);
  const todayMonthKey = formatMonthKey(now);

  const eventCountByDay = buildEventCountMap(monthEvents);
  const calendarDays = buildCalendarDays(visibleMonth, eventCountByDay);
  const formTitle = editingEvent ? "Edit event" : "Quick add";
  const formStartDefault = editingEvent?.startAt
    ? toLocalInputValue(editingEvent.startAt)
    : `${selectedDateKey}T09:00`;
  const formEndDefault = editingEvent?.endAt
    ? toLocalInputValue(editingEvent.endAt)
    : `${selectedDateKey}T10:00`;
  const successMessage = getSuccessMessage(params.success);

  return (
    <main className="min-h-screen px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-line bg-surface shadow-[0_20px_80px_rgba(84,58,28,0.08)]">
          <div className="flex flex-col gap-6 border-b border-line px-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-muted">
                Personal Schedule Manager
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Plan the month, then work from today.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
                Your events now persist in a local SQLite file, so this app can
                behave like a real personal scheduler instead of a static mockup.
              </p>
            </div>

            <div className="rounded-[28px] border border-line bg-white px-5 py-4 text-sm text-ink-muted">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em]">
                Local Database
              </p>
              <p className="mt-2 break-all text-xs">{getDatabaseFilePath()}</p>
            </div>
          </div>

          <div className="grid gap-6 p-4 lg:grid-cols-[1.45fr_0.9fr] lg:p-6">
            <section className="rounded-[28px] bg-white p-5 shadow-[inset_0_0_0_1px_rgba(62,44,24,0.06)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
                    Month View
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {formatMonthTitle(visibleMonth)}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/?month=${formatMonthKey(previousMonth)}&date=${previousMonthDateKey}`}
                    className="rounded-full border border-line px-4 py-2 text-sm"
                  >
                    Prev
                  </Link>
                  <Link
                    href={`/?month=${todayMonthKey}&date=${todayKey}`}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
                  >
                    Today
                  </Link>
                  <Link
                    href={`/?month=${formatMonthKey(nextMonth)}&date=${nextMonthDateKey}`}
                    className="rounded-full border border-line px-4 py-2 text-sm"
                  >
                    Next
                  </Link>
                </div>
              </div>

              <div className="mt-4 rounded-full bg-[#fff1ea] px-4 py-2 text-sm font-medium text-[#9c4f2d] w-fit">
                {monthEvents.length} saved this month
              </div>

              <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-mono uppercase tracking-[0.2em] text-ink-muted">
                {weekDays.map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-2">
                {calendarDays.map((item) => (
                  <Link
                    key={item.key}
                    href={`/?month=${visibleMonthKey}&date=${item.key}`}
                    className={[
                      "flex min-h-24 flex-col rounded-3xl border px-3 py-3 transition-transform duration-200 hover:-translate-y-0.5 sm:min-h-28",
                      item.key === selectedDateKey
                        ? "border-accent bg-[#fff1ea] shadow-[0_16px_32px_rgba(214,104,60,0.16)]"
                        : "border-line bg-surface",
                      item.muted ? "text-[#b1a08f]" : "text-foreground",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium">{item.day}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">
                        {item.key === selectedDateKey
                          ? "Selected"
                          : item.isToday
                            ? "Today"
                            : item.count
                              ? "Planned"
                              : ""}
                      </span>
                      {item.count ? (
                        <span className="rounded-full bg-[#efe3d4] px-2 py-1 text-[11px] font-medium text-[#734b2f]">
                          +{item.count}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-dashed border-line bg-[#fcf6ee] px-4 py-4 text-sm text-ink-muted">
                {monthEvents.length > 0
                  ? `Selected date: ${formatDayTitle(selectedDate)}`
                  : "No events saved for this month yet. Add your first event from the panel on the right."}
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-[28px] bg-[#1f3a33] p-5 text-white sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">
                    Today Focus
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {formatDayTitle(now)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {todayEvents.length > 0
                      ? "Your saved events for today are ready below."
                      : "No events for today yet. Use the quick add form to create one."}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
                  {String(todayEvents.length).padStart(2, "0")} items
                </div>
              </div>

              <div className="space-y-3">
                {todayEvents.length > 0 ? (
                  todayEvents.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[24px] bg-white px-4 py-4 text-[#1b1a18]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#7f6c5a]">
                            {formatTime(item.startAt, item.allDay)}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                        </div>
                        <Link
                          href={`/?month=${visibleMonthKey}&date=${selectedDateKey}&edit=${item.id}`}
                          className="rounded-full bg-[#f3e6d8] px-3 py-1 text-xs font-medium text-[#734b2f]"
                        >
                          Edit
                        </Link>
                      </div>
                      {item.notes ? (
                        <p className="mt-3 text-sm leading-6 text-[#5f554c]">
                          {item.notes}
                        </p>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-white/75">
                    No events today yet.
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/55">
                  Upcoming
                </p>
                <div className="mt-3 space-y-2">
                  {upcomingEvents.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-white/8 px-3 py-3 text-sm"
                    >
                      <span className="truncate pr-3">{item.title}</span>
                      <span className="font-mono text-xs text-white/70">
                        {item.startAt.slice(5, 10)}
                      </span>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 ? (
                    <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-white/75">
                      Upcoming events will appear here.
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-line bg-white p-5 shadow-[0_20px_60px_rgba(84,58,28,0.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
                  {formTitle}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {editingEvent ? "Update saved event" : "Create a new event"}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {editingEvent
                    ? `Editing event on ${formatShortDate(new Date(editingEvent.startAt))}`
                    : `New events will default to ${formatDayTitle(selectedDate)}`}
                </p>
              </div>
              {editingEvent ? (
                <Link
                  href={`/?month=${visibleMonthKey}&date=${selectedDateKey}`}
                  className="rounded-full border border-line px-4 py-2 text-sm"
                >
                  Cancel edit
                </Link>
              ) : null}
            </div>

            {params.error === "missing" ? (
              <p className="mt-4 rounded-2xl bg-[#fff1ea] px-4 py-3 text-sm text-[#9c4f2d]">
                제목, 시작 시간, 종료 시간은 꼭 입력해야 해요.
              </p>
            ) : null}
            {params.error === "time" ? (
              <p className="mt-4 rounded-2xl bg-[#fff1ea] px-4 py-3 text-sm text-[#9c4f2d]">
                종료 시간은 시작 시간보다 빠를 수 없어요.
              </p>
            ) : null}
            {successMessage ? (
              <p className="mt-4 rounded-2xl bg-[#e6f5ea] px-4 py-3 text-sm text-[#236341]">
                {successMessage}
              </p>
            ) : null}

            <form action={upsertEventAction} className="mt-5 space-y-4">
              <input name="id" type="hidden" defaultValue={editingEvent?.id ?? ""} />
              <input name="selectedMonth" type="hidden" value={visibleMonthKey} />
              <input name="selectedDate" type="hidden" value={selectedDateKey} />

              <label className="block space-y-2">
                <span className="text-sm font-medium">Title</span>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={editingEvent?.title ?? ""}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="Dinner with family"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Start</span>
                  <input
                    name="startAt"
                    type="datetime-local"
                    required
                    defaultValue={formStartDefault}
                    className="w-full rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">End</span>
                  <input
                    name="endAt"
                    type="datetime-local"
                    required
                    defaultValue={formEndDefault}
                    className="w-full rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                <input
                  name="allDay"
                  type="checkbox"
                  defaultChecked={Boolean(editingEvent?.allDay)}
                />
                <span className="text-sm font-medium">All-day event</span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Notes</span>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={editingEvent?.notes ?? ""}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                  placeholder="Optional notes for this event"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
                >
                  {editingEvent ? "Save changes" : "Add event"}
                </button>
                <Link
                  href={`/?month=${visibleMonthKey}&date=${selectedDateKey}`}
                  className="rounded-full border border-line px-5 py-3 text-sm font-medium"
                >
                  Reset form
                </Link>
              </div>
            </form>
          </section>

          <section className="rounded-[28px] border border-line bg-surface p-5 shadow-[0_20px_60px_rgba(84,58,28,0.08)] sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-muted">
              Selected day
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{formatDayTitle(selectedDate)}</h2>
            <p className="mt-2 text-sm text-ink-muted">
              {selectedDayEvents.length > 0
                ? "Only events from the selected calendar day are shown here."
                : "No events saved on this selected day yet."}
            </p>

            <div className="mt-5 space-y-3">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-line bg-white px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                          {item.startAt.slice(0, 10)} · {formatTime(item.startAt, item.allDay)}
                        </p>
                        <h3 className="mt-2 truncate text-lg font-semibold">{item.title}</h3>
                        {item.notes ? (
                          <p className="mt-2 text-sm leading-6 text-ink-muted">
                            {item.notes}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm text-ink-muted">No notes yet.</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/?month=${visibleMonthKey}&date=${selectedDateKey}&edit=${item.id}`}
                          className="rounded-full border border-line px-4 py-2 text-sm"
                        >
                          Edit
                        </Link>
                        <form action={deleteEventAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="selectedMonth" value={visibleMonthKey} />
                          <input type="hidden" name="selectedDate" value={selectedDateKey} />
                          <button
                            type="submit"
                            className="rounded-full bg-[#2b211a] px-4 py-2 text-sm text-white"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-ink-muted">
                  No saved events on {formatShortDate(selectedDate)} yet. Add one from
                  the form to start using your local schedule database.
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
