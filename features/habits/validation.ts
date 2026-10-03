import { z } from "zod";
import { DEFAULT_HABIT_COLOR } from "@/lib/constants";
import {
  FREQUENCIES,
  GOAL_POLARITIES,
  HABIT_CATEGORIES,
  PRIORITIES,
  TRACKING_TYPES,
} from "@/lib/types";

// Campos numéricos opcionais chegam como `undefined` (veja optionalNumber em lib/numbers.ts).
export const habitFormSchema = z
  .object({
    name: z.string().trim().min(1, "Digite um nome").max(60),
    category: z.enum(HABIT_CATEGORIES),
    trackingType: z.enum(TRACKING_TYPES),
    goalPolarity: z.enum(GOAL_POLARITIES),

    frequency: z.enum(FREQUENCIES),
    weekdays: z.array(z.number().int().min(0).max(6)).optional(),
    timesPerWeek: z.number().int().min(1, "Mínimo 1").max(7, "Máximo 7").optional(),
    timesPerDay: z.number().int().min(1, "Mínimo 1").max(20, "Máximo 20").optional(),

    unit: z.string().trim().max(20).optional(),
    goal: z.number().positive("A meta deve ser maior que zero").optional(),
    color: z.string().default(DEFAULT_HABIT_COLOR),

    description: z.string().trim().max(300).optional(),
    listId: z.string().optional(),
    priority: z.enum(PRIORITIES).default("MEDIUM"),
  })
  .refine((data) => data.frequency !== "WEEKDAYS" || (data.weekdays?.length ?? 0) > 0, {
    message: "Selecione ao menos um dia da semana",
    path: ["weekdays"],
  })
  .refine((data) => data.frequency !== "X_PER_WEEK" || data.timesPerWeek !== undefined, {
    message: "Informe quantas vezes por semana",
    path: ["timesPerWeek"],
  });

export type HabitFormValues = z.infer<typeof habitFormSchema>;
