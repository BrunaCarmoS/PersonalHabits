import type { LucideIcon } from "lucide-react";
import { Repeat, Ban, BookOpen, Smile, Scale, Settings2 } from "lucide-react";

export type HabitCategory = "COUNT" | "QUIT" | "DIARY" | "MOOD" | "WEIGHT" | "CUSTOM";
export type TrackingType = "NUMERIC" | "CHECKLIST" | "TIMER" | "QUIT_STREAK" | "MOOD_SCALE";
export type GoalPolarity = "POSITIVE" | "NEGATIVE";

export interface HabitTemplate {
  category: HabitCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  trackingType: TrackingType;
  goalPolarity: GoalPolarity;
  lockedTrackingType: boolean;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    category: "COUNT",
    name: "Contagem",
    description: "Acompanhe a frequência com que conclui uma tarefa ou atividade",
    icon: Repeat,
    trackingType: "NUMERIC",
    goalPolarity: "POSITIVE",
    lockedTrackingType: true,
  },
  {
    category: "QUIT",
    name: "Parar",
    description: "Acompanhe o tempo desde que abandonou um mau hábito",
    icon: Ban,
    trackingType: "QUIT_STREAK",
    goalPolarity: "NEGATIVE",
    lockedTrackingType: true,
  },
  {
    category: "DIARY",
    name: "Diário",
    description: "Acompanhe quanto escreve no diário",
    icon: BookOpen,
    trackingType: "NUMERIC",
    goalPolarity: "POSITIVE",
    lockedTrackingType: true,
  },
  {
    category: "MOOD",
    name: "Humor",
    description: "Acompanhe seu humor e suas emoções ao longo do tempo",
    icon: Smile,
    trackingType: "MOOD_SCALE",
    goalPolarity: "POSITIVE",
    lockedTrackingType: true,
  },
  {
    category: "WEIGHT",
    name: "Peso corporal",
    description: "Acompanhe o progresso e as tendências do seu peso",
    icon: Scale,
    trackingType: "NUMERIC",
    goalPolarity: "POSITIVE",
    lockedTrackingType: true,
  },
  {
    category: "CUSTOM",
    name: "Hábito personalizado",
    description: "Configure cada detalhe do seu jeito: tipo de acompanhamento, meta e frequência",
    icon: Settings2,
    trackingType: "CHECKLIST",
    goalPolarity: "POSITIVE",
    lockedTrackingType: false,
  },
];

export function getTemplate(category: HabitCategory): HabitTemplate {
  return HABIT_TEMPLATES.find((t) => t.category === category) ?? HABIT_TEMPLATES[5];
}

export const TRACKING_TYPE_LABELS: Record<TrackingType, string> = {
  NUMERIC: "Valor numérico (com meta)",
  CHECKLIST: "Sim / Não (feito ou não)",
  TIMER: "Cronômetro / Timer",
  QUIT_STREAK: "Dias desde que parou",
  MOOD_SCALE: "Escala de humor",
};