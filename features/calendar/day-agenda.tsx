import { getDayData } from "./day-queries";
import { TimedTaskRow, UntimedTaskRow, HabitRow } from "./day-agenda-items";

export async function DayAgenda({ date }: { date: Date }) {
  const { habits, timedTasks, untimedTasks } = await getDayData(date);
  const isEmpty = habits.length === 0 && timedTasks.length === 0 && untimedTasks.length === 0;

  if (isEmpty) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        Nada agendado para esse dia. Toque em + na Visão de hoje para adicionar algo.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {timedTasks.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Com horário</h3>
          <div className="space-y-1.5">
            {timedTasks.map((task) => (
              <TimedTaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {untimedTasks.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Tarefas do dia</h3>
          <div className="space-y-1.5">
            {untimedTasks.map((task) => (
              <UntimedTaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {habits.length > 0 && (
        <section>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Hábitos</h3>
          <div className="space-y-1.5">
            {habits.map((habit) => (
              <HabitRow key={habit.id} habit={habit} date={date} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}