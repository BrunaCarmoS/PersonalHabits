import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayAgenda } from "./day-agenda";
import { formatDayLabel, nextDay, previousDay, toDateParam } from "@/lib/dates";

export function DayView({ date }: { date: Date }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl capitalize">{formatDayLabel(date)}</h2>
        <div className="flex gap-1">
          <Link
            href={`/calendar?view=daily&date=${toDateParam(previousDay(date))}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href={`/calendar?view=daily&date=${toDateParam(new Date())}`}
            className="h-8 px-3 flex items-center justify-center rounded-lg border text-sm hover:bg-muted"
          >
            Hoje
          </Link>
          <Link
            href={`/calendar?view=daily&date=${toDateParam(nextDay(date))}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
        <DayAgenda date={date} />
      </Suspense>
    </div>
  );
}