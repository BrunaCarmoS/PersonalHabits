/**
 * Fonte única dos valores de enum usados no app.
 * Precisa ficar em sincronia com os enums do prisma/schema.prisma.
 */
export const HABIT_CATEGORIES = ["COUNT", "QUIT", "DIARY", "MOOD", "WEIGHT", "CUSTOM"] as const;
export const TRACKING_TYPES = ["NUMERIC", "CHECKLIST", "TIMER", "QUIT_STREAK", "MOOD_SCALE"] as const;
export const GOAL_POLARITIES = ["POSITIVE", "NEGATIVE"] as const;
export const FREQUENCIES = ["DAILY", "WEEKDAYS", "X_PER_WEEK"] as const;
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type TrackingType = (typeof TRACKING_TYPES)[number];
export type GoalPolarity = (typeof GOAL_POLARITIES)[number];
export type Frequency = (typeof FREQUENCIES)[number];
export type Priority = (typeof PRIORITIES)[number];

/** Opção de lista usada nos selects dos formulários. */
export interface ListOption {
  id: string;
  name: string;
}
