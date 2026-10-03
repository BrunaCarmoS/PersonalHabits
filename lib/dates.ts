import {
  addDays, addMonths, differenceInCalendarDays, eachDayOfInterval, endOfDay, endOfMonth,
  format, isSameDay, isSameMonth as isSameMonthFns, isToday as isTodayFns,
  isYesterday as isYesterdayFns, startOfDay, startOfMonth, startOfWeek, subDays, subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEK_OPTIONS = { weekStartsOn: 0 } as const; // semana começa no domingo

/* ---------- Dia "cheio" ---------- */
export const toDateOnly = (date: Date): Date => startOfDay(date);
export const toEndOfDay = (date: Date): Date => endOfDay(date);
export const plusDays = (date: Date, days: number): Date => addDays(date, days);
export const nextDay = (date: Date): Date => addDays(date, 1);
export const previousDay = (date: Date): Date => subDays(date, 1);
export const daysBefore = (date: Date, days: number): Date => subDays(date, days);
export const getWeekStart = (date: Date): Date => startOfWeek(date, WEEK_OPTIONS);

/** Quantos dias de calendário separam `later` de `earlier` (ignora a hora). */
export const calendarDaysBetween = (later: Date, earlier: Date): number =>
  differenceInCalendarDays(later, earlier);

export const isToday = (date: Date): boolean => isTodayFns(date);
export const isSameDate = (a: Date, b: Date): boolean => isSameDay(a, b);
export const isSameMonth = (date: Date, ref: Date): boolean => isSameMonthFns(date, ref);

/* ---------- Parâmetros de URL ---------- */
const DATE_PARAM = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PARAM = /^(\d{4})-(0[1-9]|1[0-2])$/;

export const toDateParam = (date: Date): string => format(date, "yyyy-MM-dd");
export const toMonthParam = (date: Date): string => format(date, "yyyy-MM");

/** "2026-09-30" → Date local à meia-noite. Retorna null se for inválida (ex.: 2026-02-31). */
export function parseDateParamStrict(param: string | undefined): Date | null {
  const match = param ? DATE_PARAM.exec(param) : null;
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  const roundTrips =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return roundTrips ? date : null;
}

/** Igual à versão estrita, mas cai em "hoje" se a URL vier quebrada. */
export function parseDateParam(param: string | undefined): Date {
  return parseDateParamStrict(param) ?? startOfDay(new Date());
}

export function parseMonthParam(param: string | undefined): Date {
  const match = param ? MONTH_PARAM.exec(param) : null;
  if (!match) return startOfMonth(new Date());
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

/* ---------- Formatação ---------- */
export const formatShortDate = (date: Date) => format(date, "d MMM", { locale: ptBR });
export const formatWeekdayShort = (date: Date) =>
  format(date, "EEE", { locale: ptBR }).replace(".", "");
export const formatTime = (date: Date) => format(date, "HH:mm");
export const formatMonthLabel = (date: Date) => format(date, "MMMM yyyy", { locale: ptBR });
export const formatDayLabel = (date: Date) => format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

export function formatDateHeader(date: Date): string {
  if (isTodayFns(date)) return "Hoje";
  if (isYesterdayFns(date)) return "Ontem";
  return format(date, "d 'de' MMMM", { locale: ptBR });
}

/* ---------- Grades ---------- */
export function getWeekDays(referenceDate: Date = new Date()): Date[] {
  const start = getWeekStart(referenceDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getMonthGrid(referenceDate: Date): Date[] {
  const gridStart = getWeekStart(startOfMonth(referenceDate));
  const gridEnd = addDays(getWeekStart(endOfMonth(referenceDate)), 6);
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export const nextMonth = (date: Date): Date => addMonths(date, 1);
export const previousMonth = (date: Date): Date => subMonths(date, 1);

/** Semanas (colunas do heatmap) terminando na semana de `referenceDate`. */
export function getPastWeeksGrid(weeksCount: number, referenceDate: Date = new Date()): Date[][] {
  const firstWeek = subDays(getWeekStart(referenceDate), (weeksCount - 1) * 7);
  return Array.from({ length: weeksCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(firstWeek, w * 7 + d))
  );
}

export const getPastYearGrid = (referenceDate: Date = new Date()): Date[][] =>
  getPastWeeksGrid(53, referenceDate);
