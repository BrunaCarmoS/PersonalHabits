"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronLeft, ChevronDown } from "lucide-react";

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

import { createHabit, createHabitList } from "./actions";
import {
  habitFormSchema,
  type HabitFormValues,
  FREQUENCY_LABELS,
  WEEKDAY_LABELS,
  PRIORITY_LABELS,
  HABIT_COLORS,
} from "./validation";
import {
  HABIT_TEMPLATES,
  getTemplate,
  TRACKING_TYPE_LABELS,
  type HabitCategory,
} from "./habit-templates";
import { cn } from "@/lib/utils";

interface HabitList {
  id: string;
  name: string;
}

interface HabitFormDialogProps {
  lists?: HabitList[];
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
  const [localLists, setLocalLists] = useState<HabitList[]>(lists ?? []);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(habitFormSchema) as any,
    defaultValues: {
      name: "",
      category: "CUSTOM",
      trackingType: "CHECKLIST",
      goalPolarity: "POSITIVE",
      frequency: "DAILY",
      weekdays: [],
      color: HABIT_COLORS[0],
      priority: "MEDIUM",
    },
  });

  const trackingType = watch("trackingType");
  const goalPolarity = watch("goalPolarity");
  const frequency = watch("frequency");
  const weekdays = watch("weekdays") ?? [];
  const color = watch("color");
  const category = watch("category") as HabitCategory;

  const template = getTemplate(category);

  function pickTemplate(cat: HabitCategory) {
    const t = getTemplate(cat);
    reset({
      name: cat === "CUSTOM" ? "" : t.name,
      category: t.category,
      trackingType: t.trackingType,
      goalPolarity: t.goalPolarity,
      frequency: "DAILY",
      weekdays: [],
      color: HABIT_COLORS[0],
      priority: "MEDIUM",
    });
    setStep(2);
  }

  function closeAndReset() {
    setOpen(false);
    setStep(1);
    setShowAdvanced(false);
    reset();
  }

  async function onSubmit(values: HabitFormValues) {
    await createHabit(values);
    closeAndReset();
  }

  function toggleWeekday(day: number) {
    const current = getValues("weekdays") ?? [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("weekdays", next);
  }

  async function handleAddList() {
    if (!newListName.trim()) return;
    const list = await createHabitList(newListName.trim());
    setLocalLists((prev) => [...prev, list]);
    setValue("listId", list.id);
    setNewListName("");
    setAddingList(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : closeAndReset())}>
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
                  <Controller
                    control={control}
                    name="trackingType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TRACKING_TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

<div className="space-y-1.5">
  <Label>Tipo de meta</Label>
  {template.lockedTrackingType ? (
    <p className="text-sm text-muted-foreground rounded-lg border px-3 py-2 bg-muted/40">
      {goalPolarity === "POSITIVE" ? "Positivo (construir)" : "Negativo (parar)"}
      <span className="text-xs"> — definido pelo modelo "{template.name}"</span>
    </p>
  ) : (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setValue("goalPolarity", "POSITIVE")}
        className={cn(
          "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          goalPolarity === "POSITIVE"
            ? "border-primary bg-primary/10 text-primary"
            : "hover:bg-muted"
        )}
      >
        Positivo (construir)
      </button>
      <button
        type="button"
        onClick={() => setValue("goalPolarity", "NEGATIVE")}
        className={cn(
          "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          goalPolarity === "NEGATIVE"
            ? "border-primary bg-primary/10 text-primary"
            : "hover:bg-muted"
        )}
      >
        Negativo (parar)
      </button>
    </div>
  )}
</div>

              {(trackingType === "NUMERIC" || trackingType === "TIMER") && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="unit">Unidade (opcional)</Label>
                    <Input id="unit" placeholder="copos, kg, min" {...register("unit")} />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="goal">Meta (opcional)</Label>
                    <Input id="goal" type="number" step="any" placeholder="Deixe em branco se quiser" {...register("goal")} />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="timesPerDay">Vezes/dia</Label>
                    <Input id="timesPerDay" type="number" min={1} placeholder="1" {...register("timesPerDay")} />
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
                  {errors.weekdays && (
                    <p className="text-sm text-destructive mt-1">{errors.weekdays.message as string}</p>
                  )}
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

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
                Configurações adicionais
              </button>

              {showAdvanced && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" placeholder="Notas sobre esse hábito..." {...register("description")} />
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
                            {localLists.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {!addingList ? (
                      <button
                        type="button"
                        onClick={() => setAddingList(true)}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        + Criar nova lista
                      </button>
                    ) : (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          placeholder="Nome da lista"
                          className="h-8 text-sm"
                        />
                        <Button type="button" size="sm" onClick={handleAddList}>
                          Adicionar
                        </Button>
                      </div>
                    )}
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
                </div>
              )}

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