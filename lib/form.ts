import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodTypeAny } from "zod";

/** zodResolver já tipado com os valores do formulário (evita `as any` espalhado). */
export function typedResolver<T extends FieldValues>(schema: ZodTypeAny): Resolver<T> {
  return zodResolver(schema) as unknown as Resolver<T>;
}
