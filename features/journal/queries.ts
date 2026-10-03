import { prisma } from "@/lib/prisma";
import { isMeasurementHabit } from "@/lib/habit-groups";
import type { ActivityEntry } from "./types";

const TASK_COLOR = "#94a3b8";
const EMPTY = { value: null, unit: null, count: null, notes: null, tagLabel: null };

export async function getActivityLog(limit = 300): Promise<ActivityEntry[]> {
  const [habitLogs, tasks, notes, habitsCreated, tasksCreated] = await Promise.all([
    prisma.habitLog.findMany({
      where: { completed: true },
      orderBy: { loggedAt: "desc" },
      take: limit,
      include: { habit: true },
    }),
    prisma.task.findMany({
      where: { completed: true, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: limit,
    }),
    prisma.journalEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { habit: true, task: true, list: true },
    }),
    prisma.habit.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: limit }),
    prisma.task.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
  ]);

  const entries: ActivityEntry[] = [
    ...habitLogs.map((log): ActivityEntry => {
      const kind = isMeasurementHabit(log.habit.category) ? "measurement" : "habit";
      return {
        ...EMPTY,
        id: `${kind}-${log.id}`,
        sourceId: log.id,
        kind,
        title: log.habit.name,
        timestamp: log.loggedAt,
        color: log.habit.color,
        value: log.value,
        unit: log.habit.unit,
        count: log.count,
        notes: log.notes,
      };
    }),
    ...tasks.map((task): ActivityEntry => ({
      ...EMPTY,
      id: `task-${task.id}`,
      sourceId: task.id,
      kind: "task",
      title: task.title,
      timestamp: task.completedAt as Date,
      color: TASK_COLOR,
      notes: task.description,
    })),
    ...notes.map((note): ActivityEntry => ({
      ...EMPTY,
      id: `note-${note.id}`,
      sourceId: note.id,
      kind: "note",
      title: note.content,
      timestamp: note.createdAt,
      color: note.habit?.color ?? "#a1a1aa",
      tagLabel: note.habit?.name ?? note.task?.title ?? note.list?.name ?? null,
    })),
    ...habitsCreated.map((habit): ActivityEntry => ({
      ...EMPTY,
      id: `habit_created-${habit.id}`,
      sourceId: habit.id,
      kind: "habit_created",
      title: habit.name,
      timestamp: habit.createdAt,
      color: habit.color,
    })),
    ...tasksCreated.map((task): ActivityEntry => ({
      ...EMPTY,
      id: `task_created-${task.id}`,
      sourceId: task.id,
      kind: "task_created",
      title: task.title,
      timestamp: task.createdAt,
      color: TASK_COLOR,
    })),
  ];

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
}

export function groupByDate(entries: ActivityEntry[]): [string, ActivityEntry[]][] {
  const groups = new Map<string, ActivityEntry[]>();
  for (const entry of entries) {
    const key = entry.timestamp.toDateString();
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return Array.from(groups.entries());
}
