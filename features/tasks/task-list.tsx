import { getTasks } from "./queries";
import { getHabitLists } from "@/features/habits/queries";
import { TaskItem } from "./task-item";

export async function TaskList() {
  const [tasks, lists] = await Promise.all([getTasks(), getHabitLists()]);

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground text-sm mt-8 text-center">
        Nenhuma tarefa pendente. Crie uma pela Visão de hoje.
      </p>
    );
  }

  return (
    <div className="space-y-2 mt-6">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} lists={lists} />
      ))}
    </div>
  );
}