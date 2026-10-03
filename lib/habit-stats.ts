import { plusDays, getWeekStart, toDateOnly, toDateParam } from "./dates";
import { countDoneInWeek } from "./streak";
import { isHabitScheduledForDate, type ScheduledHabit } from "./habit-schedule";

export interface StatsHabit extends ScheduledHabit {
  timesPerWeek: number | null;
  createdAt: Date;
}

/**
 * % de cumprimento no período. Só conta dias entre a criação do hábito e hoje,
 * para hábitos novos e dias futuros não derrubarem a porcentagem.
 */
export function calculateCompletionRate(
  habit: StatsHabit,
  done: Set<string>,
  rangeStart: Date,
  rangeEnd: Date,
  now: Date = new Date()
): number {
  const today = toDateOnly(now);
  const from = latest(toDateOnly(rangeStart), toDateOnly(habit.createdAt));
  const to = earliest(toDateOnly(rangeEnd), today);
  if (from.getTime() > to.getTime()) return 0;

  const { scheduled, completed } =
    habit.frequency === "X_PER_WEEK"
      ? weeklyTotals(habit, done, from, to, today)
      : dailyTotals(habit, done, from, to);

  return scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
}

function dailyTotals(habit: StatsHabit, done: Set<string>, from: Date, to: Date) {
  let scheduled = 0;
  let completed = 0;
  for (let day = from; day.getTime() <= to.getTime(); day = plusDays(day, 1)) {
    if (!isHabitScheduledForDate(habit, day)) continue;
    scheduled++;
    if (done.has(toDateParam(day))) completed++;
  }
  return { scheduled, completed };
}

function weeklyTotals(habit: StatsHabit, done: Set<string>, from: Date, to: Date, today: Date) {
  const target = habit.timesPerWeek ?? 1;
  const currentWeek = getWeekStart(today).getTime();
  let scheduled = 0;
  let completed = 0;

  for (let week = getWeekStart(from); week.getTime() <= to.getTime(); week = plusDays(week, 7)) {
    const count = countDoneInWeek(done, week);
    // semana atual ainda em andamento não penaliza
    if (week.getTime() === currentWeek && count < target) continue;
    scheduled += target;
    completed += Math.min(count, target);
  }
  return { scheduled, completed };
}

const latest = (a: Date, b: Date) => (a.getTime() >= b.getTime() ? a : b);
const earliest = (a: Date, b: Date) => (a.getTime() <= b.getTime() ? a : b);
