export type SolutionOptionValue =
  | 'crm'
  | 'pos'
  | 'inventario'
  | 'erp'
  | 'automatizacion'
  | 'a-medida'
  | 'otro';

export interface SolutionOption {
  value: SolutionOptionValue;
  label: string;
}

export const SOLUTION_OPTIONS: readonly SolutionOption[] = [
  {
    value: 'crm',
    label: 'CRM & Seguimiento de Clientes',
  },
  {
    value: 'pos',
    label: 'Punto de Venta (POS) & Caja',
  },
  {
    value: 'inventario',
    label: 'Control de Inventario & Stock',
  },
  {
    value: 'erp',
    label: 'ERP & Gestión Integral de Operaciones',
  },
  {
    value: 'automatizacion',
    label: 'Automatización de Procesos & WhatsApp',
  },
  {
    value: 'a-medida',
    label: 'Desarrollo Web / Portal a Medida',
  },
  {
    value: 'otro',
    label: 'Aún no estoy seguro / Deseo asesoría',
  },
] as const;

export function isSolutionOptionValue(
  value: unknown
): value is SolutionOptionValue {
  return (
    typeof value === 'string' &&
    SOLUTION_OPTIONS.some((option) => option.value === value)
  );
}

export function getSolutionOptionLabel(
  value: string | null | undefined
): string {
  if (!value) return '—';

  return (
    SOLUTION_OPTIONS.find((option) => option.value === value)?.label ?? '—'
  );
}
