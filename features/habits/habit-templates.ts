import type { LucideIcon } from "lucide-react";
import { Ban, BookOpen, Repeat, Scale, Settings2, Smile } from "lucide-react";
import type { GoalPolarity, HabitCategory, TrackingType } from "@/lib/types";

export interface HabitTemplate {
  category: HabitCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  trackingType: TrackingType;
  goalPolarity: GoalPolarity;
  lockedTrackingType: boolean;
}

const CUSTOM_TEMPLATE: HabitTemplate = {
  category: "CUSTOM",
  name: "Hábito personalizado",
  description: "Configure cada detalhe do seu jeito: tipo de acompanhamento, meta e frequência",
  icon: Settings2,
  trackingType: "CHECKLIST",
  goalPolarity: "POSITIVE",
  lockedTrackingType: false,
};

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
  CUSTOM_TEMPLATE,
];

export function getTemplate(category: string): HabitTemplate {
  return HABIT_TEMPLATES.find((t) => t.category === category) ?? CUSTOM_TEMPLATE;
}

/** Tipos de acompanhamento que fazem sentido num hábito personalizado. */
export const CUSTOM_TRACKING_LABELS: Record<string, string> = {
  CHECKLIST: "Sim / Não (feito ou não)",
  NUMERIC: "Valor numérico (com meta)",
  TIMER: "Cronômetro / Timer",
};
