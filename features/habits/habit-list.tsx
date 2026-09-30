import { getHabits, getHabitLists } from "./queries";
import { HabitCard } from "./habit-card";

export async function HabitList() {
  const [habits, lists] = await Promise.all([getHabits(), getHabitLists()]);

  if (habits.length === 0) {
    return (
      <p className="text-muted-foreground text-sm mt-8 text-center">
        Nenhum hábito ainda. Crie o primeiro na Visão de hoje.
      </p>
    );
  }

  return (
    <div className="space-y-2 mt-6">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} lists={lists} />
      ))}
    </div>
  );
}