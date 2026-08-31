export type SolutionOptionValue =
  | 'crm'
  | 'pos'
  | 'inventario'
  | 'erp'
  | 'automatizacion'
  | 'a-medida'
  | 'otro';

export const SOLUTION_OPTIONS = [
  { value: 'crm', label: 'CRM & Seguimiento de Clientes' },
  { value: 'pos', label: 'Punto de Venta (POS) & Caja' },
  { value: 'inventario', label: 'Control de Inventario & Stock' },
  { value: 'erp', label: 'ERP & Gestión Integral de Operaciones' },
  { value: 'automatizacion', label: 'Automatización de Procesos & WhatsApp' },
  { value: 'a-medida', label: 'Desarrollo Web / Portal a Medida' },
  { value: 'otro', label: 'Aún no estoy seguro / Deseo asesoría' },
] as const satisfies readonly {
  value: SolutionOptionValue;
  label: string;
}[];
