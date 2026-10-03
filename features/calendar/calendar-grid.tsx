import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getMonthGrid,
  nextMonth,
  previousMonth,
  toDateParam,
  toMonthParam,
} from "@/lib/dates";
import { completedDayKeys } from "@/lib/habit-logs";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";
import { CalendarClient, type DayData } from "./calendar-client";
import { MonthYearPicker } from "./month-year-picker";
import { getHabitsForMonth, getTasksForMonth } from "./queries";

const NAV_LINK = "h-8 flex items-center justify-center rounded-lg border hover:bg-muted";

export async function CalendarGrid({ month }: { month: Date }) {
  const grid = getMonthGrid(month);

  const [habits, tasks] = await Promise.all([
    getHabitsForMonth(grid[0], grid[grid.length - 1]),
    getTasksForMonth(grid[0], grid[grid.length - 1]),
  ]);

  const doneByHabit = new Map(habits.map((h) => [h.id, completedDayKeys(h.logs)]));

  const days: DayData[] = grid.map((day) => {
    const key = toDateParam(day);
    return {
      date: day,
      habits: habits
        .filter((h) => isHabitScheduledForDate(h, day))
        .map((h) => ({
          id: h.id,
          name: h.name,
          color: h.color,
          completed: doneByHabit.get(h.id)?.has(key) ?? false,
        })),
      tasks: tasks
        .filter((t) => t.dueDate && toDateParam(t.dueDate) === key)
        .map((t) => ({ id: t.id, title: t.title, completed: t.completed })),
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <MonthYearPicker month={month} />
        <div className="flex gap-1">
          <Link
            href={`/calendar?month=${toMonthParam(previousMonth(month))}`}
            aria-label="Mês anterior"
            className={`${NAV_LINK} w-8`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href={`/calendar?month=${toMonthParam(new Date())}`} className={`${NAV_LINK} px-3 text-sm`}>
            Hoje
          </Link>
          <Link
            href={`/calendar?month=${toMonthParam(nextMonth(month))}`}
            aria-label="Próximo mês"
            className={`${NAV_LINK} w-8`}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* key: ao trocar de mês o dia selecionado é recalculado */}
      <CalendarClient key={toMonthParam(month)} days={days} month={month} />
    </div>
  );
}
