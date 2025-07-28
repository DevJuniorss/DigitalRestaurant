import React from 'react';
import { LunchCard } from '../LunchCard/LunchCard';
import styles from './WeeklyCalendar.module.css';

type MealGroup = {
  title: string;
  items: string[];
};

type Meal = {
  title: string;
  groups: MealGroup[];
};

type DayCardProps = {
  label: string;
  meal: Meal;
};

const DayCard: React.FC<DayCardProps> = ({ label, meal }) => (
  <div className={styles.dayCard}>
    <h3 className={styles.dayHeading}>{label}</h3>
    <LunchCard title={meal.title} groups={meal.groups} />
  </div>
);

type WeeklyCalendarProps = {
  weekCards: { label: string; meal: Meal }[];
};

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ weekCards }) => (
  <div className={styles.weeklyGrid}>
    {weekCards.map(({ label, meal }) => (
      <div className={styles.dayColumn} key={label}>
        <div className={styles.dayHeader}>{label}</div>
        <LunchCard title={meal.title} groups={meal.groups} />

      </div>
    ))}
  </div>
);
