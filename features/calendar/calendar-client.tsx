"use client";

import { useState } from "react";
import { WEEKDAY_LABELS } from "@/lib/constants";
import { isSameDate, isSameMonth, isToday } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { HabitRow, UntimedTaskRow } from "./day-agenda-items";

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
  // Hoje, se estiver no mês exibido; senão o dia 1.
  const [selected, setSelected] = useState<Date>(() =>
    isSameMonth(new Date(), month) ? new Date() : month
  );

  const selectedDay = days.find((d) => isSameDate(d.date, selected));
  const isEmpty = !selectedDay || (selectedDay.habits.length === 0 && selectedDay.tasks.length === 0);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-xs font-medium text-muted-foreground text-center py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const total = day.habits.length + day.tasks.length;
          return (
            <button
              key={day.date.toISOString()}
              onClick={() => setSelected(day.date)}
              className={cn(
                "min-h-24 rounded-lg border p-2 flex flex-col gap-1 text-left transition-colors",
                !isSameMonth(day.date, month) && "opacity-40",
                isToday(day.date) && "border-primary",
                isSameDate(day.date, selected) ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
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
              {total > 6 && <span className="text-[10px] text-muted-foreground mt-auto">+{total - 6}</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <h3 className="font-serif text-lg mb-3">
          {selected.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
        </h3>

        {isEmpty ? (
          <p className="text-sm text-muted-foreground">Nada agendado para esse dia.</p>
        ) : (
          <div className="space-y-4">
            {selectedDay.tasks.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Tarefas</p>
                <div className="space-y-1.5">
                  {selectedDay.tasks.map((task) => (
                    <UntimedTaskRow key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
            {selectedDay.habits.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Hábitos</p>
                <div className="space-y-1.5">
                  {selectedDay.habits.map((habit) => (
                    <HabitRow key={habit.id} habit={habit} date={selected} />
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
