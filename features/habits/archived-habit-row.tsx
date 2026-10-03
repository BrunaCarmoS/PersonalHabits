"use client";

import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteHabit, restoreHabit } from "./actions";

interface ArchivedHabitRowProps {
  habit: {
    id: string;
    name: string;
    color: string;
    updatedAt: Date;
    list: { name: string } | null;
  };
}

export function ArchivedHabitRow({ habit }: ArchivedHabitRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const message = `Excluir "${habit.name}" para sempre? Todo o histórico dele também será apagado.`;
    if (window.confirm(message)) startTransition(() => deleteHabit(habit.id));
  }

  return (
    <Card className="p-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-3 w-3 rounded-full shrink-0 opacity-50" style={{ backgroundColor: habit.color }} />
        <div className="min-w-0">
          <p className="font-medium truncate text-muted-foreground">{habit.name}</p>
          <p className="text-xs text-muted-foreground">
            Arquivado em {new Date(habit.updatedAt).toLocaleDateString("pt-BR")}
            {habit.list && ` · ${habit.list.name}`}
          </p>
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => startTransition(() => restoreHabit(habit.id))}
        >
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Restaurar
        </Button>
        <Button variant="ghost" size="icon" disabled={isPending} onClick={handleDelete} title="Excluir para sempre">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
