import { Suspense } from "react";
import { getHabitsWithYearLogs } from "@/features/reports/queries";
import { HabitHeatmap } from "@/features/reports/habit-heatmap";
import { getPastYearGrid } from "@/lib/dates";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium tracking-tight">Relatórios</h1>
      <p className="text-muted-foreground mt-1">Consistência de cada hábito no último ano.</p>

      <div className="mt-6 space-y-4">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
          <ReportsList />
        </Suspense>
      </div>
    </div>
  );
}

async function ReportsList() {
  const grid = getPastYearGrid();
  const rangeStart = grid[0][0];
  const rangeEnd = grid[grid.length - 1][6];
  const habits = await getHabitsWithYearLogs(rangeStart, rangeEnd);

  if (habits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        Nenhum hábito ainda. Crie um na Visão de hoje para ver a consistência aqui.
      </p>
    );
  }

  return (
    <>
      {habits.map((habit) => (
        <HabitHeatmap key={habit.id} habit={habit} />
      ))}
    </>
  );
}
