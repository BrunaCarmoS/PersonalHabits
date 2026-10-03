"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { typedResolver } from "@/lib/form";
import type { ListOption } from "@/lib/types";
import { createTask } from "./actions";
import { TaskFormFields } from "./task-form-fields";
import { taskFormSchema, type TaskFormValues } from "./validation";

interface TaskFormDialogProps {
  lists?: ListOption[];
  /** Dia (yyyy-MM-dd) que estava selecionado na Visão de hoje. */
  defaultDate: string;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

const emptyValues = (dueDate: string): TaskFormValues => ({
  title: "",
  description: "",
  dueDate,
  priority: "MEDIUM",
  listId: undefined,
});

export function TaskFormDialog({
  lists = [],
  defaultDate,
  externalOpen,
  onExternalOpenChange,
}: TaskFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onExternalOpenChange ?? setInternalOpen;

  const form = useForm<TaskFormValues>({
    resolver: typedResolver<TaskFormValues>(taskFormSchema),
    defaultValues: emptyValues(defaultDate),
  });
  const { handleSubmit, reset, setError, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if (open) reset(emptyValues(defaultDate));
  }, [open, defaultDate, reset]);

  async function onSubmit(values: TaskFormValues) {
    try {
      // Sem data preenchida, cai no dia que estava na Visão de hoje
      await createTask({ ...values, dueDate: values.dueDate || defaultDate });
      setOpen(false);
    } catch {
      setError("root", { message: "Não foi possível salvar. Tente de novo." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nova tarefa
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>O que você gostaria de fazer?</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TaskFormFields
            form={form}
            lists={lists}
            dateHint="Sem alterar, a tarefa fica marcada para o dia que você estava vendo na Visão de hoje."
          />
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
