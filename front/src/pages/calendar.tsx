"use client";
import { useEffect, useState} from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { WeeklyCalendar } from '../components/WeeklyCalendar/WeeklyCalendar';

type WeekCard = {
  label: string;
  meal: any;
}

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];


export default function CalendarPage() {
  const [weekCards, setWeekCards] = useState<WeekCard[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchWeekCards = async () => {
      try {
        const cardapioRef = collection(db, 'cardapios');
        const q = query(cardapioRef, where(documentId(), 'in', weekDays));
        const querySnapshot = await getDocs(q);
        const fetchedMeals: { [key: string]: any} = {};
        querySnapshot.forEach((doc) => {
          fetchedMeals[doc.id] = doc.data();
        });
        const newWeekCards: WeekCard[] = weekDays.map((day) => ({
          label: day,
          meal: fetchedMeals[day] || {title: 'Cardápio não definido', groups: []},
        }));
        setWeekCards(newWeekCards);
      } catch (error) {
        console.error("Error ao buscar os cardápios da semana:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeekCards();
  }, []);
  if (loading) {
    return (
      <main>
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando calendário...</p>
      </main>
    );
  }
  return (
    <main>
      <WeeklyCalendar weekCards={weekCards} />
    </main>
  );
}
