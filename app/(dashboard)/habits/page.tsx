import { Suspense } from "react";
import { HabitList } from "@/features/habits/habit-list";

export default function HabitsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hábitos</h1>
      <p className="text-muted-foreground mt-1">
        Gerencie seus hábitos. Para criar um novo, use o botão + na Visão de hoje.
      </p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Carregando...</p>}>
        <HabitList />
      </Suspense>
    </div>
  );
}