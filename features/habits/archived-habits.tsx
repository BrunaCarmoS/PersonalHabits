import { ArchivedHabitRow } from "./archived-habit-row";
import { getArchivedHabits } from "./queries";

/** Lista (recolhível) dos hábitos arquivados, com opção de restaurar. */
export async function ArchivedHabits() {
  const habits = await getArchivedHabits();
  if (habits.length === 0) return null;

  return (
    <details className="mt-10">
      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
        Arquivados · {habits.length}
      </summary>
      <p className="text-xs text-muted-foreground mt-2">
        Hábitos arquivados não aparecem nas telas, mas o histórico fica guardado. Restaure para voltar a usá-los.
      </p>
      <div className="space-y-2 mt-3">
        {habits.map((habit) => (
          <ArchivedHabitRow key={habit.id} habit={habit} />
        ))}
      </div>
    </details>
  );
}
