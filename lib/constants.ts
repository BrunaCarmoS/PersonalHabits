import type { Frequency, Priority } from "./types";

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  DAILY: "Todos os dias",
  WEEKDAYS: "Dias específicos",
  X_PER_WEEK: "X vezes por semana",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

/** Menor número = aparece primeiro. */
export const PRIORITY_RANK: Record<Priority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const HABIT_COLORS = [
  "#6366f1", "#ec4899", "#f97316", "#22c55e",
  "#06b6d4", "#eab308", "#ef4444", "#8b5cf6",
] as const;

export const DEFAULT_HABIT_COLOR: string = HABIT_COLORS[0];

/** Converte um dicionário de rótulos no formato que os selects esperam. */
export function toOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}
