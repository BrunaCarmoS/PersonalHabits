"use client";

import { useState, useTransition } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordHabitValue } from "@/features/habits/actions";

interface MeasurementItemProps {
  habit: {
    id: string;
    name: string;
    color: string;
    unit: string | null;
    latestValue: number | null;
    logs: { date: Date; value: number | null }[];
  };
}

export function MeasurementItem({ habit }: MeasurementItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const chartData = [...habit.logs]
    .filter((l) => l.value != null)
    .reverse()
    .map((l, i) => ({ i, value: l.value }));

  function handleSave() {
    const num = Number(value);
    if (!value || isNaN(num)) return;
    startTransition(async () => {
      await recordHabitValue(habit.id, new Date(), num);
      setValue("");
      setEditing(false);
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: habit.color }} />
          <span className="text-sm font-medium">{habit.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-serif">
            {habit.latestValue != null ? `${habit.latestValue} ${habit.unit ?? ""}` : "—"}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing((v) => !v)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {editing && (
        <div className="flex gap-2 mt-3">
          <Input
            type="number"
            step="any"
            placeholder={`Novo valor (${habit.unit ?? ""})`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleSave} disabled={isPending}>
            Salvar
          </Button>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="h-16 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis domain={["auto", "auto"]} hide />
              <Line type="monotone" dataKey="value" stroke={habit.color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}