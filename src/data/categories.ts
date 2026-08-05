import type { CategoryMap, TransactionType } from '../types';

export const EXPENSE_CATEGORIES: CategoryMap = {
  HOGAR: ['Arriendo'],
  ALIMENTACIÓN: ['Mercado'],
  SALUD: ['Seguridad Social', 'Coomeva'],
  SERVICIOS: ['Celulares + Disney', 'Luz/gas', 'Acueducto', 'Claro Hogar + Netflix'],
  HIJOS: ['Pensión Colegio', 'Pensión Jardin', 'Almuerzo Mate', 'Futbol - Cursos - Chicos'],
  TRANSPORTE: ['Transporte', 'Combustible'],
  AUTO: ['Seguro Auto', 'Impuestos/Revisión'],
  CREDITOS: ['Tarjetas de crédito', 'Préstamos'],
  OCIO: ['Gastos Ocio'],
  AHORRO: ['Ahorro'],
  OTROS: ['Otros'],
};

export const INCOME_CATEGORIES: CategoryMap = {
  Salario: ['Sueldo mensual', 'Bonificación', 'Otro'],
  Freelance: ['Proyecto', 'Consultoría', 'Otro'],
  Inversiones: ['Dividendos', 'Intereses', 'Rendimientos', 'Otro'],
  Ventas: ['Producto', 'Servicio', 'Otro'],
  Regalos: ['Familia', 'Amigos', 'Otro'],
  Otros: ['Reembolso', 'General'],
};

export function getCategories(type: TransactionType): CategoryMap {
  return type === 'gasto' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}
