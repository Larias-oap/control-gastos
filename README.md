# Mis Finanzas

Aplicación web para el control de finanzas personales: registra ingresos y gastos diarios con fecha, categoría, subcategoría, valor y observaciones. El balance se calcula automáticamente (ingresos - gastos) a medida que registras movimientos.

## Funcionalidades

- Registro de ingresos y gastos con fecha, categoría, subcategoría, valor y observaciones.
- Resumen en tiempo real de ingresos, gastos y balance.
- Listado de movimientos con filtro por tipo y opción de eliminar.
- Reportes semanales y mensuales con desglose por categoría.
- Exportación de reportes a Excel (.xlsx) con hojas de resumen, movimientos y totales por categoría.
- Los datos se guardan localmente en el navegador (localStorage), sin necesidad de backend.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

## Stack

React + TypeScript + Vite + Tailwind CSS, con `date-fns` para el manejo de periodos y `xlsx` (SheetJS) para la exportación a Excel.
