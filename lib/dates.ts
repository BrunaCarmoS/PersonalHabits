import {
  format,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfWeek,
  addDays,
  subDays,
  isToday as isTodayFns,
  isYesterday as isYesterdayFns,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth as isSameMonthFns,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function toDateOnly(date: Date): Date {
  return startOfDay(date);
}

export function toEndOfDay(date: Date): Date {
  return endOfDay(date);
}

export function formatShortDate(date: Date): string {
  return format(date, "d MMM", { locale: ptBR });
}

export function formatWeekdayShort(date: Date): string {
  return format(date, "EEE", { locale: ptBR }).replace(".", "");
}

export function getWeekDays(referenceDate: Date = new Date()): Date[] {
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isToday(date: Date): boolean {
  return isTodayFns(date);
}

export function isSameDate(a: Date, b: Date): boolean {
  return isSameDay(a, b);
}

export function formatDateHeader(date: Date): string {
  if (isTodayFns(date)) return "Hoje";
  if (isYesterdayFns(date)) return "Ontem";
  return format(date, "d 'de' MMMM", { locale: ptBR });
}

export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

export function getMonthGrid(referenceDate: Date): Date[] {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = addDays(startOfWeek(monthEnd, { weekStartsOn: 0 }), 6);
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function isSameMonth(date: Date, referenceDate: Date): boolean {
  return isSameMonthFns(date, referenceDate);
}

export function formatMonthLabel(date: Date): string {
  return format(date, "MMMM yyyy", { locale: ptBR });
}

export function nextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function previousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function parseMonthParam(param: string | undefined): Date {
  if (!param) return new Date();
  const [year, month] = param.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function toMonthParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function nextDay(date: Date): Date {
  return addDays(date, 1);
}

export function previousDay(date: Date): Date {
  return subDays(date, 1);
}

export function toDateParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDateParam(param: string | undefined): Date {
  if (!param) return new Date();
  return new Date(param + "T00:00:00");
}

export function formatDayLabel(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

export function getPastWeeksGrid(weeksCount: number, referenceDate: Date = new Date()): Date[][] {
  const end = startOfWeek(referenceDate, { weekStartsOn: 0 });
  const start = subDays(end, weeksCount * 7 - 7);

  const weeks: Date[][] = [];
  let cursor = start;
  for (let w = 0; w < weeksCount; w++) {
    const week = Array.from({ length: 7 }, (_, d) => addDays(cursor, d));
    weeks.push(week);
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

export function getPastYearGrid(referenceDate: Date = new Date()): Date[][] {
  return getPastWeeksGrid(53, referenceDate);
}