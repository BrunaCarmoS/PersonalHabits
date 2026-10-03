import { toDateParam } from "./dates";

/** Conjunto de dias ("yyyy-MM-dd") em que o hábito foi concluído. */
export function completedDayKeys(logs: { date: Date; completed: boolean }[]): Set<string> {
  return new Set(logs.filter((log) => log.completed).map((log) => toDateParam(log.date)));
}
