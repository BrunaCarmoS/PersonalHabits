-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "habitId" TEXT,
    "taskId" TEXT,
    CONSTRAINT "journal_entries_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "journal_entries_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "count" INTEGER NOT NULL DEFAULT 0,
    "value" REAL,
    "notes" TEXT,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_habit_logs" ("completed", "date", "habitId", "id", "loggedAt", "notes", "value") SELECT "completed", "date", "habitId", "id", "loggedAt", "notes", "value" FROM "habit_logs";
DROP TABLE "habit_logs";
ALTER TABLE "new_habit_logs" RENAME TO "habit_logs";
CREATE UNIQUE INDEX "habit_logs_habitId_date_key" ON "habit_logs"("habitId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
