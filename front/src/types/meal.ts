// Tipos de cada grupo de alimentos dentro de uma refeição (usado em LunchCard, WeeklyCalendar)
export type MealGroup = {
  title: string;
  items: string[];
};

// Estrutura completa de uma refeição (LunchCard, WeeklyCalendar, JSON de refeições)
export type Meal = {
  id: number;
  title: string;
  groups: MealGroup[];
};

// Props para o LunchCard
export type LunchCardProps = {
  title: string;
  groups: MealGroup[];
  onEdit?: () => void;
};
export type LunchGroup = {
  title: string;
  items: string[];
};


// Props para o WeeklyCalendar e variação
export type DayCardProps = {
  label: string;
  meal: Meal;
};

export type WeeklyCalendarProps = {
  weekCards: { label: string; meal: Meal }[];
};

// Tipos de formulário de estrutura de refeições
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