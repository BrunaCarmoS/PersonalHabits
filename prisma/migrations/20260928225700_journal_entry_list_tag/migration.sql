-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_journal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "habitId" TEXT,
    "taskId" TEXT,
    "listId" TEXT,
    CONSTRAINT "journal_entries_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "journal_entries_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "journal_entries_listId_fkey" FOREIGN KEY ("listId") REFERENCES "habit_lists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_journal_entries" ("content", "createdAt", "habitId", "id", "taskId") SELECT "content", "createdAt", "habitId", "id", "taskId" FROM "journal_entries";
DROP TABLE "journal_entries";
ALTER TABLE "new_journal_entries" RENAME TO "journal_entries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
