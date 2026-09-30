import { prisma } from "@/lib/prisma";
import { toDateOnly, toEndOfDay } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";

export async function getDayData(date: Date) {
  const dateOnly = toDateOnly(date);

  const [habits, tasks] = await Promise.all([
    prisma.habit.findMany({
      where: { active: true },
      include: { logs: { where: { date: dateOnly } } },
    }),
    prisma.task.findMany({
      where: { dueDate: { gte: dateOnly, lte: toEndOfDay(date) } },
      orderBy: { dueTime: "asc" },
    }),
  ]);

  const scheduledHabits = habits
    .filter((h) => isHabitScheduledForDate(h, date))
    .map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      completed: h.logs[0]?.completed ?? false,
    }));

  const timedTasks = tasks.filter((t) => t.dueTime);
  const untimedTasks = tasks.filter((t) => !t.dueTime);

  return { habits: scheduledHabits, timedTasks, untimedTasks };
}