"use client";

import type { UseFormReturn } from "react-hook-form";
import { SelectField } from "@/components/form/select-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FREQUENCY_LABELS,
  HABIT_COLORS,
  PRIORITY_LABELS,
  WEEKDAY_LABELS,
  toOptions,
} from "@/lib/constants";
import { optionalNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils";
import type { HabitFormValues } from "./validation";

type HabitForm = UseFormReturn<HabitFormValues>;

const FREQUENCY_OPTIONS = toOptions(FREQUENCY_LABELS);
const PRIORITY_OPTIONS = toOptions(PRIORITY_LABELS);

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

/** Unidade, meta e vezes por dia (hábitos numéricos e cronômetro). */
export function NumericFields({ form }: { form: HabitForm }) {
  const { register, formState: { errors } } = form;
  const message =
    errors.unit?.message ?? errors.goal?.message ?? errors.timesPerDay?.message;

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unidade (opcional)</Label>
          <Input id="unit" placeholder="copos, kg, min" {...register("unit")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal">Meta (opcional)</Label>
          <Input
            id="goal"
            type="number"
            step="any"
            placeholder="Ex: 8"
            {...register("goal", { setValueAs: optionalNumber })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timesPerDay">Vezes/dia</Label>
          <Input
            id="timesPerDay"
            type="number"
            min={1}
            placeholder="1"
            {...register("timesPerDay", { setValueAs: optionalNumber })}
          />
        </div>
      </div>
      <ErrorText message={message} />
    </div>
  );
}

/** Frequência + dias da semana ou vezes por semana. */
export function FrequencyFields({ form }: { form: HabitForm }) {
  const { control, register, watch, setValue, formState: { errors } } = form;
  const frequency = watch("frequency");
  const weekdays = watch("weekdays") ?? [];

  function toggleWeekday(day: number) {
    const next = weekdays.includes(day) ? weekdays.filter((d) => d !== day) : [...weekdays, day];
    setValue("weekdays", next, { shouldValidate: true });
  }

  return (
    <>
      <div className="space-y-1.5">
        <Label>Frequência</Label>
        <SelectField control={control} name="frequency" options={FREQUENCY_OPTIONS} />
      </div>

      {frequency === "WEEKDAYS" && (
        <div>
          <Label>Dias da semana</Label>
          <div className="flex gap-1.5 mt-2">
            {WEEKDAY_LABELS.map((label, day) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={weekdays.includes(day)}
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
          <ErrorText message={errors.weekdays?.message as string | undefined} />
        </div>
      )}

      {frequency === "X_PER_WEEK" && (
        <div className="space-y-1.5">
          <Label htmlFor="timesPerWeek">Vezes por semana</Label>
          <Input
            id="timesPerWeek"
            type="number"
            min={1}
            max={7}
            {...register("timesPerWeek", { setValueAs: optionalNumber })}
          />
          <ErrorText message={errors.timesPerWeek?.message} />
        </div>
      )}
    </>
  );
}

export function ColorPicker({ form }: { form: HabitForm }) {
  const color = form.watch("color");

  return (
    <div>
      <Label>Cor</Label>
      <div className="flex gap-2 mt-2">
        {HABIT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Cor ${c}`}
            onClick={() => form.setValue("color", c)}
            style={{ backgroundColor: c }}
            className={cn(
              "h-7 w-7 rounded-full border-2 transition-transform",
              color === c ? "border-foreground scale-110" : "border-transparent"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Descrição e prioridade. */
export function AdvancedFields({ form }: { form: HabitForm }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Notas sobre esse hábito..."
          {...form.register("description")}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Prioridade</Label>
        <SelectField control={form.control} name="priority" options={PRIORITY_OPTIONS} />
      </div>
    </div>
  );
}
