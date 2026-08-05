import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { Transaction } from '../types';

export type ReportPeriod = 'semana' | 'mes';

function parseISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getPeriodRange(period: ReportPeriod, anchor: Date) {
  if (period === 'semana') {
    return {
      start: startOfWeek(anchor, { weekStartsOn: 1 }),
      end: endOfWeek(anchor, { weekStartsOn: 1 }),
    };
  }
  return { start: startOfMonth(anchor), end: endOfMonth(anchor) };
}

export function formatPeriodLabel(period: ReportPeriod, anchor: Date): string {
  const { start, end } = getPeriodRange(period, anchor);
  if (period === 'semana') {
    return `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`;
  }
  return format(start, 'MMMM yyyy', { locale: es });
}

export function filterByPeriod(
  transactions: Transaction[],
  period: ReportPeriod,
  anchor: Date,
): Transaction[] {
  const { start, end } = getPeriodRange(period, anchor);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return transactions.filter((tx) => {
    const d = parseISO(tx.date);
    return d >= start && d <= end;
  });
}

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

export function summarizeByCategory(transactions: Transaction[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const tx of transactions) {
    const existing = map.get(tx.category) ?? { category: tx.category, total: 0, count: 0 };
    existing.total += tx.amount;
    existing.count += 1;
    map.set(tx.category, existing);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function shiftAnchor(period: ReportPeriod, anchor: Date, direction: 1 | -1): Date {
  const next = new Date(anchor);
  if (period === 'semana') {
    next.setDate(next.getDate() + direction * 7);
  } else {
    next.setMonth(next.getMonth() + direction);
  }
  return next;
}
