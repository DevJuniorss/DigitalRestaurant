import React, { FormEvent } from "react";
import styles from "./AddMeal.module.css";

const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo"
];

type AddMealProps = {
  onCancel: () => void;
  onSave: (data: any) => void;
};

export const AddMeal: React.FC<AddMealProps> = ({ onCancel, onSave }) => {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    onSave(data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Adicionar refeição"
      className={styles.form}
    >
      <div className={styles.formGroup}>
        <label htmlFor="diaSemana" className={styles.label}>
          Dia da semana
        </label>
        <select
          id="diaSemana"
          name="diaSemana"
          required
          className={styles.select}
        >
          {diasSemana.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <AccessibleInput label="Opção de carne vermelha" id="carneVermelha" />
      <AccessibleInput label="Opção de carne branca" id="carneBranca" />
      <AccessibleInput label="Opção de vegetariana" id="vegetariana" />
      <AccessibleInput label="Ingredientes da Salada" id="salada" />
      <AccessibleInput label="Carboidratos" id="carboidrato1" />
      <AccessibleInput label="Opção de bebida" id="bebida" />


      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancel}>
          Cancel
        </button>
        <button type="submit" className={styles.save}>
          Salvar
        </button>
      </div>
    </form>
  );
};

const AccessibleInput: React.FC<{
  label: string;
  id: string;
  placeholder?: string;
}> = ({ label, id, placeholder }) => (
  <div className={styles.formGroup}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <input
      id={id}
      name={id}
      placeholder={placeholder || "Digite a refeição"}
      autoComplete="off"
      className={styles.input}
    />
  </div>
);

const AccessibleTextarea: React.FC<{
  label: string;
  id: string;
  placeholder?: string;
}> = ({ label, id, placeholder }) => (
  <div className={styles.formGroup}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      placeholder={placeholder || ""}
      rows={3}
      className={styles.textarea}
    />
  </div>
);
