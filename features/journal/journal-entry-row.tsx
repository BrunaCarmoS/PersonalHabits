"use client";

import { useTransition } from "react";
import { StickyNote, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deleteActivityEntry } from "./actions";
import { formatTime } from "@/lib/dates";
import type { ActivityEntry } from "./types";

const KIND_LABELS: Record<string, string> = {
  habit_created: "Hábito criado",
  task_created: "Tarefa criada",
};

export function JournalEntryRow({ entry }: { entry: ActivityEntry }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const isPermanent = entry.kind === "habit_created" || entry.kind === "task_created";
    const message = isPermanent
      ? `Isso vai apagar "${entry.title}" para sempre, incluindo todo o histórico dele. Tem certeza?`
      : "Remover este registro do histórico?";

    if (!window.confirm(message)) return;
    startTransition(() => deleteActivityEntry(entry.kind, entry.sourceId));
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 group">
      {entry.kind === "note" ? (
        <StickyNote className="h-4 w-4 text-muted-foreground shrink-0" />
      ) : entry.kind === "habit_created" || entry.kind === "task_created" ? (
        <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
      ) : (
        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{entry.title}</p>
        {entry.notes && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.notes}</p>
        )}
      </div>

      {(entry.kind === "habit_created" || entry.kind === "task_created") && (
        <Badge variant="outline" className="text-xs shrink-0">
          {KIND_LABELS[entry.kind]}
        </Badge>
      )}

      {entry.kind === "task" && (
        <Badge variant="outline" className="text-xs shrink-0 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Concluída
        </Badge>
      )}

      {entry.kind === "habit" && entry.count != null && entry.count > 0 && (
        <Badge variant="outline" className="text-xs shrink-0">
          {entry.count} {entry.count === 1 ? "vez" : "vezes"}
        </Badge>
      )}

      {entry.tagLabel && (
        <Badge variant="secondary" className="text-xs shrink-0">
          {entry.tagLabel}
        </Badge>
      )}

      {entry.value != null && (
        <Badge variant="outline" className="text-xs shrink-0">
          {entry.value} {entry.unit}
        </Badge>
      )}

      <span className="text-xs text-muted-foreground shrink-0">{formatTime(entry.timestamp)}</span>

      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Remover do histórico"
        aria-label="Remover do histórico"
        className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}