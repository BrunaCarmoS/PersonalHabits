import { getOverdueTasks } from "@/features/tasks/queries";
import { toggleTaskCompleted } from "@/features/tasks/actions";
import { AlertTriangle } from "lucide-react";

function daysOverdue(dueDate: Date): number {
  const diff = Date.now() - new Date(dueDate).setHours(0, 0, 0, 0);
  return Math.max(1, Math.round(diff / 86400000));
}

export async function OverdueTasks() {
  const tasks = await getOverdueTasks();
  if (tasks.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1.5">
        <AlertTriangle className="h-4 w-4" />
        Em atraso · {tasks.length}
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <OverdueTaskRow key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

function OverdueTaskRow({ task }: { task: { id: string; title: string; dueDate: Date | null } }) {
  return (
    <form action={async () => { "use server"; await toggleTaskCompleted(task.id, true); }}>
      <button
        type="submit"
        className="w-full flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-left hover:bg-destructive/10"
      >
        <span className="h-5 w-5 rounded-full border-2 border-destructive/40 shrink-0" />
        <span className="flex-1 text-sm font-medium">{task.title}</span>
        <span className="text-xs text-destructive shrink-0">
          {task.dueDate && `${daysOverdue(task.dueDate)}d atrasada`}
        </span>
      </button>
    </form>
  );
}