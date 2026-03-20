"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteEvent, saveEvent } from "@/lib/sqlite";

const normalizeDateTime = (value: FormDataEntryValue | null, fallbackHour: string) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  if (raw.length === 10) {
    return `${raw}T${fallbackHour}:00`;
  }

  return raw.length === 16 ? `${raw}:00` : raw;
};

const buildReturnPath = (options: {
  selectedDate?: string;
  selectedMonth?: string;
  editId?: string;
  error?: string;
}) => {
  const params = new URLSearchParams();

  if (options.selectedMonth) {
    params.set("month", options.selectedMonth);
  }

  if (options.selectedDate) {
    params.set("date", options.selectedDate);
  }

  if (options.editId) {
    params.set("edit", options.editId);
  }

  if (options.error) {
    params.set("error", options.error);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
};

export async function upsertEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const selectedDate = String(formData.get("selectedDate") ?? "").trim();
  const selectedMonth = String(formData.get("selectedMonth") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "");
  const allDay = formData.get("allDay") === "on";
  const startAt = normalizeDateTime(formData.get("startAt"), "09:00");
  const endAt = normalizeDateTime(formData.get("endAt"), allDay ? "23:59" : "10:00");

  if (!title || !startAt || !endAt) {
    redirect(
      buildReturnPath({
        selectedMonth,
        selectedDate,
        editId: id || undefined,
        error: "missing",
      }),
    );
  }

  if (new Date(startAt).getTime() > new Date(endAt).getTime()) {
    redirect(
      buildReturnPath({
        selectedMonth,
        selectedDate,
        editId: id || undefined,
        error: "time",
      }),
    );
  }

  saveEvent({
    id: id || undefined,
    title,
    notes,
    startAt,
    endAt,
    allDay,
  });

  revalidatePath("/");
  redirect(buildReturnPath({ selectedMonth, selectedDate }));
}

export async function deleteEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const selectedDate = String(formData.get("selectedDate") ?? "").trim();
  const selectedMonth = String(formData.get("selectedMonth") ?? "").trim();

  if (id) {
    deleteEvent(id);
    revalidatePath("/");
  }

  redirect(buildReturnPath({ selectedMonth, selectedDate }));
}
