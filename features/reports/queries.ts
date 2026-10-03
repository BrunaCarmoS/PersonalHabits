import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/dates";
import { completedDayKeys } from "@/lib/habit-logs";
import { calculateCompletionRate } from "@/lib/habit-stats";

export async function getHabitConsistency(rangeStart: Date, rangeEnd: Date) {
  const habits = await prisma.habit.findMany({
    where: { active: true, category: { not: "QUIT" } },
    orderBy: { createdAt: "asc" },
    include: {
      logs: {
        where: {
          completed: true,
          date: { gte: toDateOnly(rangeStart), lte: toDateOnly(rangeEnd) },
        },
      },
    },
  });

  return habits.map((habit) => {
    const done = completedDayKeys(habit.logs);
    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      unit: habit.unit,
      goal: habit.goal,
      completedDates: [...done],
      percentage: calculateCompletionRate(habit, done, rangeStart, rangeEnd),
    };
  });
}
