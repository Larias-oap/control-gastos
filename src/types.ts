export type TransactionType = 'ingreso' | 'gasto';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  category: string;
  subcategory: string;
  amount: number;
  notes: string;
  createdAt: number;
}

export type CategoryMap = Record<string, string[]>;
