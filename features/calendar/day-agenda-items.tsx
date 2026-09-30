"use client";

import { useTransition } from "react";
import { Check, Clock } from "lucide-react";
import { toggleHabitLog } from "@/features/habits/actions";
import { toggleTaskCompleted } from "@/features/tasks/actions";
import { cn } from "@/lib/utils";

export function TimedTaskRow({ task }: { task: { id: string; title: string; dueTime: string | null; completed: boolean } }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleTaskCompleted(task.id, !task.completed))}
      disabled={isPending}
      className="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left hover:bg-muted/50 disabled:opacity-60"
    >
      <span className="flex items-center gap-1 text-xs text-muted-foreground w-14 shrink-0">
        <Clock className="h-3 w-3" />
        {task.dueTime}
      </span>
      <span className={cn("text-sm flex-1", task.completed && "line-through text-muted-foreground")}>
        {task.title}
      </span>
    </button>
  );
}

export function UntimedTaskRow({ task }: { task: { id: string; title: string; completed: boolean } }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleTaskCompleted(task.id, !task.completed))}
      disabled={isPending}
      className="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left hover:bg-muted/50 disabled:opacity-60"
    >
      <span
        className={cn(
          "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
          task.completed ? "border-transparent bg-foreground" : "border-muted-foreground/40"
        )}
      >
        {task.completed && <Check className="h-2.5 w-2.5 text-background" />}
      </span>
      <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
        {task.title}
      </span>
    </button>
  );
}

export function HabitRow({ habit, date }: { habit: { id: string; name: string; color: string; completed: boolean }; date: Date }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleHabitLog(habit.id, date, !habit.completed))}
      disabled={isPending}
      className="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left hover:bg-muted/50 disabled:opacity-60"
    >
      <span
        className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{
          backgroundColor: habit.completed ? habit.color : "transparent",
          borderColor: habit.completed ? "transparent" : undefined,
        }}
      >
        {habit.completed && <Check className="h-2.5 w-2.5 text-white" />}
      </span>
      <span className={cn("text-sm", habit.completed && "line-through text-muted-foreground")}>
        {habit.name}
      </span>
    </button>
  );
}