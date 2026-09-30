import { NoteEditor } from "@/features/journal/note-editor";
import { getHabits, getHabitLists } from "@/features/habits/queries";
import { getTasks } from "@/features/tasks/queries";

export default async function NewNotePage() {
  const [habits, tasks, lists] = await Promise.all([getHabits(), getTasks(), getHabitLists()]);

  const tags = [
    ...habits.map((h) => ({ id: h.id, label: h.name, color: h.color, kind: "habit" as const })),
    ...tasks.map((t) => ({ id: t.id, label: t.title, color: "#94a3b8", kind: "task" as const })),
    ...lists.map((l) => ({ id: l.id, label: l.name, color: l.color, kind: "list" as const })),
  ];

  return <NoteEditor tags={tags} />;
}
