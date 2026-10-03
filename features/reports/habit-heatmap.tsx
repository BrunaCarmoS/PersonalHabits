import { toDateParam } from "@/lib/dates";
import { cn } from "@/lib/utils";

const CELL_SIZE = 10; // px, igual nas visões Mensal e Anual
const CELL_GAP = 3;

interface HabitHeatmapProps {
  habit: {
    name: string;
    color: string;
    unit: string | null;
    goal: number | null;
    percentage: number;
    completedDates: string[];
  };
  /** Colunas do mapa: cada item é uma semana (domingo a sábado). */
  weeks: Date[][];
}

export function HabitHeatmap({ habit, weeks }: HabitHeatmapProps) {
  const done = new Set(habit.completedDates);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
          <span className="text-sm font-medium">{habit.name}</span>
          {habit.goal != null && (
            <span className="text-xs text-muted-foreground">
              — {habit.goal} {habit.unit}
            </span>
          )}
        </div>
        <span className="text-sm font-serif">{habit.percentage}%</span>
      </div>

      <div className="flex overflow-x-auto pb-1" style={{ gap: CELL_GAP }}>
        {weeks.map((week) => (
          <div key={toDateParam(week[0])} className="flex flex-col shrink-0" style={{ gap: CELL_GAP }}>
            {week.map((day) => {
              const completed = done.has(toDateParam(day));
              return (
                <div
                  key={toDateParam(day)}
                  title={day.toLocaleDateString("pt-BR")}
                  className={cn("rounded-[2px] shrink-0", !completed && "bg-muted")}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: completed ? habit.color : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
