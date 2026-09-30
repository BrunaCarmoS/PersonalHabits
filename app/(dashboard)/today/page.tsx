import { TodayHeader } from "@/features/today/today-header";
import { CreatorMenu } from "@/features/today/creator-menu";
import { DailyHabitItem } from "@/features/today/daily-habit-item";
import { TaskTodayItem } from "@/features/today/task-today-item";
import { OverdueTasks } from "@/features/today/overdue-tasks";
import { MeasurementList } from "@/features/today/measurement-list";
import { MonthlyHabitStrip } from "@/features/today/monthly-habit-strip";
import { getDailyHabitsForToday, getHabitLists } from "@/features/habits/queries";
import { getTasksForToday } from "@/features/tasks/queries";
import { getPastYearGrid } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habit-schedule";
import { getHabitsWithYearLogs } from "@/features/reports/queries";
import { HabitHeatmap } from "@/features/reports/habit-heatmap";

type ViewMode = "compact" | "monthly" | "yearly";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const view = (params.view ?? "compact") as ViewMode;
  const selectedDate = params.date ? new Date(params.date + "T00:00:00") : new Date();
  const lists = await getHabitLists();

  return (
    <div>
      <TodayHeader currentView={view} selectedDate={selectedDate} />

      {view === "compact" && <CompactView date={selectedDate} />}
      {view === "monthly" && <MonthlyHabitStrip />}
      {view === "yearly" && <YearlyView />}

      <CreatorMenu lists={lists} selectedDate={selectedDate} />
    </div>
  );
}

async function CompactView({ date }: { date: Date }) {
  const habitsRaw = await getDailyHabitsForToday(date);
  const habits = habitsRaw.filter((h) => isHabitScheduledForDate(h, date));
  const tasks = await getTasksForToday(date);

  return (
    <div className="space-y-6">
      <OverdueTasks />

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">
          Lista de tarefas {tasks.length > 0 && `· ${tasks.length}`}
        </h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tudo livre por aqui. Toque em + para adicionar algo.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskTodayItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">
          Hábitos diários {habits.length > 0 && `· ${habits.length}`}
        </h2>
        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nada marcado ainda. Toque em + para criar seu primeiro hábito.</p>
        ) : (
          <div className="space-y-2">
            {habits.map((habit) => (
              <DailyHabitItem key={habit.id} habit={habit} date={date} />
            ))}
          </div>
        )}
      </section>

      <MeasurementList />
    </div>
  );
}

async function YearlyView() {
  const grid = getPastYearGrid();
  const rangeStart = grid[0][0];
  const rangeEnd = grid[grid.length - 1][6];
  const habits = await getHabitsWithYearLogs(rangeStart, rangeEnd);

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum hábito ainda.</p>
      ) : (
        habits.map((habit) => <HabitHeatmap key={habit.id} habit={habit} />)
      )}
    </div>
  );
}