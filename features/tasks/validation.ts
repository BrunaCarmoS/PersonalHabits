import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Digite um título").max(80),
  description: z.string().max(300).optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  listId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;