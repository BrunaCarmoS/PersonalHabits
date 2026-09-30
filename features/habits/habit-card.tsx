"use client";

import { Pin, Trash2, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteHabit, togglePinHabit, archiveHabit } from "./actions";
import { getTemplate } from "./habit-templates";
import { FREQUENCY_LABELS, PRIORITY_LABELS } from "./validation";
import { HabitEditDialog } from "./habit-edit-dialog";

interface HabitWithList {
  id: string;
  name: string;
  description: string | null;
  category: string;
  trackingType: string;
  goalPolarity: string;
  frequency: string;
  weekdays: string | null;
  timesPerWeek: number | null;
  timesPerDay: number | null;
  goal: number | null;
  unit: string | null;
  priority: string;
  pinned: boolean;
  color: string;
  listId: string | null;
  list: { name: string } | null;
}

interface HabitList {
  id: string;
  name: string;
}

export function HabitCard({ habit, lists }: { habit: HabitWithList; lists: HabitList[] }) {
  const template = getTemplate(habit.category as any);

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
            <Badge variant="secondary" className="text-xs">
              {template.name}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {FREQUENCY_LABELS[habit.frequency]}
            </Badge>
            {habit.goal && (
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
              <Badge variant="outline" className="text-xs">
                {habit.list.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <HabitEditDialog habit={habit} lists={lists} />
        <Button variant="ghost" size="icon" onClick={() => togglePinHabit(habit.id, !habit.pinned)} title="Fixar">
          <Pin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => archiveHabit(habit.id)} title="Arquivar">
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => deleteHabit(habit.id)} title="Excluir">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}