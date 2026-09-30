"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toMonthParam } from "@/lib/dates";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function MonthYearPicker({ month }: { month: Date }) {
  const router = useRouter();
  const currentYear = month.getFullYear();
  const currentMonthIndex = month.getMonth();

  // Mostra uma faixa de anos: 5 antes e 5 depois do ano atual do calendário
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  function goTo(year: number, monthIndex: number) {
    const newDate = new Date(year, monthIndex, 1);
    router.push(`/calendar?month=${toMonthParam(newDate)}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(currentMonthIndex)}
        onValueChange={(value) => goTo(currentYear, Number(value))}
      >
        <SelectTrigger className="w-36 font-serif text-lg border-none shadow-none px-2 h-auto capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, index) => (
            <SelectItem key={name} value={String(index)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(currentYear)}
        onValueChange={(value) => goTo(Number(value), currentMonthIndex)}
      >
        <SelectTrigger className="w-24 font-serif text-lg border-none shadow-none px-2 h-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}