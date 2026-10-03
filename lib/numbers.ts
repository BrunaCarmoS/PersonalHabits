/** Para `register(nome, { setValueAs })`: campo numérico vazio vira `undefined` (e não 0). */
export function optionalNumber(value: unknown): number | undefined {
  if (value === "" || value == null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}
