import type { HabitCategory } from "./types";

/** Hábitos "outros" de medição: você registra um valor ao longo do tempo (peso, humor, quanto escreveu) */
export const MEASUREMENT_CATEGORIES: HabitCategory[] = ["WEIGHT", "MOOD", "DIARY"];

/** Categorias que não entram na lista de hábitos diários da Visão de hoje */
export const NON_DAILY_CATEGORIES: HabitCategory[] = [...MEASUREMENT_CATEGORIES, "QUIT"];

export const isMeasurementHabit = (category: string): boolean =>
  (MEASUREMENT_CATEGORIES as string[]).includes(category);

/** Hábitos de "parar": mostram há quantos dias você está sem fazer aquilo */
export const isQuitHabit = (category: string): boolean => category === "QUIT";
