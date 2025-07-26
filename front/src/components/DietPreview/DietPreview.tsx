import React from 'react';
import type { FC } from 'react';
import {
  DietaPlan,
  Refeicao,
  Aluno,
  ResumoNutricional,
  FoodItem, 
} from "../../types/diet";
import styles from './DietPreview.module.css';


type DietaComResumo = DietaPlan & {
  resumoNutricional: ResumoNutricional;
};


const DietaPreview: FC<{ dietaData: DietaComResumo }> = ({ dietaData }) => {
  const {
    aluno,
    nomeDieta,
    profissionalResponsavel,
    dataInicio,
    dataFim,
    objetivo,
    refeicoes,
    observacoesAdicionais,
    resumoNutricional 
  } = dietaData;

  if (!aluno) {
    return null;
  }

  return (
    <div className={`${styles.previewContainer} previewContainer`}>
      <header className={styles.header}>
        <h1>{nomeDieta || 'Plano Alimentar'}</h1>
        <p><strong>Aluno(a):</strong> {aluno.nome}</p>
        <p><strong>Profissional Responsável:</strong> {profissionalResponsavel}</p>
        <p><strong>Período:</strong> {dataInicio} a {dataFim}</p>
        <p><strong>Objetivo:</strong> {objetivo}</p>
      </header>

      <section className={styles.resumoNutricional}>
        <h2>Resumo Nutricional Diário (Valores Aproximados)</h2>
        <div className={styles.macros}>
          <span><strong>Calorias:</strong> {resumoNutricional.caloriasTotais} kcal</span>
          <span><strong>Proteínas:</strong> {resumoNutricional.proteinasTotais} g</span>
          <span><strong>Carboidratos:</strong> {resumoNutricional.carboidratosTotais} g</span>
          <span><strong>Gorduras:</strong> {resumoNutricional.gordurasTotais} g</span>
        </div>
      </section>

      <main className={styles.refeicoes}>
        <h2>Refeições</h2>
        {refeicoes.map((refeicao: Refeicao, index: number) => (
          <div key={index} className={styles.refeicao}>
            <h3>{refeicao.nome} ({refeicao.horario})</h3>
            <ul>
              {refeicao.alimentos.map((alimento: FoodItem, aIndex: number) => (
                <li key={aIndex}>
                  {alimento.alimento} - {alimento.quantidade} {alimento.unidade}
                  {alimento.observacoes && <p className={styles.observacoes}><em>Obs: {alimento.observacoes}</em></p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      {observacoesAdicionais && (
        <footer className={styles.footer}>
          <h3>Observações Adicionais</h3>
          <p>{observacoesAdicionais}</p>
        </footer>
      )}
    </div>
  );
};

export default DietaPreview;