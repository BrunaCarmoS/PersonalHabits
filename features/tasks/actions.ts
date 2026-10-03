"use server";

import { prisma } from "@/lib/prisma";
import { parseDateParam } from "@/lib/dates";
import { refreshApp } from "@/lib/revalidate";
import { taskFormSchema, type TaskFormValues } from "./validation";

function buildTaskData(values: TaskFormValues) {
  const parsed = taskFormSchema.parse(values);
  return {
    title: parsed.title,
    description: parsed.description || null,
    dueDate: parsed.dueDate ? parseDateParam(parsed.dueDate) : null,
    priority: parsed.priority,
    listId: parsed.listId || null,
  };
}

export async function createTask(values: TaskFormValues) {
  await prisma.task.create({ data: buildTaskData(values) });
  refreshApp();
}

export async function updateTask(id: string, values: TaskFormValues) {
  await prisma.task.update({ where: { id }, data: buildTaskData(values) });
  refreshApp();
}

export async function toggleTaskCompleted(id: string, completed: boolean) {
  await prisma.task.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  refreshApp();
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  refreshApp();
}
