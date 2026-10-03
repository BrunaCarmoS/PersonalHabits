import type { Frequency } from "./types";

export interface ScheduledHabit {
  frequency: Frequency;
  weekdays: string | null;
}

/** "1,3,5" → [1, 3, 5] (0 = domingo). Ignora valores inválidos. */
export function parseWeekdays(weekdays: string | null): number[] {
  if (!weekdays) return [];
  return weekdays
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
}

/** O hábito aparece nesse dia? (X_PER_WEEK pode ser feito em qualquer dia da semana.) */
export function isHabitScheduledForDate(habit: ScheduledHabit, date: Date): boolean {
  if (habit.frequency === "WEEKDAYS") return parseWeekdays(habit.weekdays).includes(date.getDay());
  return true;
}
