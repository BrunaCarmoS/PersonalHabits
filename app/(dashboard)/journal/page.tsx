import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { JournalFeed } from "@/features/journal/journal-feed";

export default function JournalPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-medium tracking-tight">Diário</h1>
      <p className="text-muted-foreground mt-1">Histórico do que você marcou como feito.</p>

      <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Carregando...</p>}>
        <JournalFeed />
      </Suspense>

      <Link
        href="/journal/new"
        className="h-14 w-14 rounded-full shadow-lg fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}