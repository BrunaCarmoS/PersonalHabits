"use client";

import type { UseFormReturn } from "react-hook-form";
import { SelectField } from "@/components/form/select-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListField } from "@/features/lists/list-field";
import { PRIORITY_LABELS, toOptions } from "@/lib/constants";
import type { ListOption } from "@/lib/types";
import type { TaskFormValues } from "./validation";

const PRIORITY_OPTIONS = toOptions(PRIORITY_LABELS);

export function TaskFormFields({
  form,
  lists,
  dateHint,
}: {
  form: UseFormReturn<TaskFormValues>;
  lists: ListOption[];
  dateHint?: string;
}) {
  const { register, control, formState: { errors } } = form;

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Ex: Marcar consulta no dentista" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" placeholder="Detalhes (opcional)" {...register("description")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dueDate">Data</Label>
        <Input
          id="dueDate"
          type="date"
          {...register("dueDate", { setValueAs: (value) => value || undefined })}
        />
        {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
        {dateHint && <p className="text-xs text-muted-foreground">{dateHint}</p>}
      </div>

      <ListField control={control} name="listId" lists={lists} />

      <div className="space-y-1.5">
        <Label>Prioridade</Label>
        <SelectField control={control} name="priority" options={PRIORITY_OPTIONS} />
      </div>
    </>
  );
}
