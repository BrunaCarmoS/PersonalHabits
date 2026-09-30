import { Suspense } from "react";
import { HabitFormDialog } from "@/features/habits/habit-form-dialog";
import { HabitList } from "@/features/habits/habit-list";
import { TaskFormDialog } from "@/features/tasks/task-form-dialog";
import { getHabitLists } from "@/features/habits/queries";

export default async function HabitsPage() {
  const lists = await getHabitLists();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hábitos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus hábitos e tarefas.</p>
        </div>
        <div className="flex gap-2">
          <TaskFormDialog lists={lists} />
          <HabitFormDialog lists={lists} />
        </div>
      </div>

      <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Carregando...</p>}>
        <HabitList />
      </Suspense>
    </div>
  );
}