// types/diet.ts
export type Aluno = {
  id: number;
  nome: string;
  email: string;
  idade: number;
};
export type FoodItem = {
  alimento: string;
  quantidade: number;
  unidade: string;
  observacoes?: string;
};

export type Refeicao = {
  nome: string;
  horario: string;
  alimentos: FoodItem[];
};

export type DietaPlan = {
  aluno: Aluno | null;
  nomeDieta: string;
  profissionalResponsavel: string;
  dataInicio: string;
  dataFim: string;
  comorbidades: string;
  refeicoes: Refeicao[];
  observacoesAdicionais: string;
};

export type ResumoNutricional = {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
};
