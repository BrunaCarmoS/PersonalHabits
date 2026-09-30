"use client";

import { useState } from "react";
import { Plus, Target, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitFormDialog } from "@/features/habits/habit-form-dialog";
import { TaskFormDialog } from "@/features/tasks/task-form-dialog";

interface HabitList {
  id: string;
  name: string;
}

export function CreatorMenu({ lists, selectedDate }: { lists: HabitList[]; selectedDate: Date }) {
  const [openHabit, setOpenHabit] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
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

      <div className="hidden">
        <HabitFormDialog lists={lists} externalOpen={openHabit} onExternalOpenChange={setOpenHabit} />
        <TaskFormDialog
          lists={lists}
          defaultDate={selectedDate}
          externalOpen={openTask}
          onExternalOpenChange={setOpenTask}
        />
      </div>
    </>
  );
}