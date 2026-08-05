import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { Transaction } from '../types';
import {
  filterByPeriod,
  formatPeriodLabel,
  shiftAnchor,
  summarizeByCategory,
  type ReportPeriod,
} from '../utils/reports';
import { formatCurrency } from '../utils/format';
import { exportReportToExcel } from '../utils/exportExcel';

interface Props {
  transactions: Transaction[];
}

export function Reports({ transactions }: Props) {
  const [period, setPeriod] = useState<ReportPeriod>('semana');
  const [anchor, setAnchor] = useState(new Date());

  const periodTransactions = useMemo(
    () => filterByPeriod(transactions, period, anchor),
    [transactions, period, anchor],
  );

  const incomes = periodTransactions.filter((t) => t.type === 'ingreso');
  const expenses = periodTransactions.filter((t) => t.type === 'gasto');
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = useMemo(() => summarizeByCategory(expenses), [expenses]);
  const incomeByCategory = useMemo(() => summarizeByCategory(incomes), [incomes]);

  const label = formatPeriodLabel(period, anchor);
  const maxExpenseTotal = Math.max(1, ...expenseByCategory.map((c) => c.total));

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-800/70 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg shadow-blue-100/50 dark:shadow-none p-5 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Reportes</h2>
        <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-900 p-1 text-sm">
          {(['semana', 'mes'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setAnchor(new Date());
              }}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                period === p
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {p === 'semana' ? 'Semanal' : 'Mensual'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setAnchor((a) => shiftAnchor(period, a, -1))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
          aria-label="Periodo anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize text-center">
          {label}
        </span>
        <button
          onClick={() => setAnchor((a) => shiftAnchor(period, a, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
          aria-label="Periodo siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-center">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Ingresos</p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4 text-center">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Gastos</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div
          className={`rounded-xl p-4 text-center ${
            balance >= 0
              ? 'bg-teal-50 dark:bg-teal-950/40'
              : 'bg-rose-50 dark:bg-rose-950/40'
          }`}
        >
          <p
            className={`text-xs font-medium ${
              balance >= 0
                ? 'text-teal-700 dark:text-teal-400'
                : 'text-rose-700 dark:text-rose-400'
            }`}
          >
            Balance
          </p>
          <p
            className={`text-lg font-bold ${
              balance >= 0
                ? 'text-teal-700 dark:text-teal-300'
                : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {expenseByCategory.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Gastos por categoría
          </h3>
          <div className="space-y-2">
            {expenseByCategory.map((c) => (
              <div key={c.category} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{c.category}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {formatCurrency(c.total)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${(c.total / maxExpenseTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {incomeByCategory.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Ingresos por categoría
          </h3>
          <div className="space-y-2">
            {incomeByCategory.map((c) => (
              <div key={c.category} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{c.category}</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(c.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {periodTransactions.length === 0 && (
        <p className="text-center text-slate-400 py-6 text-sm">
          No hay movimientos en este periodo.
        </p>
      )}

      <button
        onClick={() => exportReportToExcel(periodTransactions, period, label)}
        disabled={periodTransactions.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={16} />
        Descargar reporte en Excel
      </button>
    </div>
  );
}
