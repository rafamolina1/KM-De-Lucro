export type Freight = {
  id: string;
  user_id: string;
  date: string; // ISO
  origin: string;
  destination: string;
  km: number;
  value: number;
  diesel: number;
  tolls: number;
  other_costs: number;
  profit: number;
  margin: number;
};

export type MonthlySummary = {
  month: string; // YYYY-MM
  totalFreights: number;
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  averageMargin: number;
};

