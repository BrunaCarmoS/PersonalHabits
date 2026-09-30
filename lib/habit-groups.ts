/** Hábitos "outros" de medição: você registra um valor ao longo do tempo (peso, humor, quanto escreveu) */
export function isMeasurementHabit(category: string): boolean {
  return category === "WEIGHT" || category === "MOOD" || category === "DIARY";
}

/** Hábitos de "parar": mostram há quantos dias você está sem fazer aquilo */
export function isQuitHabit(category: string): boolean {
  return category === "QUIT";
}