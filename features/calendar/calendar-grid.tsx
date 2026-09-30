import Link from "next/link";
import { getMonthGrid, isSameDate, nextMonth, previousMonth, toMonthParam } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";
import { getHabitsForMonth, getTasksForMonth } from "./queries";
import { MonthYearPicker } from "./month-year-picker";
import { CalendarClient, type DayData } from "./calendar-client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function CalendarGrid({ month }: { month: Date }) {
  const grid = getMonthGrid(month);
  const monthStart = grid[0];
  const monthEnd = grid[grid.length - 1];

  const [habits, tasks] = await Promise.all([
    getHabitsForMonth(monthStart, monthEnd),
    getTasksForMonth(monthStart, monthEnd),
  ]);

  const days: DayData[] = grid.map((day) => {
    const dayHabits = habits
      .filter((h) => isHabitScheduledForDate(h, day))
      .map((h) => ({
        id: h.id,
        name: h.name,
        color: h.color,
        completed: h.logs.some((log) => isSameDate(new Date(log.date), day) && log.completed),
      }));

    const dayTasks = tasks
      .filter((t) => t.dueDate && isSameDate(new Date(t.dueDate), day))
      .map((t) => ({ id: t.id, title: t.title, completed: t.completed }));

    return { date: day, habits: dayHabits, tasks: dayTasks };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <MonthYearPicker month={month} />
        <div className="flex gap-1">
          <Link
            href={`/calendar?month=${toMonthParam(previousMonth(month))}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href={`/calendar?month=${toMonthParam(new Date())}`}
            className="h-8 px-3 flex items-center justify-center rounded-lg border text-sm hover:bg-muted"
          >
            Hoje
          </Link>
          <Link
            href={`/calendar?month=${toMonthParam(nextMonth(month))}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <CalendarClient days={days} month={month} />
    </div>
  );
}