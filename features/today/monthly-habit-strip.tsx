import { getHabitsWithYearLogs } from "@/features/reports/queries";
import { HabitHeatmap } from "@/features/reports/habit-heatmap";
import { getPastWeeksGrid } from "@/lib/dates";

const MONTH_WEEKS = 5;

export async function MonthlyHabitStrip() {
  const weeks = getPastWeeksGrid(MONTH_WEEKS);
  const rangeStart = weeks[0][0];
  const rangeEnd = weeks[weeks.length - 1][6];
  const habits = await getHabitsWithYearLogs(rangeStart, rangeEnd);

  if (habits.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Nenhum hábito ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitHeatmap key={habit.id} habit={habit} weeksCount={MONTH_WEEKS} />
      ))}
    </div>
  );
}