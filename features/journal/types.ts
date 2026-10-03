export const ACTIVITY_KINDS = [
  "habit",
  "task",
  "measurement",
  "note",
  "habit_created",
  "task_created",
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export interface ActivityEntry {
  /** Chave única para o React (kind + id). */
  id: string;
  /** Id real do registro no banco. */
  sourceId: string;
  kind: ActivityKind;
  title: string;
  timestamp: Date;
  color: string;
  value: number | null;
  unit: string | null;
  count: number | null;
  notes: string | null;
  tagLabel: string | null;
}
