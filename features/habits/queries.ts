import { prisma } from "@/lib/prisma";
import { toDateOnly, previousDay } from "@/lib/dates";
import { calculateStreak } from "@/lib/streak";

export async function getHabits() {
  return prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
    include: { list: true },
  });
}

export async function getHabitLists() {
  return prisma.habitList.findMany({ orderBy: { name: "asc" } });
}

/** Hábitos "diários" (checklist/contagem) do dia, com a sequência (streak) calculada */
export async function getDailyHabitsForToday(date: Date) {
  const dateOnly = toDateOnly(date);
  const historyStart = previousDay(new Date(dateOnly.getTime() - 400 * 86400000));

  const habits = await prisma.habit.findMany({
    where: {
      active: true,
      NOT: { category: { in: ["WEIGHT", "MOOD", "DIARY", "QUIT"] } },
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
    include: {
      logs: { where: { date: { gte: historyStart, lte: dateOnly } } },
    },
  });

  return habits.map((h) => {
    const todayLog = h.logs.find((l) => toDateOnly(new Date(l.date)).getTime() === dateOnly.getTime()) ?? null;
    const streak = calculateStreak(h, h.logs, date);
    return { ...h, todayLog, streak };
  });
}

/** Hábitos "outros" de medição (peso, humor, diário) com o último valor registrado */
export async function getMeasurementHabits() {
  const habits = await prisma.habit.findMany({
    where: { active: true, category: { in: ["WEIGHT", "MOOD", "DIARY"] } },
    orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
    include: {
      logs: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  return habits.map((h) => ({
    ...h,
    latestValue: h.logs[0]?.value ?? null,
    latestDate: h.logs[0]?.date ?? null,
  }));
}

/** Hábitos de "parar", com a data de início da contagem */
export async function getQuitHabits() {
  return prisma.habit.findMany({
    where: { active: true, category: "QUIT" },
    orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
  });
}

export async function getHabitsForWeek(weekDays: Date[]) {
  const start = toDateOnly(weekDays[0]);
  const end = toDateOnly(weekDays[weekDays.length - 1]);
  return prisma.habit.findMany({
    where: { active: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "asc" }],
    include: {
      logs: { where: { date: { gte: start, lte: end } } },
    },
  });
}