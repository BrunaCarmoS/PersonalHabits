"use server";

import { prisma } from "@/lib/prisma";
import { refreshApp } from "@/lib/revalidate";
import { ACTIVITY_KINDS, type ActivityKind } from "./types";

export async function createJournalNote(
  content: string,
  habitId?: string,
  taskId?: string,
  listId?: string
) {
  const text = content.trim();
  if (!text) throw new Error("A nota está vazia.");
  if (text.length > 10_000) throw new Error("A nota é grande demais.");

  await prisma.journalEntry.create({
    data: { content: text, habitId: habitId || null, taskId: taskId || null, listId: listId || null },
  });
  refreshApp();
}

/** Remove um item do histórico. O que isso significa depende do tipo do item. */
export async function deleteActivityEntry(kind: ActivityKind, sourceId: string) {
  if (!(ACTIVITY_KINDS as readonly string[]).includes(kind)) throw new Error("Tipo inválido.");

  switch (kind) {
    case "habit":
    case "measurement":
      await prisma.habitLog.deleteMany({ where: { id: sourceId } });
      break;
    case "task": // desfaz a conclusão
      await prisma.task.updateMany({
        where: { id: sourceId },
        data: { completed: false, completedAt: null },
      });
      break;
    case "note":
      await prisma.journalEntry.deleteMany({ where: { id: sourceId } });
      break;
    case "habit_created": // apaga o hábito e todo o histórico dele
      await prisma.habit.deleteMany({ where: { id: sourceId } });
      break;
    case "task_created":
      await prisma.task.deleteMany({ where: { id: sourceId } });
      break;
  }
  refreshApp();
}
