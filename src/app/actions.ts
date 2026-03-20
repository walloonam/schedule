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

export async function upsertEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "");
  const allDay = formData.get("allDay") === "on";
  const startAt = normalizeDateTime(formData.get("startAt"), "09:00");
  const endAt = normalizeDateTime(formData.get("endAt"), allDay ? "23:59" : "10:00");

  if (!title || !startAt || !endAt) {
    redirect("/?error=missing");
  }

  if (new Date(startAt).getTime() > new Date(endAt).getTime()) {
    redirect(id ? `/?edit=${id}&error=time` : "/?error=time");
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
  redirect("/");
}

export async function deleteEventAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (id) {
    deleteEvent(id);
    revalidatePath("/");
  }

  redirect("/");
}
