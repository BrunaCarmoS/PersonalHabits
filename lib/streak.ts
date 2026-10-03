import { plusDays, daysBefore, getWeekStart, previousDay, toDateOnly, toDateParam } from "./dates";
import { completedDayKeys } from "./habit-logs";
import { isHabitScheduledForDate, type ScheduledHabit } from "./habit-schedule";

/** Quantos dias para trás as queries buscam e o cálculo de sequência enxerga. */
export const STREAK_LOOKBACK_DAYS = 400;

export interface StreakHabit extends ScheduledHabit {
  timesPerWeek: number | null;
}

/**
 * Sequência atual do hábito.
 * - Diário / dias específicos: dias agendados seguidos concluídos.
 * - X vezes por semana: semanas seguidas em que a meta foi batida.
 * O dia (ou a semana) de hoje ainda em aberto não quebra a sequência.
 */
export function calculateStreak(
  habit: StreakHabit,
  logs: { date: Date; completed: boolean }[],
  referenceDate: Date = new Date()
): number {
  const done = completedDayKeys(logs);
  return habit.frequency === "X_PER_WEEK"
    ? weeklyStreak(habit, done, referenceDate)
    : dailyStreak(habit, done, referenceDate);
}

function dailyStreak(habit: StreakHabit, done: Set<string>, referenceDate: Date): number {
  let cursor = toDateOnly(referenceDate);
  if (isHabitScheduledForDate(habit, cursor) && !done.has(toDateParam(cursor))) {
    cursor = previousDay(cursor);
  }

  let streak = 0;
  for (let i = 0; i < STREAK_LOOKBACK_DAYS; i++) {
    if (isHabitScheduledForDate(habit, cursor)) {
      if (!done.has(toDateParam(cursor))) break;
      streak++;
    }
    cursor = previousDay(cursor);
  }
  return streak;
}

function weeklyStreak(habit: StreakHabit, done: Set<string>, referenceDate: Date): number {
  const target = habit.timesPerWeek ?? 1;
  const maxWeeks = Math.ceil(STREAK_LOOKBACK_DAYS / 7);
  let weekStart = getWeekStart(toDateOnly(referenceDate));
  let streak = 0;

  for (let week = 0; week < maxWeeks; week++) {
    if (countDoneInWeek(done, weekStart) >= target) streak++;
    else if (week > 0) break; // a semana atual (week === 0) ainda pode ser cumprida
    weekStart = daysBefore(weekStart, 7);
  }
  return streak;
}

export function countDoneInWeek(done: Set<string>, weekStart: Date): number {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (done.has(toDateParam(plusDays(weekStart, i)))) count++;
  }
  return count;
}
