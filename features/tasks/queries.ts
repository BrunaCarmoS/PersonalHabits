import { prisma } from "@/lib/prisma";
import { toDateOnly, toEndOfDay } from "@/lib/dates";

export async function getTasks() {
  return prisma.task.findMany({
    where: { completed: false },
    orderBy: [{ dueDate: "asc" }],
    include: { list: true },
  });
}

export async function getTasksForToday(date: Date) {
  return prisma.task.findMany({
    where: {
      completed: false,
      dueDate: { gte: toDateOnly(date), lte: toEndOfDay(date) },
    },
    orderBy: [{ priority: "desc" }],
    include: { list: true },
  });
}

/** Tarefas com data no passado (antes de hoje) que ainda não foram concluídas */
export async function getOverdueTasks() {
  return prisma.task.findMany({
    where: {
      completed: false,
      dueDate: { lt: toDateOnly(new Date()) },
    },
    orderBy: [{ dueDate: "asc" }],
    include: { list: true },
  });
}