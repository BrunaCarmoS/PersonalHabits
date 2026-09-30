"use client";

import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTask, toggleTaskCompleted } from "./actions";
import { TaskEditDialog } from "./task-edit-dialog";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    priority: string;
    completed: boolean;
    listId: string | null;
    list: { id: string; name: string } | null;
  };
  lists: { id: string; name: string }[];
}

const PRIORITY_LABELS: Record<string, string> = { LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta" };

export function TaskItem({ task, lists }: TaskItemProps) {
  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => toggleTaskCompleted(task.id, e.target.checked)}
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
            <Badge variant="outline" className="text-xs">
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            {task.list && (
              <Badge variant="outline" className="text-xs">
                {task.list.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <TaskEditDialog task={task} lists={lists} />
        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} title="Excluir">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}