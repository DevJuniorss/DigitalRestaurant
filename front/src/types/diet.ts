// types/diet.ts

export type DietaPlan = {
  aluno: Aluno | null;
  nomeDieta: string;
  profissionalResponsavel: string;
  dataInicio: string;
  dataFim: string;
  objetivo: string;
  comorbidades: string;
  refeicoes: Refeicao[];
  observacoesAdicionais: string;
};



export type FoodItem = {
  alimento: string;
  quantidade: number;
  unidade: string;
  observacoes?: string;
  // Valores nutricionais para cálculo
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
};

export type Refeicao = {
  nome: string;
  horario: string;
  alimentos: FoodItem[];
};

export type Aluno = {
  id: string;
  nome: string;
  email: string;
};

export type ResumoNutricional = {
  caloriasTotais: number;
  proteinasTotais: number;
  carboidratosTotais: number;
  gordurasTotais: number;
};
