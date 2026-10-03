import { prisma } from "@/lib/prisma";
import { PRIORITY_RANK } from "@/lib/constants";
import { toDateOnly, toEndOfDay } from "@/lib/dates";
import type { Priority } from "@/lib/types";

const byPriority = <T extends { priority: Priority }>(a: T, b: T) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];

/** Mais antigas primeiro; sem data vai para o fim. */
const byDueDate = <T extends { dueDate: Date | null }>(a: T, b: T) => {
  if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return 0;
};

export async function getTasks() {
  const tasks = await prisma.task.findMany({
    where: { completed: false },
    include: { list: true },
  });
  return tasks.sort((a, b) => byDueDate(a, b) || byPriority(a, b));
}

export async function getTasksForToday(date: Date) {
  const tasks = await prisma.task.findMany({
    where: { completed: false, dueDate: { gte: toDateOnly(date), lte: toEndOfDay(date) } },
    orderBy: { createdAt: "asc" },
    include: { list: true },
  });
  return tasks.sort(byPriority);
}

/** Tarefas com data no passado (antes de hoje) que ainda não foram concluídas */
export async function getOverdueTasks() {
  return prisma.task.findMany({
    where: { completed: false, dueDate: { lt: toDateOnly(new Date()) } },
    orderBy: { dueDate: "asc" },
    include: { list: true },
  });
}
