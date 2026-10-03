"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toDateParam } from "@/lib/dates";
import { typedResolver } from "@/lib/form";
import type { ListOption, Priority } from "@/lib/types";
import { updateTask } from "./actions";
import { TaskFormFields } from "./task-form-fields";
import { taskFormSchema, type TaskFormValues } from "./validation";

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: Priority;
  listId: string | null;
}

const taskToFormValues = (task: TaskData): TaskFormValues => ({
  title: task.title,
  description: task.description ?? undefined,
  dueDate: task.dueDate ? toDateParam(new Date(task.dueDate)) : undefined,
  priority: task.priority,
  listId: task.listId ?? undefined,
});

export function TaskEditDialog({ task, lists }: { task: TaskData; lists: ListOption[] }) {
  const [open, setOpen] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: typedResolver<TaskFormValues>(taskFormSchema),
    defaultValues: taskToFormValues(task),
  });
  const { handleSubmit, reset, setError, formState: { errors, isSubmitting } } = form;

  function handleOpenChange(next: boolean) {
    if (next) reset(taskToFormValues(task));
    setOpen(next);
  }

  async function onSubmit(values: TaskFormValues) {
    try {
      await updateTask(task.id, values);
      setOpen(false);
    } catch {
      setError("root", { message: "Não foi possível salvar. Tente de novo." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="ghost" size="icon" onClick={() => handleOpenChange(true)} title="Editar">
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TaskFormFields form={form} lists={lists} />
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
