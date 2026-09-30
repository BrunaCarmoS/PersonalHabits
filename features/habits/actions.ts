"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { habitFormSchema, type HabitFormValues } from "./validation";
import { toDateOnly } from "@/lib/dates";

export async function createHabit(values: HabitFormValues) {
  const parsed = habitFormSchema.parse(values);

  await prisma.habit.create({
    data: {
      name: parsed.name,
      description: parsed.description || null,
      category: parsed.category,
      trackingType: parsed.trackingType,
      goalPolarity: parsed.goalPolarity,
      frequency: parsed.frequency,
      weekdays: parsed.weekdays?.length ? parsed.weekdays.join(",") : null,
      timesPerWeek: parsed.timesPerWeek ?? null,
      timesPerDay: parsed.timesPerDay ?? null,
      unit: parsed.unit || null,
      goal: parsed.goal ?? null,
      color: parsed.color,
      priority: parsed.priority,
      listId: parsed.listId || null,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/today");
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/habits");
  revalidatePath("/today");
}

export async function togglePinHabit(id: string, pinned: boolean) {
  await prisma.habit.update({ where: { id }, data: { pinned } });
  revalidatePath("/habits");
  revalidatePath("/today");
}

export async function archiveHabit(id: string) {
  await prisma.habit.update({ where: { id }, data: { active: false } });
  revalidatePath("/habits");
  revalidatePath("/today");
}

export async function createHabitList(name: string) {
  const list = await prisma.habitList.create({ data: { name } });
  revalidatePath("/habits");
  return list;
}

/** Marca/desmarca um hábito simples (checklist) como feito num dia */
export async function toggleHabitLog(habitId: string, date: Date, completed: boolean) {
  const dateOnly = toDateOnly(date);

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: dateOnly } },
    update: { completed, count: completed ? 1 : 0 },
    create: { habitId, date: dateOnly, completed, count: completed ? 1 : 0 },
  });

  revalidatePath("/today");
  revalidatePath("/calendar");
  revalidatePath("/journal");
}

/** Incrementa a contagem de um hábito no dia (para hábitos que podem ser feitos várias vezes) */
export async function incrementHabitCount(habitId: string, date: Date, target: number) {
  const dateOnly = toDateOnly(date);

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: dateOnly } },
  });

  const newCount = (existing?.count ?? 0) + 1;

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: dateOnly } },
    update: { count: newCount, completed: newCount >= target },
    create: { habitId, date: dateOnly, count: newCount, completed: newCount >= target },
  });

  revalidatePath("/today");
  revalidatePath("/calendar");
  revalidatePath("/journal");
}

/** Diminui a contagem de um hábito no dia (botão de desfazer) */
export async function decrementHabitCount(habitId: string, date: Date, target: number) {
  const dateOnly = toDateOnly(date);

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: dateOnly } },
  });

  const newCount = Math.max((existing?.count ?? 0) - 1, 0);

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: dateOnly } },
    update: { count: newCount, completed: newCount >= target },
    create: { habitId, date: dateOnly, count: newCount, completed: newCount >= target },
  });

  revalidatePath("/today");
  revalidatePath("/calendar");
  revalidatePath("/journal");
}

/** Registra um valor num hábito de medição (Peso corporal, Humor) num dia específico */
export async function recordHabitValue(habitId: string, date: Date, value: number, notes?: string) {
  const dateOnly = toDateOnly(date);

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: dateOnly } },
    update: { value, completed: true, notes: notes || null },
    create: { habitId, date: dateOnly, value, completed: true, notes: notes || null },
  });

  revalidatePath("/today");
  revalidatePath("/calendar");
  revalidatePath("/journal");
}

export async function updateHabit(id: string, values: HabitFormValues) {
  const parsed = habitFormSchema.parse(values);

  await prisma.habit.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description || null,
      category: parsed.category,
      trackingType: parsed.trackingType,
      goalPolarity: parsed.goalPolarity,
      frequency: parsed.frequency,
      weekdays: parsed.weekdays?.length ? parsed.weekdays.join(",") : null,
      timesPerWeek: parsed.timesPerWeek ?? null,
      timesPerDay: parsed.timesPerDay ?? null,
      unit: parsed.unit || null,
      goal: parsed.goal ?? null,
      color: parsed.color,
      priority: parsed.priority,
      listId: parsed.listId || null,
      startDate: parsed.category === "QUIT" ? new Date() : null,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/today");
}

/** Zera a contagem de um hábito de "parar" (recaída): recomeça a contar a partir de agora */
export async function resetQuitStreak(habitId: string) {
  await prisma.habit.update({
    where: { id: habitId },
    data: { startDate: new Date() },
  });

  revalidatePath("/today");
  revalidatePath("/habits");
}