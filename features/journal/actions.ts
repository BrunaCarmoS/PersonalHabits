"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJournalNote(content: string, habitId?: string, taskId?: string, listId?: string) {
  await prisma.journalEntry.create({
    data: {
      content,
      habitId: habitId || null,
      taskId: taskId || null,
      listId: listId || null,
    },
  });

  revalidatePath("/journal");
}

export async function deleteJournalNote(id: string) {
  await prisma.journalEntry.delete({ where: { id } });
  revalidatePath("/journal");
}

export async function deleteActivityEntry(entryId: string) {
  if (entryId.startsWith("habit-created-")) {
    const habitId = entryId.replace("habit-created-", "");
    await prisma.habit.delete({ where: { id: habitId } }).catch(() => {});
    revalidatePath("/journal");
    revalidatePath("/habits");
    revalidatePath("/today");
    revalidatePath("/calendar");
    revalidatePath("/reports");
    return;
  }

  if (entryId.startsWith("task-created-")) {
    const taskId = entryId.replace("task-created-", "");
    await prisma.task.delete({ where: { id: taskId } }).catch(() => {});
    revalidatePath("/journal");
    revalidatePath("/tasks");
    revalidatePath("/today");
    revalidatePath("/calendar");
    return;
  }

  const [prefix, ...rest] = entryId.split("-");
  const realId = rest.join("-");

  if (prefix === "habit") {
    await prisma.habitLog.delete({ where: { id: realId } }).catch(() => {});
  } else if (prefix === "task") {
    await prisma.task.update({
      where: { id: realId },
      data: { completed: false, completedAt: null },
    }).catch(() => {});
  } else if (prefix === "note") {
    await prisma.journalEntry.delete({ where: { id: realId } }).catch(() => {});
  }

  revalidatePath("/journal");
  revalidatePath("/today");
  revalidatePath("/tasks");
  revalidatePath("/habits");
}
