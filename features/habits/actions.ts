"use server";

import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/dates";
import { refreshApp } from "@/lib/revalidate";
import { habitFormSchema, type HabitFormValues } from "./validation";

/** Valida o formulário e monta os dados que vão pro banco (usado em criar e editar). */
function buildHabitData(values: HabitFormValues) {
  const parsed = habitFormSchema.parse(values);
  const tracksNumbers = parsed.trackingType === "NUMERIC" || parsed.trackingType === "TIMER";

  return {
    name: parsed.name,
    description: parsed.description || null,
    category: parsed.category,
    trackingType: parsed.trackingType,
    goalPolarity: parsed.goalPolarity,
    frequency: parsed.frequency,
    weekdays:
      parsed.frequency === "WEEKDAYS" && parsed.weekdays?.length
        ? [...parsed.weekdays].sort((a, b) => a - b).join(",")
        : null,
    timesPerWeek: parsed.frequency === "X_PER_WEEK" ? (parsed.timesPerWeek ?? null) : null,
    // unidade/meta/vezes por dia só fazem sentido em hábitos numéricos
    timesPerDay: tracksNumbers ? (parsed.timesPerDay ?? null) : null,
    unit: tracksNumbers ? parsed.unit || null : null,
    goal: tracksNumbers ? (parsed.goal ?? null) : null,
    color: parsed.color,
    priority: parsed.priority,
    listId: parsed.listId || null,
  };
}

export async function createHabit(values: HabitFormValues) {
  const data = buildHabitData(values);
  await prisma.habit.create({
    data: { ...data, startDate: data.category === "QUIT" ? new Date() : null },
  });
  refreshApp();
}

/** Editar NÃO mexe no startDate: senão renomear um hábito de "parar" zeraria a contagem. */
export async function updateHabit(id: string, values: HabitFormValues) {
  await prisma.habit.update({ where: { id }, data: buildHabitData(values) });
  refreshApp();
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  refreshApp();
}

export async function togglePinHabit(id: string, pinned: boolean) {
  await prisma.habit.update({ where: { id }, data: { pinned } });
  refreshApp();
}

export async function archiveHabit(id: string) {
  await prisma.habit.update({ where: { id }, data: { active: false } });
  refreshApp();
}

export async function restoreHabit(id: string) {
  await prisma.habit.update({ where: { id }, data: { active: true } });
  refreshApp();
}

export async function createHabitList(name: string) {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 40) throw new Error("Nome de lista inválido.");
  const list = await prisma.habitList.create({ data: { name: trimmed } });
  refreshApp();
  return list;
}

/** Marca/desmarca um hábito simples (checklist) como feito num dia */
export async function toggleHabitLog(habitId: string, date: Date, completed: boolean) {
  const day = toDateOnly(date);
  const data = { completed, count: completed ? 1 : 0, loggedAt: new Date() };

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: day } },
    update: data,
    create: { habitId, date: day, ...data },
  });
  refreshApp();
}

/** Soma/subtrai 1 na contagem do dia (hábitos que podem ser feitos várias vezes). */
async function adjustHabitCount(habitId: string, date: Date, delta: 1 | -1) {
  const day = toDateOnly(date);

  await prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findUnique({ where: { id: habitId }, select: { timesPerDay: true } });
    if (!habit) return;

    const existing = await tx.habitLog.findUnique({
      where: { habitId_date: { habitId, date: day } },
    });
    const count = Math.max((existing?.count ?? 0) + delta, 0);
    const data = { count, completed: count >= (habit.timesPerDay ?? 1), loggedAt: new Date() };

    await tx.habitLog.upsert({
      where: { habitId_date: { habitId, date: day } },
      update: data,
      create: { habitId, date: day, ...data },
    });
  });
  refreshApp();
}

export async function incrementHabitCount(habitId: string, date: Date) {
  await adjustHabitCount(habitId, date, 1);
}

export async function decrementHabitCount(habitId: string, date: Date) {
  await adjustHabitCount(habitId, date, -1);
}

/** Registra um valor num hábito de medição (Peso corporal, Humor) num dia específico */
export async function recordHabitValue(habitId: string, date: Date, value: number, notes?: string) {
  if (!Number.isFinite(value)) throw new Error("Valor inválido.");
  const day = toDateOnly(date);
  const data = { value, completed: true, notes: notes?.trim() || null, loggedAt: new Date() };

  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: day } },
    update: data,
    create: { habitId, date: day, ...data },
  });
  refreshApp();
}

/** Zera a contagem de um hábito de "parar" (recaída): recomeça a contar a partir de agora */
export async function resetQuitStreak(habitId: string) {
  await prisma.habit.update({ where: { id: habitId }, data: { startDate: new Date() } });
  refreshApp();
}
