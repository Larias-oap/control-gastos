import * as XLSX from 'xlsx';
import type { Transaction } from '../types';
import { formatDate } from './format';
import { summarizeByCategory, type ReportPeriod } from './reports';

export function exportReportToExcel(
  transactions: Transaction[],
  period: ReportPeriod,
  periodLabel: string,
) {
  const incomes = transactions.filter((t) => t.type === 'ingreso');
  const expenses = transactions.filter((t) => t.type === 'gasto');
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  const detailRows = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => ({
      Fecha: formatDate(t.date),
      Tipo: t.type === 'gasto' ? 'Gasto' : 'Ingreso',
      Categoría: t.category,
      Subcategoría: t.subcategory,
      Valor: t.amount,
      Observaciones: t.notes,
    }));

  const summaryRows = [
    { Concepto: 'Periodo', Valor: periodLabel },
    { Concepto: 'Total ingresos', Valor: totalIncome },
    { Concepto: 'Total gastos', Valor: totalExpense },
    { Concepto: 'Balance', Valor: totalIncome - totalExpense },
  ];

  const expenseByCategory = summarizeByCategory(expenses).map((c) => ({
    Categoría: c.category,
    'Total gastado': c.total,
    'N° movimientos': c.count,
  }));

  const incomeByCategory = summarizeByCategory(incomes).map((c) => ({
    Categoría: c.category,
    'Total recibido': c.total,
    'N° movimientos': c.count,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Resumen');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailRows), 'Movimientos');
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(expenseByCategory),
    'Gastos por categoría',
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(incomeByCategory),
    'Ingresos por categoría',
  );

  const safeLabel = periodLabel.replace(/[\\/:*?"<>|]/g, '-');
  XLSX.writeFile(wb, `reporte-${period}-${safeLabel}.xlsx`);
}
