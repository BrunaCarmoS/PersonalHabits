/*
  Warnings:

  - You are about to drop the column `type` on the `habits` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `tasks` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "habit_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CUSTOM',
    "trackingType" TEXT NOT NULL DEFAULT 'CHECKLIST',
    "goalPolarity" TEXT NOT NULL DEFAULT 'POSITIVE',
    "frequency" TEXT NOT NULL DEFAULT 'DAILY',
    "weekdays" TEXT,
    "timesPerWeek" INTEGER,
    "timesPerDay" INTEGER,
    "unit" TEXT,
    "goal" REAL,
    "timerSeconds" INTEGER,
    "startDate" DATETIME,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "icon" TEXT NOT NULL DEFAULT 'check-circle',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "listId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "habits_listId_fkey" FOREIGN KEY ("listId") REFERENCES "habit_lists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_habits" ("active", "color", "createdAt", "frequency", "goal", "icon", "id", "name", "pinned", "timerSeconds", "timesPerWeek", "unit", "updatedAt", "weekdays") SELECT "active", "color", "createdAt", "frequency", "goal", "icon", "id", "name", "pinned", "timerSeconds", "timesPerWeek", "unit", "updatedAt", "weekdays" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME,
    "dueTime" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "listId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_listId_fkey" FOREIGN KEY ("listId") REFERENCES "habit_lists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("completed", "completedAt", "createdAt", "description", "dueDate", "dueTime", "id", "pinned", "priority", "title", "updatedAt") SELECT "completed", "completedAt", "createdAt", "description", "dueDate", "dueTime", "id", "pinned", "priority", "title", "updatedAt" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
