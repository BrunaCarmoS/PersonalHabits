interface ScheduleCheck {
  frequency: string;
  weekdays: string | null;
}

export function isHabitScheduledForDate(habit: ScheduleCheck, date: Date): boolean {
  if (habit.frequency === "DAILY") return true;
  if (habit.frequency === "WEEKDAYS") {
    if (!habit.weekdays) return false;
    const days = habit.weekdays.split(",").map(Number);
    return days.includes(date.getDay());
  }
  return true;
}