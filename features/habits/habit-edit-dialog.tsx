"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListField } from "@/features/lists/list-field";
import { typedResolver } from "@/lib/form";
import type { ListOption } from "@/lib/types";
import { updateHabit } from "./actions";
import {
  AdvancedFields,
  ColorPicker,
  FrequencyFields,
  NumericFields,
} from "./habit-form-fields";
import { habitToFormValues, type EditableHabit } from "./habit-form-values";
import { habitFormSchema, type HabitFormValues } from "./validation";

export function HabitEditDialog({ habit, lists }: { habit: EditableHabit; lists: ListOption[] }) {
  const [open, setOpen] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: typedResolver<HabitFormValues>(habitFormSchema),
    defaultValues: habitToFormValues(habit),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const trackingType = useWatch({ control, name: "trackingType" });
  const hasNumbers = trackingType === "NUMERIC" || trackingType === "TIMER";

  function handleOpenChange(next: boolean) {
    if (next) reset(habitToFormValues(habit)); // sempre abre com os dados atuais
    setOpen(next);
  }

  async function onSubmit(values: HabitFormValues) {
    try {
      await updateHabit(habit.id, values);
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
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar hábito</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {hasNumbers && <NumericFields form={form} />}
          {habit.category !== "QUIT" && <FrequencyFields form={form} />}
          <ColorPicker form={form} />
          <ListField control={control} name="listId" lists={lists} />
          <AdvancedFields form={form} />

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
