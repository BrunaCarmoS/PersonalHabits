import { z } from "zod";
import { parseDateParamStrict } from "@/lib/dates";
import { PRIORITIES } from "@/lib/types";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Digite um título").max(80),
  description: z.string().trim().max(300).optional(),
  /** Dia no formato yyyy-MM-dd; vazio = sem data. */
  dueDate: z
    .string()
    .refine((value) => parseDateParamStrict(value) !== null, "Data inválida")
    .optional(),
  priority: z.enum(PRIORITIES).default("MEDIUM"),
  listId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
