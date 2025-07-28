"use client";
import { useEffect, useState} from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { WeeklyCalendar } from '../components/WeeklyCalendar/WeeklyCalendar';

type MealGroup = { title: string; items: string[] };
type Meal = { title: string; groups: MealGroup[] };
type WeekCard = { label: string; meal: Meal };


const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

const transformDataToMeal = (data: any): Meal => {
  if (!data || Object.keys(data).length === 0) {
    return { title: 'Cardápio não definido', groups: [] };
  }
  return {
    title: `Cardápio de ${data.diaSemana}`, // Podemos gerar um título dinâmico
    groups: [
      {
        title: 'Proteínas',
        items: [data.carneVermelha, data.carneBranca, data.vegetariana].filter(Boolean),
      },
      {
        title: 'Acompanhamentos',
        items: [data.salada, data.carboidrato1].filter(Boolean),
      },
      {
        title: 'Bebidas',
        items: [data.bebida].filter(Boolean),
      },
    ],
  };
};

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
        const newWeekCards = weekDays.map((day) => ({
          label: day,
          meal: transformDataToMeal(fetchedMeals[day]),
        }));
        setWeekCards(newWeekCards);
      } catch (error) {
        console.error("Error ao buscar os cardápios", error);
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
