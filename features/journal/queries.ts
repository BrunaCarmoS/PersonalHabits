import { prisma } from "@/lib/prisma";
import { isMeasurementHabit } from "@/lib/habit-groups";

export interface ActivityEntry {
  id: string;
  kind: "habit" | "task" | "measurement" | "note" | "habit_created" | "task_created";
  title: string;
  timestamp: Date;
  color: string;
  value: number | null;
  unit: string | null;
  count: number | null;
  notes: string | null;
  tagLabel: string | null;
}

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
    prisma.habit.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  const habitEntries: ActivityEntry[] = habitLogs.map((log) => ({
    id: `habit-${log.id}`,
    kind: isMeasurementHabit(log.habit.category) ? "measurement" : "habit",
    title: log.habit.name,
    timestamp: log.loggedAt,
    color: log.habit.color,
    value: log.value,
    unit: log.habit.unit,
    count: log.count,
    notes: log.notes,
    tagLabel: null,
  }));

  const taskEntries: ActivityEntry[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    kind: "task",
    title: task.title,
    timestamp: task.completedAt as Date,
    color: "#94a3b8",
    value: null,
    unit: null,
    count: null,
    notes: task.description,
    tagLabel: null,
  }));

  const noteEntries: ActivityEntry[] = notes.map((note) => ({
    id: `note-${note.id}`,
    kind: "note",
    title: note.content,
    timestamp: note.createdAt,
    color: note.habit?.color ?? "#a1a1aa",
    value: null,
    unit: null,
    count: null,
    notes: null,
    tagLabel: note.habit?.name ?? note.task?.title ?? note.list?.name ?? null,
  }));

  const habitCreatedEntries: ActivityEntry[] = habitsCreated.map((habit) => ({
    id: `habit-created-${habit.id}`,
    kind: "habit_created",
    title: habit.name,
    timestamp: habit.createdAt,
    color: habit.color,
    value: null,
    unit: null,
    count: null,
    notes: null,
    tagLabel: null,
  }));

  const taskCreatedEntries: ActivityEntry[] = tasksCreated.map((task) => ({
    id: `task-created-${task.id}`,
    kind: "task_created",
    title: task.title,
    timestamp: task.createdAt,
    color: "#94a3b8",
    value: null,
    unit: null,
    count: null,
    notes: null,
    tagLabel: null,
  }));

  return [...habitEntries, ...taskEntries, ...noteEntries, ...habitCreatedEntries, ...taskCreatedEntries]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

export function groupByDate(entries: ActivityEntry[]): [string, ActivityEntry[]][] {
  const groups = new Map<string, ActivityEntry[]>();
  for (const entry of entries) {
    const key = entry.timestamp.toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries());
}
