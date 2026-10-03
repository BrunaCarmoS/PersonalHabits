"use client";

import { useState } from "react";
import { ListChecks, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitFormDialog } from "@/features/habits/habit-form-dialog";
import { TaskFormDialog } from "@/features/tasks/task-form-dialog";
import type { ListOption } from "@/lib/types";

export function CreatorMenu({ lists, defaultDate }: { lists: ListOption[]; defaultDate: string }) {
  const [openHabit, setOpenHabit] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" aria-label="Criar">
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-2">
            <DropdownMenuItem onClick={() => setOpenHabit(true)}>
              <Target className="h-4 w-4 mr-2" />
              Novo hábito
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenTask(true)}>
              <ListChecks className="h-4 w-4 mr-2" />
              Nova tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <HabitFormDialog lists={lists} externalOpen={openHabit} onExternalOpenChange={setOpenHabit} />
      <TaskFormDialog
        lists={lists}
        defaultDate={defaultDate}
        externalOpen={openTask}
        onExternalOpenChange={setOpenTask}
      />
    </>
  );
}
