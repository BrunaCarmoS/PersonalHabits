import { describe, expect, it } from "vitest";
import { parseDateParamStrict, parseMonthParam, getPastWeeksGrid, toDateParam } from "./dates";
import { calculateStreak } from "./streak";
import { calculateCompletionRate } from "./habit-stats";
import { completedDayKeys } from "./habit-logs";
import { isHabitScheduledForDate } from "./habit-schedule";
import { optionalNumber } from "./numbers";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const logs = (...days: Date[]) => days.map((date) => ({ date, completed: true }));
const daily = { frequency: "DAILY" as const, weekdays: null, timesPerWeek: null };

describe("parseDateParamStrict", () => {
  it("aceita datas válidas", () => expect(toDateParam(parseDateParamStrict("2026-09-30")!)).toBe("2026-09-30"));
  it("rejeita lixo e datas impossíveis", () => {
    expect(parseDateParamStrict("lixo")).toBeNull();
    expect(parseDateParamStrict("2026-02-31")).toBeNull();
    expect(parseDateParamStrict(undefined)).toBeNull();
  });
  it("mês inválido cai no mês atual", () => {
    expect(parseMonthParam("2026-13").getDate()).toBe(1);
    expect(toDateParam(parseMonthParam("2026-03"))).toBe("2026-03-01");
  });
});

describe("getPastWeeksGrid", () => {
  it("termina na semana de referência, domingo a sábado", () => {
    const grid = getPastWeeksGrid(3, d(2026, 9, 30)); // quarta
    expect(grid).toHaveLength(3);
    expect(toDateParam(grid[2][0])).toBe("2026-09-27");
    expect(toDateParam(grid[0][0])).toBe("2026-09-13");
  });
});

describe("calculateStreak (diário)", () => {
  const ref = d(2026, 9, 30);
  it("hoje em aberto não quebra a sequência", () =>
    expect(calculateStreak(daily, logs(d(2026, 9, 29), d(2026, 9, 28)), ref)).toBe(2));
  it("conta hoje quando feito", () =>
    expect(calculateStreak(daily, logs(d(2026, 9, 30), d(2026, 9, 29)), ref)).toBe(2));
  it("buraco quebra", () =>
    expect(calculateStreak(daily, logs(d(2026, 9, 29), d(2026, 9, 27)), ref)).toBe(1));
  it("dias específicos pulam os não agendados", () => {
    const seg = { frequency: "WEEKDAYS" as const, weekdays: "1,3", timesPerWeek: null }; // seg e qua
    expect(calculateStreak(seg, logs(d(2026, 9, 30), d(2026, 9, 28), d(2026, 9, 23)), ref)).toBe(3);
  });
  it("NÃO trava em loop infinito com dias específicos vazios", () => {
    const vazio = { frequency: "WEEKDAYS" as const, weekdays: null, timesPerWeek: null };
    expect(calculateStreak(vazio, [], ref)).toBe(0);
  });
});

describe("calculateStreak (X por semana)", () => {
  const h = { frequency: "X_PER_WEEK" as const, weekdays: null, timesPerWeek: 2 };
  const ref = d(2026, 9, 30); // quarta; semana começa em 27/09
  it("conta semanas em que a meta foi batida", () => {
    const l = logs(d(2026, 9, 20), d(2026, 9, 22), d(2026, 9, 13), d(2026, 9, 15));
    expect(calculateStreak(h, l, ref)).toBe(2);
  });
  it("semana atual incompleta não quebra", () =>
    expect(calculateStreak(h, logs(d(2026, 9, 30), d(2026, 9, 21), d(2026, 9, 22)), ref)).toBe(1));
  it("semana atual cumprida soma", () =>
    expect(calculateStreak(h, logs(d(2026, 9, 28), d(2026, 9, 29)), ref)).toBe(1));
});

describe("calculateCompletionRate", () => {
  const ref = d(2026, 9, 30);
  const inicio = d(2025, 10, 1);
  it("hábito criado hoje não é 0% por dias anteriores", () => {
    const h = { ...daily, createdAt: d(2026, 9, 30) };
    expect(calculateCompletionRate(h, completedDayKeys(logs(d(2026, 9, 30))), inicio, d(2026, 10, 3), ref)).toBe(100);
  });
  it("dias futuros da semana não contam", () => {
    const h = { ...daily, createdAt: d(2026, 9, 27) };
    const done = completedDayKeys(logs(d(2026, 9, 27), d(2026, 9, 28)));
    expect(calculateCompletionRate(h, done, inicio, d(2026, 10, 3), ref)).toBe(50); // 2 de 4
  });
  it("X por semana: semana atual em andamento é ignorada", () => {
    const h = { frequency: "X_PER_WEEK" as const, weekdays: null, timesPerWeek: 3, createdAt: d(2026, 9, 1) };
    const done = completedDayKeys(logs(d(2026, 9, 14), d(2026, 9, 15), d(2026, 9, 16), d(2026, 9, 28)));
    const rate = calculateCompletionRate(h, done, inicio, d(2026, 10, 3), ref);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThanOrEqual(100);
  });
});

describe("misc", () => {
  it("campo numérico vazio vira undefined", () => {
    expect(optionalNumber("")).toBeUndefined();
    expect(optionalNumber("8")).toBe(8);
    expect(optionalNumber(undefined)).toBeUndefined();
  });
  it("dias específicos", () => {
    const h = { frequency: "WEEKDAYS" as const, weekdays: "0,6" };
    expect(isHabitScheduledForDate(h, d(2026, 9, 27))).toBe(true); // domingo
    expect(isHabitScheduledForDate(h, d(2026, 9, 30))).toBe(false);
  });
});
