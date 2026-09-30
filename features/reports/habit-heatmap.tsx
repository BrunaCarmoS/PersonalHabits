import { getPastWeeksGrid, isSameDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const CELL_SIZE = 10; // px — fixo nas duas visões (Mensal e Anual)
const CELL_GAP = 3;

interface HabitHeatmapProps {
  habit: {
    id: string;
    name: string;
    color: string;
    unit: string | null;
    goal: number | null;
    percentage: number;
    logs: { date: Date; completed: boolean }[];
  };
  weeksCount?: number;
  showHeader?: boolean;
}

export function HabitHeatmap({ habit, weeksCount = 53, showHeader = true }: HabitHeatmapProps) {
  const weeks = getPastWeeksGrid(weeksCount);

  function isDayCompleted(day: Date) {
    return habit.logs.some((log) => isSameDate(new Date(log.date), day) && log.completed);
  }

  return (
    <div className="rounded-lg border p-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
            <span className="text-sm font-medium">{habit.name}</span>
            {habit.goal && (
              <span className="text-xs text-muted-foreground">
                — {habit.goal} {habit.unit}
              </span>
            )}
          </div>
          <span className="text-sm font-serif">{habit.percentage}%</span>
        </div>
      )}

      <div className="flex overflow-x-auto pb-1" style={{ gap: CELL_GAP }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col shrink-0" style={{ gap: CELL_GAP }}>
            {week.map((day) => {
              const completed = isDayCompleted(day);
              return (
                <div
                  key={day.toISOString()}
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