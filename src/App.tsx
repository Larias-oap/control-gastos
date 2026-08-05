import { useMemo, useState } from 'react';
import { LayoutDashboard, PiggyBank, FileBarChart } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Reports } from './components/Reports';

type Tab = 'inicio' | 'reportes';

function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [tab, setTab] = useState<Tab>('inicio');

  const totals = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    for (const tx of transactions) {
      if (tx.type === 'ingreso') totalIncome += tx.amount;
      else totalExpense += tx.amount;
    }
    return { totalIncome, totalExpense };
  }, [transactions]);

  return (
    <div className="min-h-svh bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow">
              <PiggyBank size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Mis Finanzas
              </h1>
              <p className="text-xs text-slate-400 leading-tight">Control de ingresos y gastos</p>
            </div>
          </div>

          <nav className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-sm">
            <button
              onClick={() => setTab('inicio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                tab === 'inicio'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">Inicio</span>
            </button>
            <button
              onClick={() => setTab('reportes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                tab === 'reportes'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <FileBarChart size={15} />
              <span className="hidden sm:inline">Reportes</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <SummaryCards totalIncome={totals.totalIncome} totalExpense={totals.totalExpense} />

        {tab === 'inicio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <TransactionForm onAdd={addTransaction} />
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        ) : (
          <Reports transactions={transactions} />
        )}
      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        Tus datos se guardan localmente en este navegador.
      </footer>
    </div>
  );
}

export default App;
