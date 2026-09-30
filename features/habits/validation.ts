import { z } from "zod";

export const habitFormSchema = z
  .object({
    name: z.string().min(1, "Digite um nome").max(60),
    category: z.enum(["COUNT", "QUIT", "DIARY", "MOOD", "WEIGHT", "CUSTOM"]),
    trackingType: z.enum(["NUMERIC", "CHECKLIST", "TIMER", "QUIT_STREAK", "MOOD_SCALE"]),
    goalPolarity: z.enum(["POSITIVE", "NEGATIVE"]),

    frequency: z.enum(["DAILY", "WEEKDAYS", "X_PER_WEEK"]),
    weekdays: z.array(z.number().min(0).max(6)).optional(),
    timesPerWeek: z.coerce.number().min(1).max(7).optional(),
    timesPerDay: z.coerce.number().min(1).max(20).optional(),

    unit: z.string().max(20).optional(),
    goal: z.coerce.number().positive().optional(),
    color: z.string().default("#6366f1"),

    description: z.string().max(300).optional(),
    listId: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  })
  .refine(
    (data) => (data.frequency === "WEEKDAYS" ? (data.weekdays?.length ?? 0) > 0 : true),
    { message: "Selecione ao menos um dia da semana", path: ["weekdays"] }
  );

export type HabitFormValues = z.infer<typeof habitFormSchema>;

export const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "Todos os dias",
  WEEKDAYS: "Dias específicos",
  X_PER_WEEK: "X vezes por semana",
};

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const HABIT_COLORS = [
  "#6366f1", "#ec4899", "#f97316", "#22c55e",
  "#06b6d4", "#eab308", "#ef4444", "#8b5cf6",
];