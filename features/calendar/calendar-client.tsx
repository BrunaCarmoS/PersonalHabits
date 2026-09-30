"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { isSameDate, isToday, isSameMonth } from "@/lib/dates";
import { toggleHabitLog } from "@/features/habits/actions";
import { toggleTaskCompleted } from "@/features/tasks/actions";
import { Check } from "lucide-react";

const WEEKDAY_HEADERS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface DayHabit {
  id: string;
  name: string;
  color: string;
  completed: boolean;
}

export interface DayTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayData {
  date: Date;
  habits: DayHabit[];
  tasks: DayTask[];
}

export function CalendarClient({ days, month }: { days: DayData[]; month: Date }) {
  const [selected, setSelected] = useState<Date>(new Date());

  const selectedDay = days.find((d) => isSameDate(d.date, selected));

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAY_HEADERS.map((label) => (
          <div key={label} className="text-xs font-medium text-muted-foreground text-center py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const inMonth = isSameMonth(day.date, month);
          const total = day.habits.length + day.tasks.length;
          const isSelected = isSameDate(day.date, selected);

          return (
            <button
              key={day.date.toISOString()}
              onClick={() => setSelected(day.date)}
              className={cn(
                "min-h-24 rounded-lg border p-2 flex flex-col gap-1 text-left transition-colors",
                !inMonth && "opacity-40",
                isToday(day.date) && "border-primary",
                isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
              )}
            >
              <span className={cn("text-xs font-medium", isToday(day.date) && "text-primary")}>
                {day.date.getDate()}
              </span>
              <div className="flex flex-wrap gap-1">
                {day.habits.slice(0, 3).map((h) => (
                  <span
                    key={h.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: h.color, opacity: h.completed ? 1 : 0.3 }}
                    title={h.name}
                  />
                ))}
                {day.tasks.slice(0, 3).map((t) => (
                  <span
                    key={t.id}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    style={{ opacity: t.completed ? 1 : 0.3 }}
                    title={t.title}
                  />
                ))}
              </div>
              {total > 6 && (
                <span className="text-[10px] text-muted-foreground mt-auto">+{total - 6}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <h3 className="font-serif text-lg mb-3">
          {selected.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
        </h3>

        {!selectedDay || (selectedDay.habits.length === 0 && selectedDay.tasks.length === 0) ? (
          <p className="text-sm text-muted-foreground">Nada agendado para esse dia.</p>
        ) : (
          <div className="space-y-4">
            {selectedDay.tasks.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Tarefas</p>
                <div className="space-y-1.5">
                  {selectedDay.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTaskCompleted(task.id, !task.completed)}
                      className="w-full flex items-center gap-2 rounded-md border px-3 py-2 text-left hover:bg-muted/50"
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          task.completed ? "border-transparent bg-foreground" : "border-muted-foreground/40"
                        )}
                      >
                        {task.completed && <Check className="h-2.5 w-2.5 text-background" />}
                      </span>
                      <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDay.habits.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Hábitos</p>
                <div className="space-y-1.5">
                  {selectedDay.habits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabitLog(habit.id, selected, !habit.completed)}
                      className="w-full flex items-center gap-2 rounded-md border px-3 py-2 text-left hover:bg-muted/50"
                    >
                      <span
                        className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: habit.completed ? habit.color : "transparent",
                          borderColor: habit.completed ? "transparent" : undefined,
                        }}
                      >
                        {habit.completed && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <span className={cn("text-sm", habit.completed && "line-through text-muted-foreground")}>
                        {habit.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}