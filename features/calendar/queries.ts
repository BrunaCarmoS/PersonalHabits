import { prisma } from "@/lib/prisma";
import { toDateOnly, toEndOfDay } from "@/lib/dates";

export async function getHabitsForMonth(monthStart: Date, monthEnd: Date) {
  return prisma.habit.findMany({
    where: { active: true, category: { not: "QUIT" } },
    include: {
      logs: {
        where: { date: { gte: toDateOnly(monthStart), lte: toEndOfDay(monthEnd) } },
      },
    },
  });
}

export async function getTasksForMonth(monthStart: Date, monthEnd: Date) {
  return prisma.task.findMany({
    where: {
      dueDate: { gte: toDateOnly(monthStart), lte: toEndOfDay(monthEnd) },
    },
  });
}