import Link from "next/link";
import { cn } from "@/lib/utils";
import { toDateParam, toMonthParam } from "@/lib/dates";

const TABS = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
];

export function CalendarViewTabs({
  current,
  date,
}: {
  current: string;
  date: Date;
}) {
  return (
    <div className="flex gap-1 rounded-full border bg-card p-1 w-fit">
      {TABS.map((tab) => (
        <Link
          key={tab.value}
          href={`/calendar?view=${tab.value}&date=${toDateParam(date)}&month=${toMonthParam(date)}`}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
            current === tab.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}