import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { daysBefore, isSameDate, toDateOnly } from "@/lib/dates";
import { MEASUREMENT_CATEGORIES, NON_DAILY_CATEGORIES } from "@/lib/habit-groups";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";
import { STREAK_LOOKBACK_DAYS, calculateStreak } from "@/lib/streak";

const HABIT_ORDER: Prisma.HabitOrderByWithRelationInput[] = [
  { pinned: "desc" },
  { createdAt: "asc" },
];

export async function getHabits() {
  return prisma.habit.findMany({
    where: { active: true },
    orderBy: HABIT_ORDER,
    include: { list: true },
  });
}

export async function getHabitLists() {
  return prisma.habitList.findMany({ orderBy: { name: "asc" } });
}

/** Hábitos "diários" (checklist/contagem) agendados para o dia, com a sequência calculada */
export async function getDailyHabits(date: Date) {
  const day = toDateOnly(date);

  const habits = await prisma.habit.findMany({
    where: { active: true, category: { notIn: NON_DAILY_CATEGORIES } },
    orderBy: HABIT_ORDER,
    include: {
      logs: { where: { date: { gte: daysBefore(day, STREAK_LOOKBACK_DAYS + 7), lte: day } } },
    },
  });

  return habits
    .filter((habit) => isHabitScheduledForDate(habit, day))
    .map((habit) => ({
      ...habit,
      todayLog: habit.logs.find((log) => isSameDate(log.date, day)) ?? null,
      streak: calculateStreak(habit, habit.logs, day),
    }));
}

/** Hábitos "outros" de medição (peso, humor, diário) com o último valor registrado */
export async function getMeasurementHabits() {
  const habits = await prisma.habit.findMany({
    where: { active: true, category: { in: MEASUREMENT_CATEGORIES } },
    orderBy: HABIT_ORDER,
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
  });

  return habits.map((habit) => ({
    ...habit,
    latestValue: habit.logs.find((log) => log.value != null)?.value ?? null,
  }));
}

/** Hábitos arquivados (os arquivados mais recentemente primeiro) */
export async function getArchivedHabits() {
  return prisma.habit.findMany({
    where: { active: false },
    orderBy: { updatedAt: "desc" },
    include: { list: true },
  });
}

/** Hábitos de "parar", com a data de início da contagem */
export async function getQuitHabits() {
  return prisma.habit.findMany({
    where: { active: true, category: "QUIT" },
    orderBy: HABIT_ORDER,
  });
}
