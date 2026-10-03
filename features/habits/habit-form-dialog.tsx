"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ChevronDown, ChevronLeft, Plus } from "lucide-react";

import { SelectField } from "@/components/form/select-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListField } from "@/features/lists/list-field";
import { toOptions } from "@/lib/constants";
import { typedResolver } from "@/lib/form";
import type { HabitCategory, ListOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createHabit } from "./actions";
import {
  AdvancedFields,
  ColorPicker,
  FrequencyFields,
  NumericFields,
} from "./habit-form-fields";
import { getInitialHabitValues } from "./habit-form-values";
import {
  CUSTOM_TRACKING_LABELS,
  HABIT_TEMPLATES,
  getTemplate,
} from "./habit-templates";
import { habitFormSchema, type HabitFormValues } from "./validation";

const TRACKING_OPTIONS = toOptions(CUSTOM_TRACKING_LABELS);

const POLARITY_OPTIONS = [
  { value: "POSITIVE", label: "Positivo (construir)" },
  { value: "NEGATIVE", label: "Negativo (parar)" },
] as const;

interface HabitFormDialogProps {
  lists?: ListOption[];
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function HabitFormDialog({
  lists = [],
  externalOpen,
  onExternalOpenChange,
}: HabitFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onExternalOpenChange ?? setInternalOpen;

  const [step, setStep] = useState<1 | 2>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<HabitFormValues>({
    resolver: typedResolver<HabitFormValues>(habitFormSchema),
    defaultValues: getInitialHabitValues("CUSTOM"),
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const category = useWatch({ control, name: "category" });
  const trackingType = useWatch({ control, name: "trackingType" });
  const goalPolarity = useWatch({ control, name: "goalPolarity" });
  const template = getTemplate(category);
  const hasNumbers = trackingType === "NUMERIC" || trackingType === "TIMER";

  function pickTemplate(cat: HabitCategory) {
    reset(getInitialHabitValues(cat));
    setStep(2);
  }

  function closeAndReset() {
    setOpen(false);
    setStep(1);
    setShowAdvanced(false);
    reset(getInitialHabitValues("CUSTOM"));
  }

  async function onSubmit(values: HabitFormValues) {
    try {
      await createHabit(values);
      closeAndReset();
    } catch {
      setError("root", { message: "Não foi possível salvar. Tente de novo." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : closeAndReset())}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo hábito
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Escolha um modelo</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {HABIT_TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.category}
                    type="button"
                    onClick={() => pickTemplate(t.category)}
                    className="flex flex-col items-start gap-2 rounded-xl border p-4 text-left hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{t.name}</span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {t.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Voltar"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <DialogTitle>{template.name}</DialogTitle>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Ex: Beber água" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {!template.lockedTrackingType && (
                <div className="space-y-1.5">
                  <Label>Tipo de acompanhamento</Label>
                  <SelectField control={control} name="trackingType" options={TRACKING_OPTIONS} />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Tipo de meta</Label>
                {template.lockedTrackingType ? (
                  <p className="text-sm text-muted-foreground rounded-lg border px-3 py-2 bg-muted/40">
                    {goalPolarity === "POSITIVE" ? "Positivo (construir)" : "Negativo (parar)"}
                    <span className="text-xs"> — definido pelo modelo &quot;{template.name}&quot;</span>
                  </p>
                ) : (
                  <div className="flex gap-2">
                    {POLARITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue("goalPolarity", option.value)}
                        className={cn(
                          "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          goalPolarity === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {hasNumbers && <NumericFields form={form} />}
              {category !== "QUIT" && <FrequencyFields form={form} />}
              <ColorPicker form={form} />
              <ListField control={control} name="listId" lists={lists} />

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")}
                />
                Configurações adicionais
              </button>

              {showAdvanced && (
                <div className="border-t pt-4">
                  <AdvancedFields form={form} />
                </div>
              )}

              {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Criar hábito"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
