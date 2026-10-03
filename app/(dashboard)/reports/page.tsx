import { Suspense } from "react";
import { HabitHeatmapList } from "@/features/reports/habit-heatmap-list";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium tracking-tight">Relatórios</h1>
      <p className="text-muted-foreground mt-1">Consistência de cada hábito no último ano.</p>

      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
          <HabitHeatmapList weeksCount={53} />
        </Suspense>
      </div>
    </div>
  );
}
