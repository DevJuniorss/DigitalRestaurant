import meals from '../fake-api/meals.json';
import { WeeklyCalendar } from '../components/WeeklyCalendar/WeeklyCalendar';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const weekCards = weekDays.map((day, idx) => ({
  label: day,
  meal: meals[idx]
}));

export default function CalendarPage() {
  return (
    <main>
      <WeeklyCalendar weekCards={weekCards} />
    </main>
  );
}
