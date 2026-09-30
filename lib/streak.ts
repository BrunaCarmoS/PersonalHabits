import { toDateOnly, previousDay } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";

interface StreakHabit {
  frequency: string;
  weekdays: string | null;
}

interface StreakLog {
  date: Date;
  completed: boolean;
}

/** Conta quantos dias seguidos (contando hoje pra trás) o hábito foi cumprido nos dias em que estava agendado */
export function calculateStreak(habit: StreakHabit, logs: StreakLog[], referenceDate: Date = new Date()): number {
  const logMap = new Map<string, boolean>();
  for (const log of logs) {
    logMap.set(toDateOnly(new Date(log.date)).toDateString(), log.completed);
  }

  let streak = 0;
  let cursor = toDateOnly(referenceDate);

  // Se hoje ainda não foi marcado, não quebra a sequência — só não conta hoje ainda
  if (isHabitScheduledForDate(habit, cursor) && !logMap.get(cursor.toDateString())) {
    cursor = previousDay(cursor);
  }

  while (true) {
    if (isHabitScheduledForDate(habit, cursor)) {
      if (logMap.get(cursor.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    cursor = previousDay(cursor);

    // limite de segurança pra não rodar pra sempre em hábito muito antigo
    if (streak > 3650) break;
  }

  return streak;
}