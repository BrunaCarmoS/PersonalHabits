import { getActivityLog, groupByDate } from "./queries";
import { formatDateHeader } from "@/lib/dates";
import { JournalEntryRow } from "./journal-entry-row";

export async function JournalFeed() {
  const entries = await getActivityLog();
  const groups = groupByDate(entries);

  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-8 text-center">
        Nada registrado ainda. Conforme você criar e marcar hábitos e tarefas, eles aparecem aqui.
      </p>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {groups.map(([dateKey, items]) => (
        <div key={dateKey}>
          <h2 className="font-serif text-lg mb-3">{formatDateHeader(items[0].timestamp)}</h2>
          <div className="space-y-2">
            {items.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}