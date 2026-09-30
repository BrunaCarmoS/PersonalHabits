import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";

export async function getHabitsWithYearLogs(rangeStart: Date, rangeEnd: Date) {
  const habits = await prisma.habit.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    include: {
      logs: {
        where: { date: { gte: toDateOnly(rangeStart), lte: toDateOnly(rangeEnd) } },
      },
    },
  });

  return habits.map((habit) => {
    let scheduledCount = 0;
    let completedCount = 0;
    let cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      if (isHabitScheduledForDate(habit, cursor)) {
        scheduledCount++;
        const log = habit.logs.find((l) => toDateOnly(new Date(l.date)).getTime() === toDateOnly(cursor).getTime());
        if (log?.completed) completedCount++;
      }
      cursor = new Date(cursor.getTime() + 86400000);
    }

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      unit: habit.unit,
      goal: habit.goal,
      logs: habit.logs,
      percentage: scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0,
    };
  });
}
