"use client";

import { useTransition } from "react";
import { Archive, Pin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FREQUENCY_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import type { ListOption } from "@/lib/types";
import { archiveHabit, deleteHabit, togglePinHabit } from "./actions";
import { HabitEditDialog } from "./habit-edit-dialog";
import type { EditableHabit } from "./habit-form-values";
import { getTemplate } from "./habit-templates";

type HabitCardData = EditableHabit & { pinned: boolean; list: { name: string } | null };

export function HabitCard({ habit, lists }: { habit: HabitCardData; lists: ListOption[] }) {
  const [isPending, startTransition] = useTransition();
  const template = getTemplate(habit.category);

  function handleDelete() {
    const message = `Excluir "${habit.name}" para sempre? Todo o histórico dele também será apagado.`;
    if (window.confirm(message)) startTransition(() => deleteHabit(habit.id));
  }

  function handleArchive() {
    const message = `Arquivar "${habit.name}"? Ele some das telas, mas o histórico fica guardado.`;
    if (window.confirm(message)) startTransition(() => archiveHabit(habit.id));
  }

  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{habit.name}</p>
            {habit.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
          </div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">{template.name}</Badge>
            <Badge variant="outline" className="text-xs">{FREQUENCY_LABELS[habit.frequency]}</Badge>
            {habit.goal != null && (
              <Badge variant="outline" className="text-xs">
                Meta: {habit.goal} {habit.unit}
              </Badge>
            )}
            {habit.priority !== "MEDIUM" && (
              <Badge variant="outline" className="text-xs">
                Prioridade {PRIORITY_LABELS[habit.priority]}
              </Badge>
            )}
            {habit.list && (
              <Badge variant="outline" className="text-xs">{habit.list.name}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <HabitEditDialog habit={habit} lists={lists} />
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          aria-pressed={habit.pinned}
          onClick={() => startTransition(() => togglePinHabit(habit.id, !habit.pinned))}
          title={habit.pinned ? "Desafixar" : "Fixar"}
        >
          <Pin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled={isPending} onClick={handleArchive} title="Arquivar">
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled={isPending} onClick={handleDelete} title="Excluir">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
