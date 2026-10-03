import { DEFAULT_HABIT_COLOR } from "@/lib/constants";
import { parseWeekdays } from "@/lib/habit-schedule";
import type {
  Frequency,
  GoalPolarity,
  HabitCategory,
  Priority,
  TrackingType,
} from "@/lib/types";
import { getTemplate } from "./habit-templates";
import type { HabitFormValues } from "./validation";

/** Campos do hábito que o formulário de edição precisa. */
export interface EditableHabit {
  id: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  trackingType: TrackingType;
  goalPolarity: GoalPolarity;
  frequency: Frequency;
  weekdays: string | null;
  timesPerWeek: number | null;
  timesPerDay: number | null;
  unit: string | null;
  goal: number | null;
  color: string;
  priority: Priority;
  listId: string | null;
}

export function getInitialHabitValues(category: HabitCategory): HabitFormValues {
  const template = getTemplate(category);
  return {
    name: category === "CUSTOM" ? "" : template.name,
    category: template.category,
    trackingType: template.trackingType,
    goalPolarity: template.goalPolarity,
    frequency: "DAILY",
    weekdays: [],
    color: DEFAULT_HABIT_COLOR,
    priority: "MEDIUM",
  };
}

export function habitToFormValues(habit: EditableHabit): HabitFormValues {
  return {
    name: habit.name,
    category: habit.category,
    trackingType: habit.trackingType,
    goalPolarity: habit.goalPolarity,
    frequency: habit.frequency,
    weekdays: parseWeekdays(habit.weekdays),
    timesPerWeek: habit.timesPerWeek ?? undefined,
    timesPerDay: habit.timesPerDay ?? undefined,
    unit: habit.unit ?? undefined,
    goal: habit.goal ?? undefined,
    color: habit.color,
    description: habit.description ?? undefined,
    listId: habit.listId ?? undefined,
    priority: habit.priority,
  };
}
