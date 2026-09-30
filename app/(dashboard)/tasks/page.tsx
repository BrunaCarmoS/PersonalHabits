import { Suspense } from "react";
import { TaskList } from "@/features/tasks/task-list";

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Tarefas</h1>
      <p className="text-muted-foreground mt-1">Gerencie suas tarefas pendentes.</p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Carregando...</p>}>
        <TaskList />
      </Suspense>
    </div>
  );
}