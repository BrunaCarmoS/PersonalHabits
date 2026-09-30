import Link from "next/link";
import { cn } from "@/lib/utils";
import { getWeekDays, formatWeekdayShort, isToday, isSameDate, toDateParam } from "@/lib/dates";

const VIEWS = [
  { value: "compact", label: "Compacta" },
  { value: "monthly", label: "Mensal" },
  { value: "yearly", label: "Anual" },
];

export function TodayHeader({
  currentView,
  selectedDate,
}: {
  currentView: string;
  selectedDate: Date;
}) {
  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-medium tracking-tight">Visão de hoje</h1>
        <div className="flex gap-1 rounded-full border bg-card p-1">
          {VIEWS.map((v) => (
            <Link
              key={v.value}
              href={`/today?view=${v.value}&date=${toDateParam(selectedDate)}`}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                currentView === v.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {v.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        {weekDays.map((day) => {
          const isSelected = isSameDate(day, selectedDate);
          return (
            <Link
              key={day.toISOString()}
              href={`/today?view=${currentView}&date=${toDateParam(day)}`}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs border transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : isToday(day)
                  ? "border-primary text-primary"
                  : "text-muted-foreground border-transparent hover:bg-muted"
              )}
            >
              <span>{formatWeekdayShort(day)}</span>
              <span className="text-base font-serif">{day.getDate()}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
