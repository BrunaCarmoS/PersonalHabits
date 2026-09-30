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

import { updateHabit } from "./actions";
import {
  habitFormSchema,
  type HabitFormValues,
  FREQUENCY_LABELS,
  WEEKDAY_LABELS,
  PRIORITY_LABELS,
  HABIT_COLORS,
} from "./validation";
import { getTemplate } from "./habit-templates";
import { cn } from "@/lib/utils";

interface HabitList {
  id: string;
  name: string;
}

interface HabitData {
  id: string;
  name: string;
  description: string | null;
  category: string;
  trackingType: string;
  goalPolarity: string;
  frequency: string;
  weekdays: string | null;
  timesPerWeek: number | null;
  timesPerDay: number | null;
  unit: string | null;
  goal: number | null;
  color: string;
  priority: string;
  listId: string | null;
}

export function HabitEditDialog({ habit, lists }: { habit: HabitData; lists: HabitList[] }) {
  const [open, setOpen] = useState(false);
  const template = getTemplate(habit.category as any);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(habitFormSchema) as any,
    defaultValues: {
      name: habit.name,
      category: habit.category as any,
      trackingType: habit.trackingType as any,
      goalPolarity: habit.goalPolarity as any,
      frequency: habit.frequency as any,
      weekdays: habit.weekdays ? habit.weekdays.split(",").map(Number) : [],
      timesPerWeek: habit.timesPerWeek ?? undefined,
      timesPerDay: habit.timesPerDay ?? undefined,
      unit: habit.unit ?? undefined,
      goal: habit.goal ?? undefined,
      color: habit.color,
      description: habit.description ?? undefined,
      listId: habit.listId ?? undefined,
      priority: habit.priority as any,
    },
  });

  const frequency = watch("frequency");
  const weekdays = watch("weekdays") ?? [];
  const color = watch("color");

  function toggleWeekday(day: number) {
    const current = getValues("weekdays") ?? [];
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    setValue("weekdays", next);
  }

  async function onSubmit(values: HabitFormValues) {
    await updateHabit(habit.id, values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Editar">
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

          {(watch("trackingType") === "NUMERIC" || watch("trackingType") === "TIMER") && (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit">Unidade (opcional)</Label>
                <Input id="unit" {...register("unit")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="goal">Meta (opcional)</Label>
                <Input id="goal" type="number" step="any" {...register("goal")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timesPerDay">Vezes/dia</Label>
                <Input id="timesPerDay" type="number" min={1} {...register("timesPerDay")} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Frequência</Label>
            <Controller
              control={control}
              name="frequency"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {frequency === "WEEKDAYS" && (
            <div>
              <Label>Dias da semana</Label>
              <div className="flex gap-1.5 mt-2">
                {WEEKDAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeekday(day)}
                    className={cn(
                      "h-9 w-9 rounded-full text-xs font-medium border transition-colors",
                      weekdays.includes(day)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:bg-muted"
                    )}
                  >
                    {label[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === "X_PER_WEEK" && (
            <div className="space-y-1.5">
              <Label htmlFor="timesPerWeek">Vezes por semana</Label>
              <Input id="timesPerWeek" type="number" min={1} max={7} {...register("timesPerWeek")} />
            </div>
          )}

          <div>
            <Label>Cor</Label>
            <div className="flex gap-2 mt-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  style={{ backgroundColor: c }}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} />
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