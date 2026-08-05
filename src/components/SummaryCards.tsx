import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Props {
  totalIncome: number;
  totalExpense: number;
}

export function SummaryCards({ totalIncome, totalExpense }: Props) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-50">Ingresos</span>
          <TrendingUp size={20} className="text-emerald-100" />
        </div>
        <p className="mt-2 text-2xl font-bold">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-50">Gastos</span>
          <TrendingDown size={20} className="text-blue-100" />
        </div>
        <p className="mt-2 text-2xl font-bold">{formatCurrency(totalExpense)}</p>
      </div>

      <div
        className={`rounded-2xl p-5 text-white shadow-lg ${
          balance >= 0
            ? 'bg-gradient-to-br from-teal-500 to-blue-700 shadow-teal-200/50'
            : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-200/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/80">Balance</span>
          <Wallet size={20} className="text-white/80" />
        </div>
        <p className="mt-2 text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>
    </div>
  );
}
