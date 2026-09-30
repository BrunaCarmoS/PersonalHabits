import { Suspense } from "react";
import { CalendarGrid } from "@/features/calendar/calendar-grid";
import { CalendarViewTabs } from "@/features/calendar/calendar-view-tabs";
import { DayView } from "@/features/calendar/day-view";
import { WeekView } from "@/features/calendar/week-view";
import { parseMonthParam, parseDateParam } from "@/lib/dates";

type CalendarViewMode = "daily" | "weekly" | "monthly";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const view = (params.view ?? "monthly") as CalendarViewMode;
  const month = parseMonthParam(params.month);
  const date = parseDateParam(params.date);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Calendário</h1>
          <p className="text-muted-foreground mt-1">Visão dos seus hábitos e tarefas.</p>
        </div>
        <CalendarViewTabs current={view} date={date} />
      </div>

      {view === "daily" && <DayView date={date} />}
      {view === "weekly" && <WeekView date={date} />}
      {view === "monthly" && (
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
            <CalendarGrid month={month} />
          </Suspense>
        </div>
      )}
    </div>
  );
}