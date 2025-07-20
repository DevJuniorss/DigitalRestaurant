import React from 'react';
import styles from './LunchCard.module.css';
import { LunchCardProps } from "../../types/meal"; // Importar tipos de meal.ts


export const LunchCard: React.FC<LunchCardProps> = ({
  title,
  groups,
  onEdit,
}) => (
  <section className={styles.card} aria-labelledby="almoco-title">
    <h2 id="almoco-title" className={styles.heading}>{title}</h2>
    <ul className={styles.groupList}>
      {groups.map(group => (
        <li key={group.title}>
          <div className={styles.groupTitle}>{group.title}</div>
          <ul>
            {group.items.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
    <button
      className={styles.editButton}
      aria-label={`Editar cardápio de ${title}`}
      onClick={onEdit}
      type="button"
    >
      Editar
    </button>
  </section>
);
