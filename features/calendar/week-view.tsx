import Link from "next/link";
import { Suspense } from "react";
import { DayAgenda } from "./day-agenda";
import { getWeekDays, formatWeekdayShort, isToday, isSameDate, toDateParam } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function WeekView({ date }: { date: Date }) {
  const weekDays = getWeekDays(date);

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-6">
        {weekDays.map((day) => {
          const isSelected = isSameDate(day, date);
          return (
            <Link
              key={day.toISOString()}
              href={`/calendar?view=weekly&date=${toDateParam(day)}`}
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

      <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
        <DayAgenda date={date} />
      </Suspense>
    </div>
  );
}