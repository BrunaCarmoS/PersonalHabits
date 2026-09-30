"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createTask } from "./actions";
import { taskFormSchema, type TaskFormValues } from "./validation";

interface HabitList {
  id: string;
  name: string;
}

interface TaskFormDialogProps {
  lists?: HabitList[];
  defaultDate: Date;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

function toInputDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function TaskFormDialog({
  lists = [],
  defaultDate,
  externalOpen,
  onExternalOpenChange,
}: TaskFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onExternalOpenChange ?? setInternalOpen;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskFormSchema) as any,
    defaultValues: { title: "", priority: "MEDIUM", dueDate: defaultDate },
  });

  useEffect(() => {
  if (open) {
    reset({ title: "", priority: "MEDIUM", dueDate: defaultDate });
  }
}, [open, defaultDate, reset]);

  async function onSubmit(values: TaskFormValues) {
    // Se a data ficou vazia, cai no dia que estava selecionado na Visão de hoje
    const finalValues = { ...values, dueDate: values.dueDate ?? defaultDate };
    await createTask(finalValues);
    reset({ title: "", priority: "MEDIUM", dueDate: defaultDate });
    setOpen(false);
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
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex: Marcar consulta no dentista" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Detalhes (opcional)" {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Data</Label>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Input
  id="dueDate"
  type="date"
  defaultValue={toInputDate(defaultDate)}
  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value + "T00:00:00") : undefined)}
/>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Sem alterar, a tarefa fica marcada para o dia que você estava vendo na Visão de hoje.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Lista</Label>
            <Controller
              control={control}
              name="listId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhuma lista" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Prioridade</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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