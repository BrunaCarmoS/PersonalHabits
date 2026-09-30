import { Suspense } from "react";
import { JournalFeed } from "@/features/journal/journal-feed";

export default function JournalPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium tracking-tight">Diário</h1>
      <p className="text-muted-foreground mt-1">Histórico do que você marcou como feito.</p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Carregando...</p>}>
        <JournalFeed />
      </Suspense>
    </div>
  );
}