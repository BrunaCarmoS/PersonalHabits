"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRIORITY_LABELS } from "@/lib/constants";
import type { ListOption, Priority } from "@/lib/types";
import { deleteTask, toggleTaskCompleted } from "./actions";
import { TaskEditDialog } from "./task-edit-dialog";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    priority: Priority;
    completed: boolean;
    listId: string | null;
    list: ListOption | null;
  };
  lists: ListOption[];
}

export function TaskItem({ task, lists }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          aria-label={`Concluir "${task.title}"`}
          checked={task.completed}
          disabled={isPending}
          onChange={(e) => startTransition(() => toggleTaskCompleted(task.id, e.target.checked))}
          className="h-4 w-4"
        />
        <div className="min-w-0">
          <p className="font-medium truncate">{task.title}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {task.dueDate && (
              <Badge variant="outline" className="text-xs">
                {new Date(task.dueDate).toLocaleDateString("pt-BR")}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">{PRIORITY_LABELS[task.priority]}</Badge>
            {task.list && <Badge variant="outline" className="text-xs">{task.list.name}</Badge>}
          </div>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <TaskEditDialog task={task} lists={lists} />
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={() => startTransition(() => deleteTask(task.id))}
          title="Excluir"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
