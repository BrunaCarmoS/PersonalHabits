"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { updateTask } from "./actions";
import { taskFormSchema, type TaskFormValues } from "./validation";

interface HabitList {
  id: string;
  name: string;
}

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: string;
  listId: string | null;
}

const PRIORITY_LABELS: Record<string, string> = { LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta" };

export function TaskEditDialog({ task, lists }: { task: TaskData; lists: HabitList[] }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskFormSchema) as any,
    defaultValues: {
      title: task.title,
      description: task.description ?? undefined,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      priority: task.priority as any,
      listId: task.listId ?? undefined,
    },
  });

  async function onSubmit(values: TaskFormValues) {
    await updateTask(task.id, values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Editar">
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} />
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
  defaultValue={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value + "T00:00:00") : undefined)}
/>
              )}
            />
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
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}