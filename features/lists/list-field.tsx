"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createHabitList } from "@/features/habits/actions";
import type { ListOption } from "@/lib/types";

const NONE_VALUE = "__none__";

interface ListFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  lists: ListOption[];
}

/** Escolhe uma lista e permite criar uma nova ali mesmo (usado em hábitos e tarefas). */
export function ListField<T extends FieldValues>({ control, name, lists }: ListFieldProps<T>) {
  const { field } = useController({ control, name });
  const [created, setCreated] = useState<ListOption[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = [...lists, ...created.filter((c) => !lists.some((l) => l.id === c.id))];

  function cancel() {
    setAdding(false);
    setNewName("");
    setError(null);
  }

  async function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Digite um nome para a lista.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const list = await createHabitList(trimmed);
      setCreated((prev) => [...prev, { id: list.id, name: list.name }]);
      field.onChange(list.id); // já deixa a nova lista selecionada
      cancel();
    } catch {
      setError("Não foi possível criar a lista. Tente de novo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>Lista</Label>
      <Select
        value={field.value ? String(field.value) : ""}
        onValueChange={(value) => field.onChange(value === NONE_VALUE ? undefined : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Nenhuma lista" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>Nenhuma</SelectItem>
          {options.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {adding ? (
        <div className="flex gap-2">
          <Input
            autoFocus
            value={newName}
            disabled={saving}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              // Enter aqui cria a lista, não envia o formulário de fora
              if (e.key === "Enter") {
                e.preventDefault();
                void handleCreate();
              }
            }}
            placeholder="Nome da nova lista"
            className="h-8 text-sm"
          />
          <Button type="button" size="sm" onClick={handleCreate} disabled={saving}>
            {saving ? "Criando..." : "Criar"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={saving}>
            Cancelar
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Plus className="h-3 w-3" />
          Nova lista
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
