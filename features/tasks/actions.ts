"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { taskFormSchema, type TaskFormValues } from "./validation";

export async function createTask(values: TaskFormValues) {
  const parsed = taskFormSchema.parse(values);

  await prisma.task.create({
    data: {
      title: parsed.title,
      description: parsed.description || null,
      dueDate: parsed.dueDate ?? null,
      priority: parsed.priority,
      listId: parsed.listId || null,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/today");
}

export async function toggleTaskCompleted(id: string, completed: boolean) {
  await prisma.task.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  revalidatePath("/today");
  revalidatePath("/habits");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/today");
  revalidatePath("/habits");
}

export async function updateTask(id: string, values: TaskFormValues) {
  const parsed = taskFormSchema.parse(values);

  await prisma.task.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description || null,
      dueDate: parsed.dueDate ?? null,
      priority: parsed.priority,
      listId: parsed.listId || null,
    },
  });

  revalidatePath("/today");
  revalidatePath("/tasks");
  revalidatePath("/calendar");
}