import { getPastWeeksGrid } from "@/lib/dates";
import { HabitHeatmap } from "./habit-heatmap";
import { getHabitConsistency } from "./queries";

export async function HabitHeatmapList({
  weeksCount,
  emptyMessage = "Nenhum hábito ainda. Crie um na Visão de hoje para ver a consistência aqui.",
}: {
  weeksCount: number;
  emptyMessage?: string;
}) {
  const weeks = getPastWeeksGrid(weeksCount);
  const habits = await getHabitConsistency(weeks[0][0], weeks[weeks.length - 1][6]);

  if (habits.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitHeatmap key={habit.id} habit={habit} weeks={weeks} />
      ))}
    </div>
  );
}
