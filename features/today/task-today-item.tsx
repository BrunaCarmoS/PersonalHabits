"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toggleTaskCompleted } from "@/features/tasks/actions";

interface TaskTodayItemProps {
  task: {
    id: string;
    title: string;
    dueTime: string | null;
    priority: string;
  };
}

export function TaskTodayItem({ task }: TaskTodayItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTaskCompleted(task.id, true);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="w-full flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors disabled:opacity-60"
    >
      <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center shrink-0" />
      <span className="flex-1 text-sm font-medium">{task.title}</span>
      {task.dueTime && <span className="text-xs text-muted-foreground">{task.dueTime}</span>}
    </button>
  );
}