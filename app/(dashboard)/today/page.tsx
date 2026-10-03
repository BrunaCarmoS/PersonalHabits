import { CreatorMenu } from "@/features/today/creator-menu";
import { DailyHabitItem } from "@/features/today/daily-habit-item";
import { MeasurementList } from "@/features/today/measurement-list";
import { OverdueTasks } from "@/features/today/overdue-tasks";
import { TaskTodayItem } from "@/features/today/task-today-item";
import { TODAY_VIEWS, TodayHeader } from "@/features/today/today-header";
import { getDailyHabits, getHabitLists } from "@/features/habits/queries";
import { HabitHeatmapList } from "@/features/reports/habit-heatmap-list";
import { getTasksForToday } from "@/features/tasks/queries";
import { parseDateParam, toDateParam } from "@/lib/dates";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const view = TODAY_VIEWS.find((v) => v.value === params.view)?.value ?? "compact";
  const selectedDate = parseDateParam(params.date);
  const lists = await getHabitLists();

  return (
    <div>
      <TodayHeader currentView={view} selectedDate={selectedDate} />

      {view === "compact" && <CompactView date={selectedDate} />}
      {view === "monthly" && (
        <HabitHeatmapList weeksCount={5} emptyMessage="Nenhum hábito ainda." />
      )}
      {view === "yearly" && (
        <HabitHeatmapList weeksCount={53} emptyMessage="Nenhum hábito ainda." />
      )}

      <CreatorMenu lists={lists} defaultDate={toDateParam(selectedDate)} />
    </div>
  );
}

async function CompactView({ date }: { date: Date }) {
  const [habits, tasks] = await Promise.all([getDailyHabits(date), getTasksForToday(date)]);

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
