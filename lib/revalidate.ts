import { revalidatePath } from "next/cache";

/** App pequeno e pessoal: revalida tudo de uma vez para nenhuma tela ficar desatualizada. */
export function refreshApp() {
  revalidatePath("/", "layout");
}
