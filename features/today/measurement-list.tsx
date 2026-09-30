import { getMeasurementHabits, getQuitHabits } from "@/features/habits/queries";
import { MeasurementItem } from "./measurement-item";
import { QuitItem } from "./quit-item";

export async function MeasurementList() {
  const [measurements, quits] = await Promise.all([getMeasurementHabits(), getQuitHabits()]);
  if (measurements.length === 0 && quits.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground mb-2">
        Hábitos: outros · {measurements.length + quits.length}
      </h2>
      <div className="space-y-2">
        {measurements.map((habit) => (
          <MeasurementItem key={habit.id} habit={habit} />
        ))}
        {quits.map((habit) => (
          <QuitItem key={habit.id} habit={habit} />
        ))}
      </div>
    </section>
  );
}