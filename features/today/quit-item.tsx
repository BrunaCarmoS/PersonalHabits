"use client";

import { useState, useTransition } from "react";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetQuitStreak } from "@/features/habits/actions";

interface QuitItemProps {
  habit: {
    id: string;
    name: string;
    color: string;
    startDate: Date | null;
    createdAt: Date;
  };
}

export function QuitItem({ habit }: QuitItemProps) {
  const [isPending, startTransition] = useTransition();

  const [now] = useState(() => Date.now());
  const start = new Date(habit.startDate ?? habit.createdAt);
  const days = Math.max(0, Math.floor((now - start.getTime()) / 86400000));

  function handleRelapse() {
    if (!window.confirm(`Zerar a contagem de "${habit.name}"? Ela recomeça a partir de agora.`)) return;
    startTransition(() => resetQuitStreak(habit.id));
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: habit.color }} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{habit.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          desde {start.toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-serif text-2xl leading-none">{days}</p>
        <p className="text-xs text-muted-foreground">{days === 1 ? "dia" : "dias"}</p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRelapse}
        disabled={isPending}
        className="shrink-0 text-muted-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
        Recaí
      </Button>
    </div>
  );
}