import { useMemo, useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { getCategories } from '../data/categories';
import { todayISO } from '../utils/format';

interface Props {
  onAdd: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('gasto');
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const categories = useMemo(() => getCategories(type), [type]);
  const categoryNames = Object.keys(categories);
  const subcategoryOptions = category ? categories[category] ?? [] : [];

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategory('');
    setSubcategory('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!date) return setError('Selecciona una fecha.');
    if (!category) return setError('Selecciona una categoría.');
    if (!subcategory) return setError('Selecciona una subcategoría.');
    if (!amount || parsedAmount <= 0) return setError('Ingresa un valor válido mayor a 0.');

    onAdd({ type, date, category, subcategory, amount: parsedAmount, notes: notes.trim() });

    setAmount('');
    setNotes('');
    setSubcategory('');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/90 dark:bg-slate-800/70 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg shadow-blue-100/50 dark:shadow-none p-5 sm:p-6 space-y-4"
    >
      <div className="flex gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
        <button
          type="button"
          onClick={() => handleTypeChange('gasto')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            type === 'gasto'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('ingreso')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            type === 'ingreso'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          Ingreso
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Valor
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');
            }}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona...</option>
            {categoryNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Subcategoría
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            <option value="">Selecciona...</option>
            {subcategoryOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          Observaciones
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Detalle opcional..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}

      <button
        type="submit"
        className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow transition-colors ${
          type === 'gasto'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        Registrar {type === 'gasto' ? 'gasto' : 'ingreso'}
      </button>
    </form>
  );
}
