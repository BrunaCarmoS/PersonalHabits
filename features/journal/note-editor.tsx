"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createJournalNote } from "./actions";
import { formatTime, formatShortDate } from "@/lib/dates";

interface TagOption {
  id: string;
  label: string;
  color: string;
  kind: "habit" | "task" | "list";
}

const KIND_HEADERS: Record<string, string> = {
  habit: "Hábitos",
  task: "Tarefas",
  list: "Listas",
};

export function NoteEditor({ tags }: { tags: TagOption[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const now = new Date();

  const grouped = tags.reduce<Record<string, TagOption[]>>((acc, tag) => {
    (acc[tag.kind] ??= []).push(tag);
    return acc;
  }, {});

  async function handleSave() {
    if (!content.trim()) return;
    setIsSaving(true);

    const habitId = selectedTag?.kind === "habit" ? selectedTag.id : undefined;
    const taskId = selectedTag?.kind === "task" ? selectedTag.id : undefined;
    const listId = selectedTag?.kind === "list" ? selectedTag.id : undefined;

    try {
      await createJournalNote(content.trim(), habitId, taskId, listId);
      router.push("/journal");
    } catch {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between pb-4 border-b">
        <button
          onClick={() => router.push("/journal")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className="font-serif text-lg">Nova nota</p>
          <p className="text-xs text-muted-foreground">
            {formatShortDate(now)}, {formatTime(now)}
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground relative">
              <TagIcon className="h-5 w-5" />
              {selectedTag && (
                <span
                  className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedTag.color }}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-1 max-h-80 overflow-y-auto">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              >
                Remover etiqueta
              </button>
            )}
            {Object.entries(grouped).map(([kind, options]) => (
              <div key={kind}>
                <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                  {KIND_HEADERS[kind]}
                </p>
                {options.map((tag) => (
                  <button
                    key={`${tag.kind}-${tag.id}`}
                    onClick={() => setSelectedTag(tag)}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                    {tag.label}
                  </button>
                ))}
              </div>
            ))}
            {tags.length === 0 && (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">Nada disponível ainda.</p>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {selectedTag && (
        <div className="flex items-center gap-2 pt-3">
          <span
            className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1"
            style={{ backgroundColor: `${selectedTag.color}22`, color: selectedTag.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: selectedTag.color }} />
            {selectedTag.label}
          </span>
        </div>
      )}

      <Textarea
        placeholder="Texto"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none border-none shadow-none text-base mt-4 focus-visible:ring-0 px-0"
        autoFocus
      />

      <div className="pt-4 border-t flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
          {isSaving ? "Salvando..." : "Salvar nota"}
        </Button>
      </div>
    </div>
  );
}
