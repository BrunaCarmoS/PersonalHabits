"use client";

import { useTransition } from "react";
import { Check, Flame, Plus, Minus } from "lucide-react";
import { toggleHabitLog, incrementHabitCount, decrementHabitCount } from "@/features/habits/actions";
import { cn } from "@/lib/utils";

interface DailyHabitItemProps {
  habit: {
    id: string;
    name: string;
    color: string;
    timesPerDay: number | null;
    streak: number;
    todayLog: { completed: boolean; count: number } | null;
  };
  date: Date;
}

export function DailyHabitItem({ habit, date }: DailyHabitItemProps) {
  const [isPending, startTransition] = useTransition();
  const target = habit.timesPerDay ?? 1;
  const count = habit.todayLog?.count ?? 0;
  const completed = habit.todayLog?.completed ?? false;

  const isCounter = target > 1;

  function handleCheckboxToggle() {
    startTransition(() => toggleHabitLog(habit.id, date, !completed));
  }

  function handleIncrement() {
    startTransition(() => incrementHabitCount(habit.id, date, target));
  }

  function handleDecrement() {
    startTransition(() => decrementHabitCount(habit.id, date, target));
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      {!isCounter ? (
        <button
          onClick={handleCheckboxToggle}
          disabled={isPending}
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors disabled:opacity-60",
            completed ? "border-transparent" : "border-muted-foreground/40"
          )}
          style={completed ? { backgroundColor: habit.color } : undefined}
        >
          {completed && <Check className="h-3 w-3 text-white" />}
        </button>
      ) : (
        <button
          onClick={handleDecrement}
          disabled={isPending || count === 0}
          className="h-6 w-6 rounded-full border flex items-center justify-center shrink-0 disabled:opacity-30"
        >
          <Minus className="h-3 w-3" />
        </button>
      )}

      <span className={cn("flex-1 text-sm font-medium", completed && "line-through text-muted-foreground")}>
        {habit.name}
      </span>

      {habit.streak > 0 && (
        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium shrink-0">
          <Flame className="h-3.5 w-3.5" />
          {habit.streak}
        </span>
      )}

      {isCounter && (
        <>
          <span className="text-xs text-muted-foreground shrink-0">
            {count}/{target}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isPending}
            className="h-6 w-6 rounded-full border flex items-center justify-center shrink-0"
            style={completed ? { backgroundColor: habit.color, borderColor: habit.color } : undefined}
          >
            <Plus className={cn("h-3 w-3", completed && "text-white")} />
          </button>
        </>
      )}
    </div>
  );
}