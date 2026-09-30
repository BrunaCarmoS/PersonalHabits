"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toggleHabitLog } from "@/features/habits/actions";
import { cn } from "@/lib/utils";

interface HabitTodayItemProps {
  habit: {
    id: string;
    name: string;
    color: string;
    unit: string | null;
    goal: number | null;
    todayLog: { completed: boolean; value: number | null } | null;
  };
  date: Date;
}

export function HabitTodayItem({ habit, date }: HabitTodayItemProps) {
  const [isPending, startTransition] = useTransition();
  const completed = habit.todayLog?.completed ?? false;

  function handleToggle() {
    startTransition(async () => {
      await toggleHabitLog(habit.id, date, !completed);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="w-full flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors disabled:opacity-60"
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          completed ? "border-transparent" : "border-muted-foreground/40"
        )}
        style={completed ? { backgroundColor: habit.color } : undefined}
      >
        {completed && <Check className="h-3 w-3 text-white" />}
      </span>
      <span className={cn("flex-1 text-sm font-medium", completed && "line-through text-muted-foreground")}>
        {habit.name}
      </span>
      {habit.goal && (
        <span className="text-xs text-muted-foreground">
          Meta: {habit.goal} {habit.unit}
        </span>
      )}
    </button>
  );
}