import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

type FilterType = 'todos' | TransactionType;

export function TransactionList({ transactions, onDelete }: Props) {
  const [filter, setFilter] = useState<FilterType>('todos');

  const filtered = useMemo(() => {
    const list = filter === 'todos' ? transactions : transactions.filter((t) => t.type === filter);
    return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [transactions, filter]);

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-800/70 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg shadow-blue-100/50 dark:shadow-none p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Movimientos</h2>
        <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-900 p-1 text-sm">
          {(['todos', 'gasto', 'ingreso'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'gasto' ? 'Gastos' : 'Ingresos'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-10 text-sm">
          No hay movimientos registrados todavía.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <div className="space-y-1 max-h-[420px] overflow-y-auto px-2">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    tx.type === 'gasto' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                      {tx.category}
                    </span>
                    <span className="text-xs text-slate-400">· {tx.subcategory}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(tx.date)}
                    {tx.notes && <span className="italic"> — {tx.notes}</span>}
                  </div>
                </div>
                <span
                  className={`font-bold text-sm shrink-0 ${
                    tx.type === 'gasto'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {tx.type === 'gasto' ? '-' : '+'}
                  {formatCurrency(tx.amount)}
                </span>
                <button
                  onClick={() => onDelete(tx.id)}
                  aria-label="Eliminar movimiento"
                  className="shrink-0 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
